// app/api/admin/products/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import dbConnect from "@/lib/mongo";
import Product from "@/models/admin/ProductSchema";
import mongoose from "mongoose";

type AdminPayload = { id: string };

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();

    const token = req.cookies.get("adminToken")?.value;
    if (!token) return NextResponse.json({ msg: "Unauthorized" }, { status: 401 });
    await jwtVerify<AdminPayload>(token, new TextEncoder().encode(process.env.SECRET_KEY));

    const { id } = params;
    if (!mongoose.Types.ObjectId.isValid(id))
      return NextResponse.json({ msg: "Invalid product id" }, { status: 400 });

    const product = await Product.findById(id);
    if (!product) return NextResponse.json({ msg: "Not found" }, { status: 404 });

    return NextResponse.json(product, { status: 200 });
  } catch (err) {
    console.error("GET /api/admin/products/:id", err);
    return NextResponse.json({ msg: "internal server error" }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();

    const token = req.cookies.get("adminToken")?.value;
    if (!token) return NextResponse.json({ msg: "Unauthorized" }, { status: 401 });

    await jwtVerify<AdminPayload>(token, new TextEncoder().encode(process.env.SECRET_KEY));

    const { id } = params;
    if (!mongoose.Types.ObjectId.isValid(id))
      return NextResponse.json({ msg: "Invalid product id" }, { status: 400 });

    const body = await req.json().catch(() => ({}));


    const keys = [
      "name",
      "slug",
      "description",
      "price",
      "stock",
      "category",
      "brand",
      "images",
      "attributes",
      "variants",
      "isFeatured",
      "isActive",
    ] as const;

    const update: Record<string, unknown> = {};
    for (const k of keys) {
      if (k in body && body[k] !== undefined) update[k] = body[k];
    }

    const updated = await Product.findByIdAndUpdate(
      id,
      { $set: update },
      { new: true, runValidators: true }
    );

    if (!updated) return NextResponse.json({ msg: "Not found" }, { status: 404 });

    return NextResponse.json(updated, { status: 200 });
  } catch (err: any) {
    console.error("PATCH /api/admin/products/:id", err);
    if (err?.code === 11000) {
      return NextResponse.json({ msg: "Slug must be unique" }, { status: 400 });
    }
    return NextResponse.json({ msg: "internal server error" }, { status: 500 });
  }
}
