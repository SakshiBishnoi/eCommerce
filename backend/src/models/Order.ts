import mongoose, { Document, Schema } from 'mongoose';
import { IUser } from './User';
import { IProduct } from './Product';

export interface IOrderProduct {
  product: mongoose.Types.ObjectId | IProduct;
  quantity: number;
}

export interface IOrder extends Document {
  user: mongoose.Types.ObjectId | IUser;
  products: IOrderProduct[];
  total: number;
  status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}

const OrderProductSchema: Schema = new Schema<IOrderProduct>({
  product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true, min: 1 },
});

const OrderSchema: Schema = new Schema<IOrder>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    products: [OrderProductSchema],
    total: { type: Number, required: true },
    status: {
      type: String,
      enum: ['pending', 'paid', 'shipped', 'delivered', 'cancelled'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

// Add indexes for dashboard queries
OrderSchema.index({ createdAt: -1 }); // For date-based queries and sorting
OrderSchema.index({ user: 1 }); // For user-based lookups
OrderSchema.index({ "products.product": 1 }); // For product-based aggregations

export default mongoose.model<IOrder>('Order', OrderSchema); 