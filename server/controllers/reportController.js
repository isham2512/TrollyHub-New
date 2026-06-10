import Order from "../models/Order.js";
import Product from "../models/Product.js";
import Bill from "../models/Bill.js";

export const getDashboardStats = async (req, res) => {
  const totalProducts = await Product.countDocuments();
  const lowStockCount = await Product.countDocuments({ stock: { $lte: 10 } });
  
  // Today's range (local +05:30)
  const now = new Date();
  const todayStart = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
  todayStart.setHours(0, 0, 0, 0);
  // Adjust back to UTC for the query
  const startUTC = new Date(todayStart.getTime() - (5.5 * 60 * 60 * 1000));

  const totalOrders = await Order.countDocuments({ createdAt: { $gte: startUTC } });
  const totalBills = await Bill.countDocuments({ created_at: { $gte: startUTC } });

  const orderAgg = await Order.aggregate([
    { $match: { createdAt: { $gte: startUTC } } },
    { $group: { _id: null, totalSales: { $sum: "$total_amount" } } }
  ]);

  const totalSales = orderAgg[0]?.totalSales || 0;

  const recentOrders = await Order.find()
    .sort({ createdAt: -1 })
    .limit(5)
    .populate("customer_id", "name mobile")
    .populate("employee_id", "name");

  const topProducts = await Order.aggregate([
    { $unwind: "$items" },
    { $group: { _id: "$items.product_name", qtySold: { $sum: "$items.quantity" }, revenue: { $sum: "$items.subtotal" } } },
    { $sort: { revenue: -1 } },
    { $limit: 5 }
  ]);

  const lowStockItems = await Product.find({ stock: { $lte: 10 } }).sort({ stock: 1 }).limit(4);

  res.json({
    totalProducts,
    lowStockCount,
    totalOrders,
    totalBills,
    totalSales,
    recentOrders,
    topProducts,
    lowStockItems
  });
};

export const getSalesReport = async (req, res) => {
  const salesByDay = await Order.aggregate([
    {
      $group: {
        _id: {
          year: { $year: { date: "$createdAt", timezone: "+05:30" } },
          month: { $month: { date: "$createdAt", timezone: "+05:30" } },
          day: { $dayOfMonth: { date: "$createdAt", timezone: "+05:30" } }
        },
        orders: { $sum: 1 },
        revenue: { $sum: "$total_amount" }
      }
    },
    { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } }
  ]);

  const topProducts = await Order.aggregate([
    { $unwind: "$items" },
    { $group: { _id: "$items.product_name", count: { $sum: "$items.quantity" }, revenue: { $sum: "$items.subtotal" } } },
    { $sort: { revenue: -1 } },
    { $limit: 10 }
  ]);

  const lowStock = await Product.find({ stock: { $lte: 10 } }).sort({ stock: 1 });
  res.json({ salesByDay, topProducts, lowStock });
};
