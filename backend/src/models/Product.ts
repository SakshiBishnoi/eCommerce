import mongoose, { Document, Schema } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  category: mongoose.Types.ObjectId;
  stock: number;
  images: string[];
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema: Schema = new Schema<IProduct>(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    stock: { type: Number, required: true },
    images: [{ type: String }],
  },
  { timestamps: true }
);

// Add indexes for faster queries
ProductSchema.index({ name: 1 });
ProductSchema.index({ category: 1 });
ProductSchema.index({ createdAt: -1 });
ProductSchema.index({ price: 1 }); // For sorting and filtering by price

export default mongoose.model<IProduct>('Product', ProductSchema); 