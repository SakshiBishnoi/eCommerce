import express, { Request, Response } from 'express';
import Order from '../models/Order';
import Cart from '../models/Cart';
import authMiddleware from '../utils/authMiddleware';
import adminMiddleware from '../utils/adminMiddleware';
import User from '../models/User';
import Product from '../models/Product';

const router = express.Router();

// Get all orders for current user
router.get('/', authMiddleware, async (req: Request, res: Response) => {
  // @ts-ignore
  const userId = req.user.id;
  const orders = await Order.find({ user: userId }).sort({ createdAt: -1 });
  res.json(orders);
});

// Place order (use cart from MongoDB)
router.post('/', authMiddleware, async (req: Request, res: Response) => {
  // @ts-ignore
  const userId = req.user.id;
  // Fetch cart from MongoDB
  const cart = await Cart.findOne({ user: userId }).populate('items.product');
  if (!cart || !cart.items.length) {
    return res.status(400).json({ message: 'Cart is empty' });
  }
  // Calculate total
  const products = cart.items.map(item => ({
    product: item.product._id || item.product,
    quantity: item.quantity,
  }));
  const total = cart.items.reduce((sum, item) => {
    // @ts-ignore
    return sum + (item.product.price || 0) * item.quantity;
  }, 0);
  // Simulate payment always successful
  const order = await Order.create({ user: userId, products, total, status: 'paid' });
  // Clear cart after order
  cart.items = [];
  await cart.save();
  res.status(201).json({ message: 'Order placed successfully', order });
});

// Admin: Get all orders (for dashboard, paginated)
router.get('/all', authMiddleware, adminMiddleware, async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 20;
  const skip = (page - 1) * limit;
  const [orders, total] = await Promise.all([
    Order.find({}, 'user status total createdAt')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('user', 'email'),
    Order.countDocuments()
  ]);
  res.json({ orders, total, page, pages: Math.ceil(total / limit) });
});

// Admin: Update order status
router.put('/:id/status', authMiddleware, adminMiddleware, async (req: Request, res: Response) => {
  const { status } = req.body;
  const validStatuses = ['pending', 'paid', 'shipped', 'delivered', 'cancelled'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ message: 'Invalid status' });
  }
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    ).populate('user');
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// In-memory cache for summary
let summaryCache: any = null;
let summaryCacheTime = 0;
router.get('/summary', authMiddleware, adminMiddleware, async (_req: Request, res: Response) => {
  try {
    const now = Date.now();
    // Return cached data if available and fresh (30 seconds)
    if (summaryCache && now - summaryCacheTime < 30000) {
      return res.json(summaryCache);
    }

    const currentDate = new Date();
    const startOfThisMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const startOfLastMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
    const startOf30DaysAgo = new Date(currentDate.getTime() - 30 * 24 * 60 * 60 * 1000);

    // Use a more efficient single aggregation pipeline for all summary data
    // This reduces multiple database round trips to just one or two efficient queries
    const [orderStats, userStats, productCount] = await Promise.all([
      // Order stats with all metrics in one query
      Order.aggregate([
        {
          $facet: {
            // Total orders count
            "totalOrders": [{ $count: "count" }],
            // Last month orders count
            "lastMonthOrders": [
              { $match: { createdAt: { $gte: startOfLastMonth, $lt: startOfThisMonth } } },
              { $count: "count" }
            ],
            // Total revenue
            "totalRevenue": [
              { $group: { _id: null, total: { $sum: "$total" } } }
            ],
            // Last month revenue
            "lastMonthRevenue": [
              { $match: { createdAt: { $gte: startOfLastMonth, $lt: startOfThisMonth } } },
              { $group: { _id: null, total: { $sum: "$total" } } }
            ],
            // Recent orders
            "recentOrders": [
              { $sort: { createdAt: -1 } },
              { $limit: 5 },
              { $lookup: {
                  from: "users",
                  localField: "user",
                  foreignField: "_id",
                  as: "user"
                }
              },
              { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } }
            ],
            // Sales by day (last 30 days)
            "salesByDay": [
              { $match: { createdAt: { $gte: startOf30DaysAgo } } },
              { $group: {
                  _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                  totalSales: { $sum: "$total" },
                  count: { $sum: 1 }
                }
              },
              { $sort: { _id: 1 } }
            ],
            // Top products
            "topProducts": [
              { $unwind: "$products" },
              { $group: {
                  _id: "$products.product",
                  totalSold: { $sum: "$products.quantity" }
                }
              },
              { $sort: { totalSold: -1 } },
              { $limit: 5 },
              { $lookup: {
                  from: "products",
                  localField: "_id",
                  foreignField: "_id",
                  as: "productDetails"
                }
              },
              { $unwind: { path: "$productDetails", preserveNullAndEmptyArrays: true } },
              { $project: {
                  _id: 1,
                  totalSold: 1,
                  name: "$productDetails.name",
                  price: "$productDetails.price"
                }
              }
            ]
          }
        }
      ]),
      // User stats
      User.aggregate([
        {
          $facet: {
            "totalUsers": [{ $count: "count" }],
            "lastMonthUsers": [
              { $match: { createdAt: { $gte: startOfLastMonth, $lt: startOfThisMonth } } },
              { $count: "count" }
            ]
          }
        }
      ]),
      // Total products count (simple and efficient)
      Product.countDocuments()
    ]);

    // Process aggregation results with safe fallbacks
    const totalOrders = orderStats[0].totalOrders[0]?.count || 0;
    const lastMonthOrders = orderStats[0].lastMonthOrders[0]?.count || 0;
    const totalRevenue = orderStats[0].totalRevenue[0]?.total || 0;
    const lastMonthRevenue = orderStats[0].lastMonthRevenue[0]?.total || 0;
    const totalUsers = userStats[0].totalUsers[0]?.count || 0;
    const lastMonthUsers = userStats[0].lastMonthUsers[0]?.count || 0;

    // Safely calculate percentage changes
    const percent = (curr: number, prev: number): number => 
      prev === 0 ? 0 : Math.round(((curr - prev) / Math.max(prev, 1)) * 100);

    // Format result object
    const result = {
      totalOrders,
      totalUsers,
      totalRevenue,
      totalProducts: productCount,
      ordersChange: percent(totalOrders, lastMonthOrders),
      usersChange: percent(totalUsers, lastMonthUsers),
      revenueChange: percent(totalRevenue, lastMonthRevenue),
      productsChange: 0, // We don't track monthly product changes in this implementation
      recentOrders: orderStats[0].recentOrders || [],
      salesByDay: orderStats[0].salesByDay || [],
      topProducts: orderStats[0].topProducts || []
    };

    // Save to cache
    summaryCache = result;
    summaryCacheTime = now;
    
    // Return response
    return res.json(result);
  } catch (err) {
    console.error('Dashboard summary error:', err);
    return res.status(500).json({ 
      message: 'Failed to fetch dashboard summary',
      error: err instanceof Error ? err.message : String(err)
    });
  }
});

export default router; 