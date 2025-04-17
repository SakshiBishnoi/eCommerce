import express, { Request, Response } from 'express';
import Category from '../models/Category';
import Product from '../models/Product';
import authMiddleware from '../utils/authMiddleware';
import adminMiddleware from '../utils/adminMiddleware';

const router = express.Router();

// Get all categories
router.get('/', async (req, res) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 20;
  const skip = (page - 1) * limit;
  const [categories, total] = await Promise.all([
    Category.find({}, 'name description createdAt')
      .skip(skip)
      .limit(limit),
    Category.countDocuments()
  ]);
  res.json({ categories, total, page, pages: Math.ceil(total / limit) });
});

// Get category by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    
    const products = await Product.find({ category: category._id });
    
    res.json({
      category,
      products
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create category (admin only)
router.post('/', authMiddleware, adminMiddleware, async (req: Request, res: Response) => {
  try {
    const { name, description } = req.body;
    
    if (!name) {
      return res.status(400).json({ message: 'Category name is required' });
    }
    
    // Check if category already exists
    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      return res.status(400).json({ message: 'Category with this name already exists' });
    }
    
    const category = await Category.create({ name, description });
    res.status(201).json(category);
  } catch (err) {
    console.error('Error creating category:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update category (admin only)
router.put('/:id', authMiddleware, adminMiddleware, async (req: Request, res: Response) => {
  try {
    const { name, description } = req.body;
    
    if (name) {
      // Check if another category with this name exists
      const existingCategory = await Category.findOne({ 
        name, 
        _id: { $ne: req.params.id } 
      });
      
      if (existingCategory) {
        return res.status(400).json({ message: 'Category with this name already exists' });
      }
    }
    
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      { name, description },
      { new: true, runValidators: true }
    );
    
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    
    res.json(category);
  } catch (err) {
    console.error('Error updating category:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete category (admin only)
router.delete('/:id', authMiddleware, adminMiddleware, async (req: Request, res: Response) => {
  try {
    // Check if category is used by any products
    const productsWithCategory = await Product.countDocuments({ category: req.params.id });
    
    if (productsWithCategory > 0) {
      return res.status(400).json({ 
        message: `Cannot delete: Category is used by ${productsWithCategory} products` 
      });
    }
    
    const category = await Category.findByIdAndDelete(req.params.id);
    
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    
    res.json({ message: 'Category deleted successfully' });
  } catch (err) {
    console.error('Error deleting category:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router; 