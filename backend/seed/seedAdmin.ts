import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from '../src/models/User';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/ecommerce';

async function createAdmin() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    const existing = await User.findOne({ email: 'admin@gmail.com' });
    if (existing) {
      console.log('Admin user already exists.');
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash('admin@123', 10);
    const admin = new User({
      name: 'admin',
      email: 'admin@gmail.com',
      password: hashedPassword,
      role: 'admin',
    });
    await admin.save();
    console.log('Admin user created successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Error creating admin user:', err);
    process.exit(1);
  }
}

createAdmin(); 