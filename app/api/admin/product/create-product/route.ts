import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import Product from "@/models/admin/ProductSchema";
import dbConnect from "@/lib/mongo";
import cloudinary from "@/lib/cloudinary";
import { AdminPayload } from "../../category/create-category/route";
import { jwtVerify } from "jose";
export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const token = await req.cookies.get("adminToken")?.value;
    if (!token) {
      return NextResponse.json({ msg: "Unauthorized" }, { status: 401 })
    }
    const { payload } = await jwtVerify<AdminPayload>(token, new TextEncoder().encode(process.env.SECRET_KEY));
    const adminId = payload.id;
    const formdata = await req.formData();
    const name = formdata.get("name");
    const slug = formdata.get("slug");
    const description = formdata.get("description")
    const price = Number(formdata.get("price"));
    const category = formdata.get("category")
    const stock = formdata.get("stock")
    const body = await req.json();
    const newProduct = await Product.create({
      ...body,
      createdBy: adminId
    });
    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
