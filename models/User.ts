import mongoose from "mongoose";
import { Schema, Document } from "mongoose";
import { v4 as uuidv4 } from "uuid";

export interface IUser extends Document {
  _id: string;

  // Auth
  phoneNumber: string;
  phoneVerified: boolean;

  // Profile
  name?: string | null;
  email?: string | null; // optional (future use)
  createdAt: Date;

  // Optional info
  location?: string | null;
  dateOfBirth?: string | null;
  gender?: string | null;

  address?: {
    street?: string | null;
    area?: string | null;
    city?: string | null;
    state?: string | null;
    pincode?: string | null;
  } | null;
}
const UserSchema = new Schema<IUser>(
  {
    _id: { type: String, default: uuidv4 },

    // PHONE AUTH (PRIMARY)
    phoneNumber: {
      type: String,
      required: false,
      unique: true,
      index: true,
    },
    phoneVerified: {
      type: Boolean,
      default: false,
    },

    // PROFILE
    name: { type: String, default: null },
    email: { type: String, default: null }, // optional

    createdAt: { type: Date, default: Date.now },

    // OPTIONAL DETAILS
    location: { type: String, default: null },
    dateOfBirth: { type: String, default: null },
    gender: { type: String, default: null },

    address: {
      street: { type: String, default: null },
      area: { type: String, default: null },
      city: { type: String, default: null },
      state: { type: String, default: null },
      pincode: { type: String, default: null },
    },
  },
  { timestamps: true }
);

export default mongoose.models.User ||
  mongoose.model<IUser>("User", UserSchema);
