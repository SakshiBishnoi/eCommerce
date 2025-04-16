import express, { Request, Response } from 'express';
import Product from '../models/Product';

const router = express.Router();

// Paginated, filterable products endpoint
router.get('/', async (req: Request, res: Response) => {
  const { search = '', category, offset = 0, limit = 20 } = req.query;
  const query: any = {};

  if (category) {
    query.category = category;
  }
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
    ];
  }

  const total = await Product.countDocuments(query);
  const products = await Product.find(query)
    .skip(Number(offset))
    .limit(Number(limit))
    .populate('category');

  res.json({ products, total });
});

// Get product by id
router.get('/:id', async (req: Request, res: Response) => {
  const product = await Product.findById(req.params.id).populate('category');
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