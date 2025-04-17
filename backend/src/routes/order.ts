import express, { Request, Response } from 'express';
import Order from '../models/Order';
import Cart from '../models/Cart';
import authMiddleware from '../utils/authMiddleware';
import adminMiddleware from '../utils/adminMiddleware';

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

// Admin: Get all orders (for dashboard)
router.get('/all', authMiddleware, adminMiddleware, async (_req: Request, res: Response) => {
  const orders = await Order.find().populate('user').sort({ createdAt: -1 });
  res.json(orders);
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

export default router; 