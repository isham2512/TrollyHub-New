import Product from "../models/Product.js";
import StockLog from "../models/StockLog.js";

export const updateStock = async (req, res) => {
  const { stock, price } = req.body;
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: "Product not found" });

  if (stock !== undefined) {
    if (stock < 0) return res.status(400).json({ message: "Stock cannot be negative" });
    await StockLog.create({
      product_id: product._id,
      updated_by: req.user.id,
      old_stock: product.stock,
      new_stock: stock,
      change_type: "manual"
    });
    product.stock = stock;
  }

  if (price !== undefined) {
    if (price < 0) return res.status(400).json({ message: "Price cannot be negative" });
    product.price = price;
  }

  await product.save();
  res.json(product);
};

export const getLowStock = async (req, res) => {
  const products = await Product.find({ stock: { $lte: 10 } }).sort({ stock: 1 });
  res.json(products);
};

export const getStockLogs = async (req, res) => {
  const logs = await StockLog.find()
    .populate("product_id", "product_name")
    .populate("updated_by", "name role")
    .sort({ createdAt: -1 })
    .limit(100);
  res.json(logs);
};
