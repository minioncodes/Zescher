import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import mongoose from "mongoose";
import dbConnect from "@/lib/mongo";
import Product from "@/models/admin/ProductSchema";

type AdminPayload = { id: string };

const SECRET = new TextEncoder().encode(process.env.SECRET_KEY);

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();

    const token = req.cookies.get("adminToken")?.value;
    if (!token) {
      return NextResponse.json({ msg: "Unauthorized" }, { status: 401 });
    }

    await jwtVerify<AdminPayload>(token, SECRET);

    const { id } = params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { msg: "Invalid product id" },
        { status: 400 }
      );
    }

    const product = await Product.findById(id);

    if (!product) {
      return NextResponse.json(
        { msg: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(product, { status: 200 });
  } catch (err) {
    console.error("GET /api/admin/products/[id]", err);
    return NextResponse.json(
      { msg: "Internal server error" },
      { status: 500 }
    );
  }
}
