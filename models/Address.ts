import mongoose, { Schema, Document } from "mongoose";

export interface IAddress extends Document {
  userId: string;
  name: string;
  phone: string;
  pincode: string;
  locality: string;
  address: string;
  city: string;
  state: string;
  landmark?: string;
  altPhone?: string;
  type: "home" | "work";
  isDefault: boolean;
  createdAt: Date;
}

const AddressSchema = new Schema<IAddress>(
  {
    userId: { type: String, required: true, index: true },

    name: { type: String, required: true },
    phone: { type: String, required: true },
    pincode: { type: String, required: true },
    locality: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },

    landmark: { type: String, default: null },
    altPhone: { type: String, default: null },

    type: {
      type: String,
      enum: ["home", "work"],
      default: "home",
    },

    isDefault: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.models.Address ||
  mongoose.model<IAddress>("Address", AddressSchema);
