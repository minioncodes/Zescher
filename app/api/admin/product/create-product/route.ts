import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import Product from "@/models/admin/ProductSchema";
import dbConnect from "@/lib/mongo";
import cloudinary from "@/lib/cloudinary";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const formdata=await req.formData();
    const name=formdata.get("name");
    const slug=formdata.get("slug");
    const descreption=formdata.get("descreption")
    const price=Number(formdata.get("price"));
    const category=formdata.get("category")
    const stock=formdata.get("stock")
    const token = req.cookies.get("adminToken")?.value;
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    let decoded: any;
    try {
      decoded = jwt.verify(token, process.env.SECRET_KEY as string);
    } catch (err) {
      return NextResponse.json({ message: "Invalid or expired token" }, { status: 401 });
    }    
    const body = await req.json();
    const newProduct = await Product.create({
      ...body,
      createdBy: decoded.id,
    });
    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
