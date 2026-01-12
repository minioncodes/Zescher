import connectDB from "@/lib/db";
import Category from "@/models/admin/Category";

export async function getActiveCategories() {
  await connectDB();

  const categories = await Category.find({
    isActive: true,
  }).lean();


  return JSON.parse(JSON.stringify(categories));
}
