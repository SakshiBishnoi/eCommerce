import express, { Request, Response } from 'express';
import Category from '../models/Category';

const router = express.Router();

// Get all categories
router.get('/', async (_req: Request, res: Response) => {
  const categories = await Category.find();
  res.json(categories);
});

// Create category (protected, stub for now)
router.post('/', async (req: Request, res: Response) => {
  // TODO: Add authentication middleware
  const { name, description } = req.body;
  const category = await Category.create({ name, description });
  res.status(201).json(category);
});

export default router; 