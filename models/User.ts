import mongoose, { mongo } from "mongoose";
import { Schema, Document } from "mongoose";
import { v4 as uuidv4 } from "uuid";

export interface IUser extends Document {
    _id: string,
    name: string;
    email: string;
    password: string;
    createdAt: Date;
  location?: string | null;
  phoneNumber?: string | null;
  dateOfBirth?: string | null;
  gender?: string | null;
  address?: {
    street?: string | null;
    area?: string | null;
    city?: string | null;
    state?: string | null;
    pincode?: string | null;
  }| null;
}
const UserSchema = new Schema<IUser>({
    _id: { type: String, default: uuidv4 },
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
      createdAt: { type: Date, default: Date.now },
    location: { type: String, default: null },
    phoneNumber: { type: String, default: null },
    dateOfBirth: { type: String, default: null },
    gender: { type: String, default: null },

    address: {
      street: { type: String, default: null },
      area: { type: String, default: null },
      city: { type: String, default: null },
      state: { type: String, default: null },
      pincode: { type: String, default: null },
    }
})
export default mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
