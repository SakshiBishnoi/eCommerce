import express, { Request, Response } from 'express';
import User from '../models/User';
import Order from '../models/Order';
import authMiddleware from '../utils/authMiddleware';
import adminMiddleware from '../utils/adminMiddleware';

const router = express.Router();

// Get current user profile
router.get('/me', authMiddleware, async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const userId = req.user.id;
    const user = await User.findById(userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin: Get all users
router.get('/', authMiddleware, adminMiddleware, async (_req: Request, res: Response) => {
  try {
    const users = await User.find().select('-password');
    
    // Count orders for each user
    const usersWithCounts = await Promise.all(
      users.map(async (user) => {
        const orderCount = await Order.countDocuments({ user: user._id });
        return {
          ...user.toObject(),
          orderCount
        };
      })
    );
    
    res.json(usersWithCounts);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin: Get user by ID with order history
router.get('/:id', authMiddleware, adminMiddleware, async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const orders = await Order.find({ user: req.params.id }).sort({ createdAt: -1 });
    
    res.json({
      user,
      orders
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin: Update user (such as changing role)
router.put('/:id', authMiddleware, adminMiddleware, async (req: Request, res: Response) => {
  const { role, name, email } = req.body;
  
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    if (role) user.role = role;
    if (name) user.name = name;
    if (email) user.email = email;
    
    await user.save();
    
    res.json({
      message: 'User updated successfully',
      user: {
        ...user.toObject(),
        password: undefined
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin: Block user
router.put('/:id/block', authMiddleware, adminMiddleware, async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    user.blocked = true;
    await user.save();
    res.json({ message: 'User blocked', user: { ...user.toObject(), password: undefined } });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin: Delete user
router.delete('/:id', authMiddleware, adminMiddleware, async (req: Request, res: Response) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router; 