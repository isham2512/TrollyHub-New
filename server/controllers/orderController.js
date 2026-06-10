import Product from "../models/Product.js";
import Order from "../models/Order.js";
import Bill from "../models/Bill.js";
import StockLog from "../models/StockLog.js";
import User from "../models/User.js";
import { generateBillNumber } from "../utils/billNumber.js";

export const createOrder = async (req, res) => {
  const { customerMobile, customerName, items = [], payment_method = "Cash", tax = 0, discount = 0 } = req.body;

  if (!items.length) {
    return res.status(400).json({ message: "At least one item is required" });
  }

  let customer = null;
  if (customerMobile) {
    customer = await User.findOne({ mobile: customerMobile, role: "customer" });
    if (!customer) {
      customer = await User.create({
        name: customerName || "Walk-in Customer",
        role: "customer",
        mobile: customerMobile
      });
    } else if (customerName && customer.name === "Walk-in Customer") {
      // Update name if it was previously generic
      customer.name = customerName;
      await customer.save();
    }
  }

  const normalizedItems = [];
  let total_amount = 0;

  for (const item of items) {
    const product = await Product.findById(item.product_id);
    if (!product) {
      return res.status(404).json({ message: `Product not found: ${item.product_id}` });
    }

    if (product.stock < item.quantity) {
      return res.status(400).json({ message: `Insufficient stock for ${product.product_name}` });
    }

    const subtotal = product.price * item.quantity;
    normalizedItems.push({
      product_id: product._id,
      product_name: product.product_name,
      quantity: item.quantity,
      price: product.price,
      subtotal
    });
    total_amount += subtotal;
  }

  for (const item of normalizedItems) {
    const product = await Product.findById(item.product_id);
    const oldStock = product.stock;
    product.stock = product.stock - item.quantity;
    await product.save();

    await StockLog.create({
      product_id: product._id,
      updated_by: req.user.id,
      old_stock: oldStock,
      new_stock: product.stock,
      change_type: "billing"
    });
  }

  const final_amount = Math.max(total_amount + Number(tax || 0) - Number(discount || 0), 0);

  const isCustomer = req.user.role === "customer";
  
  const order = await Order.create({
    customer_id: isCustomer ? req.user.id : customer?._id,
    employee_id: isCustomer ? undefined : req.user.id,
    total_amount,
    date: new Date(),
    status: isCustomer ? "Pending" : "Completed",
    payment_method,
    order_type: isCustomer ? "Takeaway" : "In-Store",
    takeaway_time: req.body.takeaway_time || undefined,
    items: normalizedItems
  });

  const bill = await Bill.create({
    order_id: order._id,
    bill_number: generateBillNumber(),
    total_amount,
    tax_amount: Number(tax || 0),
    discount: Number(discount || 0),
    final_amount
  });

  const populatedOrder = await Order.findById(order._id)
    .populate("customer_id", "name mobile")
    .populate("employee_id", "name role");

  res.status(201).json({
    order: populatedOrder,
    bill
  });
};

export const getOrders = async (req, res) => {
  let query = {};
  if (req.user.role === "customer") query.customer_id = req.user.id;
  if (req.user.role === "employee") {
    // Employees can see their own orders AND all pending takeaway orders
    query = {
      $or: [
        { employee_id: req.user.id },
        { order_type: "Takeaway", status: "Pending" }
      ]
    };
  }

  const orders = await Order.find(query)
    .populate("customer_id", "name mobile")
    .populate("employee_id", "name")
    .sort({ createdAt: -1 });

  res.json(orders);
};

export const getOrderById = async (req, res) => {
  const order = await Order.findById(req.params.id)
    .populate("customer_id", "name mobile")
    .populate("employee_id", "name");
  if (!order) return res.status(404).json({ message: "Order not found" });

  if (req.user.role === "customer" && String(order.customer_id?._id) !== String(req.user.id)) {
    return res.status(403).json({ message: "Access denied" });
  }

  if (req.user.role === "employee" && String(order.employee_id?._id) !== String(req.user.id)) {
    return res.status(403).json({ message: "Access denied" });
  }

  res.json(order);
};

export const getBills = async (req, res) => {
  let orderQuery = {};
  if (req.user.role === "customer") orderQuery.customer_id = req.user.id;
  if (req.user.role === "employee") orderQuery.employee_id = req.user.id;

  const orders = await Order.find(orderQuery).select("_id");
  const orderIds = orders.map((o) => o._id);

  const bills = await Bill.find(
    req.user.role === "admin" || req.user.role === "manager" ? {} : { order_id: { $in: orderIds } }
  ).populate("order_id").sort({ created_at: -1 });

  res.json(bills);
};

export const updateOrderStatus = async (req, res) => {
  const { status } = req.body;
  const order = await Order.findById(req.params.id);
  
  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  order.status = status;
  // If marking as completed, we assign the employee who handed it over
  if (status === "Completed") {
    order.employee_id = req.user.id;
  }
  
  await order.save();
  res.json({ message: "Order status updated", order });
};
