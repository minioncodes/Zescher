
import { NextResponse } from "next/server";
import connectDB from "@/lib/mongo";
import Category from "@/models/admin/Category";

export async function GET() {
  await connectDB();
  const categories = await Category.find({ isActive: true })
    .select("_id name");
  return NextResponse.json(categories);
}
