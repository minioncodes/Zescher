import Product from "@/models/admin/ProductSchema";
import connectDB from "./db";

export async function getAllProducts() {
  await connectDB();

  const products = await Product.find({
    $or: [{ isActive: true }, { isActive: { $exists: false } }],
  })
    .populate("category", "name slug") 
    .lean();

  return JSON.parse(JSON.stringify(products));
}

export async function getProductBySlug(slug: string) {
  await connectDB();

  const product = await Product.findOne({
    slug,
    $or: [{ isActive: true }, { isActive: { $exists: false } }],
  })
    .populate("category", "name slug")
    .lean();

  return product ? JSON.parse(JSON.stringify(product)) : null;
}