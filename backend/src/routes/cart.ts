import express, { Request, Response } from 'express';
import Cart from '../models/Cart';
import authMiddleware from '../utils/authMiddleware';

const router = express.Router();

// Get current user's cart
router.get('/', authMiddleware, async (req: Request, res: Response) => {
  // @ts-ignore
  const userId = req.user.id;
  let cart = await Cart.findOne({ user: userId }).populate('items.product');
  if (!cart) cart = await Cart.create({ user: userId, items: [] });
  res.json(cart);
});

// Set/update current user's cart
router.post('/', authMiddleware, async (req: Request, res: Response) => {
  // @ts-ignore
  const userId = req.user.id;
  const { items } = req.body;
  let cart = await Cart.findOneAndUpdate(
    { user: userId },
    { items, updatedAt: new Date() },
    { new: true, upsert: true }
  ).populate('items.product');
  res.json(cart);
});

// Clear current user's cart
router.delete('/', authMiddleware, async (req: Request, res: Response) => {
  // @ts-ignore
  const userId = req.user.id;
  await Cart.findOneAndUpdate(
    { user: userId },
    { items: [], updatedAt: new Date() }
  );
  res.json({ message: 'Cart cleared' });
});

export default router; 