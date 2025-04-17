import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: 'user' | 'admin';
  blocked: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    blocked: { type: Boolean, default: false },
  },
  { timestamps: true }
);

UserSchema.index({ createdAt: 1 });
UserSchema.index({ role: 1 });

export default mongoose.model<IUser>('User', UserSchema); 