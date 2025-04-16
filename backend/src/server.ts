import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRouter from './routes/auth';
import productRouter from './routes/product';
import categoryRouter from './routes/category';
import orderRouter from './routes/order';
import cartRouter from './routes/cart';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/ecommerce';

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

console.log('Connecting to MongoDB...');
// Connect to MongoDB and start server
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected successfully!');
    app.listen(PORT, () => {
      console.log(`✅ Express server running on port ${PORT}`);
      console.log('Registering routes:');
      console.log('  /api/health [GET]');
      console.log('  /api/auth [POST /register, POST /login]');
      console.log('  /api/products [GET, GET /:id, POST]');
      console.log('  /api/categories [GET, POST]');
      console.log('  /api/orders [GET, POST]');
      console.log('  /api/cart [GET, POST]');
      console.log('Ready for requests!');
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });

app.use('/api/auth', authRouter);
app.use('/api/products', productRouter);
app.use('/api/categories', categoryRouter);
app.use('/api/orders', orderRouter);
app.use('/api/cart', cartRouter);

// Global error handler
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('❌ Unhandled error:', err);
  res.status(500).json({ message: 'Internal server error', error: err?.message || err });
}); 