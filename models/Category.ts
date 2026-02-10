import mongoose, { Schema, models } from "mongoose";

const CategorySchema = new Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Category =
  models.Category || mongoose.model("Category", CategorySchema);

export default Category;
