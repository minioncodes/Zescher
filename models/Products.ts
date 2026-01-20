import mongoose, { Schema, models } from "mongoose";

const ProductSchema = new Schema(
  {
    name: String,
    slug: String,
    price: Number,
    images: [String],
    stock: Number,
  },
  { timestamps: true }
);

export default models.Product || mongoose.model("Product", ProductSchema);
