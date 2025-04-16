import express, { Request, Response } from 'express';
import Order from '../models/Order';

const router = express.Router();

// Get all orders (stub, should be protected)
router.get('/', async (_req: Request, res: Response) => {
  // TODO: Add authentication and user filtering
  const orders = await Order.find();
  res.json(orders);
});

// Create order (stub, should be protected)
router.post('/', async (req: Request, res: Response) => {
  // TODO: Add authentication and user association
  const { user, products, total, status } = req.body;
  const order = await Order.create({ user, products, total, status });
  res.status(201).json(order);
});

export default router; 