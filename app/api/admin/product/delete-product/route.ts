import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import mongoose from "mongoose";
import dbConnect from "@/lib/mongo";
import Product from "@/models/admin/ProductSchema";

type AdminPayload = { id: string };
const SECRET = new TextEncoder().encode(process.env.SECRET_KEY);

export async function DELETE(req: NextRequest) {
  try {
    await dbConnect();

   
    const token = req.cookies.get("adminToken")?.value;
    if (!token) {
      return NextResponse.json({ msg: "Unauthorized" }, { status: 401 });
    }

    await jwtVerify<AdminPayload>(token, SECRET);

    
    const body = (await req.json()) as { id: string };

    const { id } = body;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { msg: "Valid product id is required" },
        { status: 400 }
      );
    }

    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return NextResponse.json(
        { msg: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { msg: "Product deleted successfully", id },
      { status: 200 }
    );
  } catch (err) {
    console.error("DELETE /api/admin/product/delete-product", err);
    return NextResponse.json(
      { msg: "Internal server error" },
      { status: 500 }
    );
  }
}
