import mongoose, { Schema, Document, Types, models, Model } from 'mongoose';

export interface IUser extends Document {
  _id: Types.ObjectId;
  fullName: string;
  email: string;
  username: string;
  mobile?: string;
  dateOfBirth?: Date;
  address?: {
    street: string;
    city: string;
    state: string;
    country?: string;
  };
  otp?: string;
  otpExpires?: Date;
  isVerified: boolean;
  role: 'user' | 'startup' | 'admin';
  provider: 'google' | 'credentials';
  isAcceptingMessages?: boolean;
  // messages?: [string];
  qualification?: string;
  experiance?: string;
  listOfSubjects?: string[];
  profileImage?: string;
  password?: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema<IUser> = new Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  password: { type: String },
  mobile: { type: String },
  dateOfBirth: { type: Date },
  address: {
    street: String,
    city: String,
    state: String,
    country: String,
  },
  qualification: { type: String },
  experiance: { type: String },
  listOfSubjects: { type: [String] },
  role: {
    type: String,
    enum: ['user', 'startup', 'admin'],
    default: 'user',
  },
  provider: { type: String, enum: ['google', 'credentials'], default: 'credentials' },
  otp: { type: String },
  otpExpires: { type: Date },
  isVerified: { type: Boolean, default: false },
  isAcceptingMessages: { type: Boolean, default: true },
  // messages: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Message' }],
}, { timestamps: true });

const User: Model<IUser> = models.User || mongoose.model<IUser>('User', UserSchema);
export default User;
