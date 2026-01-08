// app/api/admin/products/route.ts
import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import dbConnect from "@/lib/mongo";
import Product from "@/models/admin/ProductSchema";

type AdminPayload = { id: string };

export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    const token = req.cookies.get("adminToken")?.value;
    if (!token) return NextResponse.json({ msg: "Unauthorized" }, { status: 401 });

    await jwtVerify<AdminPayload>(token, new TextEncoder().encode(process.env.SECRET_KEY));

    const products = await Product.find({}).sort({ createdAt: -1 }).lean();
    return NextResponse.json(products, { status: 200 });
  } catch (err) {
    console.error("GET /api/admin/products", err);
    return NextResponse.json({ msg: "internal server error" }, { status: 500 });
  }
}
