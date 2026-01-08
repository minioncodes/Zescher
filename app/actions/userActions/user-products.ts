"use server";

import ProductSchema, { IProduct } from "@/models/admin/ProductSchema";
import connectDB from "@/lib/db";

export async function getProducts(): Promise<IProduct[]> {
  try {
    await connectDB();
    const res = await ProductSchema.find({});
    return JSON.parse(JSON.stringify(res)) as IProduct[];
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}
