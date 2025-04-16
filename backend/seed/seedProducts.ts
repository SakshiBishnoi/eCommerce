import mongoose from 'mongoose';
import path from 'path';
import Product from '../src/models/Product';
import Category from '../src/models/Category';
import products from './products.json';
import categories from './categories.json';
import dotenv from 'dotenv';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

async function seed() {
  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    throw new Error('MONGO_URI not set in .env');
  }
  await mongoose.connect(mongoUri);
  await Product.deleteMany({});
  await Category.deleteMany({});

  // Insert categories and map names to ObjectIds
  const catDocs = await Category.insertMany((categories as any[]).map((c: any) => ({ name: c.name })));
  const catMap: Record<string, any> = {};
  (catDocs as any[]).forEach((doc: any) => { catMap[doc.name] = doc._id; });

  // Insert products with correct category ObjectId
  await Product.insertMany((products as any[]).map((p: any) => ({
    name: p.name,
    description: p.description,
    price: p.price,
    category: catMap[p.categoryName],
    stock: p.stock || 0,
    images: p.image ? [p.image] : [],
    createdAt: p.createdAt ? new Date(p.createdAt) : new Date(),
    updatedAt: new Date(),
  })));

  console.log('Seeded!');
  process.exit();
}

seed(); 