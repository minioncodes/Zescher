import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import Product from "@/models/admin/ProductSchema";
import dbConnect from "@/lib/mongo";
import { AdminPayload } from "../../category/create-category/route";
import { jwtVerify } from "jose"
export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const token = req.cookies.get("adminToken")?.value;
    if (!token) {
      return NextResponse.json({ msg: "Unauthorized" }, { status: 401 });
    }

    const { payload } = await jwtVerify<AdminPayload>(
      token,
      new TextEncoder().encode(process.env.SECRET_KEY)
    );
    const adminId = payload.id;
    const body = await req.json();
    const newProduct = await Product.create({
      ...body,
      createdBy: adminId,
    });
    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    console.error("err", error);
    return NextResponse.json({ message: "internal server error" }, { status: 500 });
  }
}
