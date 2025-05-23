import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRouter from './routes/auth';
import productRouter from './routes/product';
import categoryRouter from './routes/category';
import orderRouter from './routes/order';
import cartRouter from './routes/cart';
import userRouter from './routes/users';

// Load environment variables
dotenv.config();

const app = express();
const PORT = parseInt(process.env.PORT || '5000', 10);
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
    
    // Try to start the server with intelligent port handling
    const server = app.listen(PORT, () => {
      console.log(`✅ Express server running on port ${PORT}`);
      console.log('Registering routes:');
      console.log('  /api/health [GET]');
      console.log('  /api/auth [POST /register, POST /login]');
      console.log('  /api/products [GET, GET /:id, POST, PUT /:id, DELETE /:id]');
      console.log('  /api/categories [GET, GET /:id, POST, PUT /:id, DELETE /:id]');
      console.log('  /api/orders [GET, POST]');
      console.log('  /api/orders/all [GET] (admin)');
      console.log('  /api/cart [GET, POST, DELETE]');
      console.log('  /api/users [GET (admin), GET /:id (admin), PUT /:id (admin)]');
      console.log('  /api/users/me [GET]');
      console.log('Ready for requests!');
    }).on('error', (err: NodeJS.ErrnoException) => {
      if (err.code === 'EADDRINUSE') {
        console.log(`⚠️ Port ${PORT} is busy, trying ${PORT + 1}...`);
        // Try the next port
        const newServer = app.listen(PORT + 1, () => {
          console.log(`✅ Express server running on port ${PORT + 1}`);
          console.log('Registering routes:');
          console.log('  /api/health [GET]');
          console.log('  /api/auth [POST /register, POST /login]');
          console.log('  /api/products [GET, GET /:id, POST, PUT /:id, DELETE /:id]');
          console.log('  /api/categories [GET, GET /:id, POST, PUT /:id, DELETE /:id]');
          console.log('  /api/orders [GET, POST]');
          console.log('  /api/orders/all [GET] (admin)');
          console.log('  /api/cart [GET, POST, DELETE]');
          console.log('  /api/users [GET (admin), GET /:id (admin), PUT /:id (admin)]');
          console.log('  /api/users/me [GET]');
          console.log('Ready for requests!');
        });
        
        // Set up graceful shutdown for the new server
        process.on('SIGTERM', () => {
          newServer.close(() => {
            console.log('Process terminated');
          });
        });
      } else {
        console.error('❌ Server error:', err);
      }
    });
    
    // Set up graceful shutdown
    process.on('SIGTERM', () => {
      server.close(() => {
        console.log('Process terminated');
      });
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
app.use('/api/users', userRouter);

// Global error handler
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('❌ Unhandled error:', err);
  res.status(500).json({ message: 'Internal server error', error: err?.message || err });
}); 