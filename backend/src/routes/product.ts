import express, { Request, Response } from 'express';
import Product from '../models/Product';

const router = express.Router();

// Get all products
router.get('/', async (_req: Request, res: Response) => {
  const products = await Product.find();
  res.json(products);
});

// Get product by id
router.get('/:id', async (req: Request, res: Response) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: 'Not found' });
  res.json(product);
});

// Create product (protected, stub for now)
router.post('/', async (req: Request, res: Response) => {
  // TODO: Add authentication middleware
  const { name, description, price, category, stock, images } = req.body;
  const product = await Product.create({ name, description, price, category, stock, images });
  res.status(201).json(product);
});

export default router; 