import express, { Request, Response } from 'express';
import Order from '../models/Order';
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

// Place order (simulate payment)
router.post('/', authMiddleware, async (req: Request, res: Response) => {
  // @ts-ignore
  const userId = req.user.id;
  const { products, total } = req.body;
  // Simulate payment always successful
  const order = await Order.create({ user: userId, products, total, status: 'paid' });
  res.status(201).json({ message: 'Order placed successfully', order });
});

// Admin: Get all orders (for dashboard)
router.get('/all', authMiddleware, adminMiddleware, async (_req: Request, res: Response) => {
  const orders = await Order.find().populate('user').sort({ createdAt: -1 });
  res.json(orders);
});

export default router; 