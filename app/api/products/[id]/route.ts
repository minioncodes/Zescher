import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import mongoose from "mongoose";
import Products from "@/models/Products";

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  await connectDB();

  if (!mongoose.Types.ObjectId.isValid(params.id)) {
    return NextResponse.json(
      { error: "Invalid product id" },
      { status: 400 }
    );
  }

  const product = await Products.findById(params.id).lean();

  if (!product) {
    return NextResponse.json(
      { error: "Product not found" },
      { status: 404 }
    );
  }

  return NextResponse.json(product);
}
