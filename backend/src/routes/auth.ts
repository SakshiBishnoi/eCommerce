import express, { Request, Response } from 'express';
import User from '../models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
// @ts-ignore
const expressValidator = require('express-validator');
import authMiddleware from '../utils/authMiddleware';

const { body, validationResult } = expressValidator;

const router = express.Router();

// Register
router.post('/register',
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const { name, email, password } = req.body;
      const existing = await User.findOne({ email });
      if (existing) return res.status(400).json({ message: 'Email already in use' });
      const hashed = await bcrypt.hash(password, 10);
      const user = await User.create({ name, email, password: hashed, role: 'user' });
      res.status(201).json({ id: user._id, email: user.email });
    } catch (err) {
      res.status(500).json({ message: 'Registration failed', error: err });
    }
  }
);

// Login
router.post('/login',
  [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required'),
    body('code').optional().isString(),
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const { email, password, code } = req.body;
      const user = await User.findOne({ email });
      if (!user) return res.status(400).json({ message: 'Invalid credentials' });
      const valid = await bcrypt.compare(password, user.password);
      if (!valid) return res.status(400).json({ message: 'Invalid credentials' });
      // Admin code logic
      if (code === '1A2B') {
        if (user.role !== 'admin') {
          return res.status(403).json({ message: 'Admin code is only for admin users' });
        }
      } else {
        if (user.role === 'admin') {
          return res.status(403).json({ message: 'Admin must provide the correct code' });
        }
      }
      const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || 'secret', { expiresIn: '1d' });
      res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
    } catch (err) {
      res.status(500).json({ message: 'Login failed', error: err });
    }
  }
);

// Get current user info
router.get('/me', authMiddleware, async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const userId = req.user.id;
    const user = await User.findById(userId).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch user', error: err });
  }
});

export default router;