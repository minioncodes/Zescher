import "server-only";
import connectDB from "@/lib/db";
import Category from "@/models/admin/Category";
import Product from "@/models/admin/ProductSchema";
import { ICategory } from "@/models/admin/Category";

export async function getActiveCategories() {
  await connectDB();

  const categories = await Category.find({
    isActive: true,
  }).lean();

  return JSON.parse(JSON.stringify(categories));
}

export async function getProductsByCategorySlug(slug: string) {
  await connectDB();

  const category = (await Category.findOne({
    slug,
    isActive: true,
  }).lean()) as ICategory | null;

  if (!category) return null;

  const products = await Product.find({
    category: category._id, 
    $or: [{ isActive: true }, { isActive: { $exists: false } }],
  })
    .populate("category", "name slug") // ✅ optional but recommended
    .lean();

  return {
    category: JSON.parse(JSON.stringify(category)),
    products: JSON.parse(JSON.stringify(products)),
  };
}
