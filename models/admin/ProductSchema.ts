import mongoose, { Schema, Document, Model } from "mongoose";

export interface IProduct extends Document {
  name: string;
  slug: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  brand?: string;
  images: string[];
  attributes?: { key: string; value: string }[];
  variants?: {
    sku: string;
    color?: string;
    size?: string;
    price?: number;
    stock?: number;
  }[];
  ratings: {
    userId: string;
    rating: number;
    comment?: string;
    createdAt: Date;
  }[];
  averageRating: number;
  isFeatured: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}

const ProductSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    stock: { type: Number, required: true, default: 0 },
    category: { type: String, ref: "Category", required: true },
    brand: { type: String },
    images: [{ type: String, required: true }],
    attributes: [
      {
        key: { type: String },
        value: { type: String },
      },
    ],
    variants: [
      {
        sku: { type: String},
        color: { type: String },
        size: { type: String },
        price: { type: Number },
        stock: { type: Number },
      },
    ],
    ratings: [
      {
        userId: { type: String, required: true },
        rating: { type: Number, min: 1, max: 5 },
        comment: { type: String },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    averageRating: { type: Number, default: 0 },
    isFeatured: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    createdBy: { type: String, ref: "Admin", required: true }
  },
  { timestamps: true }
);

const Product: Model<IProduct> =
  mongoose.models?.Product || mongoose.model<IProduct>("Product", ProductSchema);

export default Product;