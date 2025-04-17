import express, { Request, Response } from 'express';
import Product from '../models/Product';
import mongoose from 'mongoose';
import authMiddleware from '../utils/authMiddleware';
import adminMiddleware from '../utils/adminMiddleware';

const router = express.Router();

// Paginated, filterable products endpoint
router.get('/', async (req: Request, res: Response) => {
  try {
    const { search = '', category, offset = 0, limit = 20 } = req.query;
    const query: any = {};

    if (category && mongoose.Types.ObjectId.isValid(category as string)) {
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
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get product by id
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const product = await Product.findById(req.params.id).populate('category');
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create product (admin only)
router.post('/', authMiddleware, adminMiddleware, async (req: Request, res: Response) => {
  try {
    const { name, description, price, category, stock, images } = req.body;
    
    if (!name || !description || !price || !category || stock === undefined) {
      return res.status(400).json({ message: 'All required fields must be provided' });
    }
    
    const product = await Product.create({ 
      name, 
      description, 
      price: Number(price), 
      category, 
      stock: Number(stock), 
      images: images || [] 
    });
    
    res.status(201).json(product);
  } catch (err) {
    console.error('Error creating product:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update product (admin only)
router.put('/:id', authMiddleware, adminMiddleware, async (req: Request, res: Response) => {
  try {
    const { name, description, price, category, stock, images } = req.body;
    
    const updateData: any = {};
    if (name) updateData.name = name;
    if (description) updateData.description = description;
    if (price !== undefined) updateData.price = Number(price);
    if (category) updateData.category = category;
    if (stock !== undefined) updateData.stock = Number(stock);
    if (images) updateData.images = images;
    
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate('category');
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.json(product);
  } catch (err) {
    console.error('Error updating product:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete product (admin only)
router.delete('/:id', authMiddleware, adminMiddleware, async (req: Request, res: Response) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    console.error('Error deleting product:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router; 