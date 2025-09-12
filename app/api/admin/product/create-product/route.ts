import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import Product from "@/models/admin/ProductSchema";
import dbConnect from "@/lib/mongo";
import { AdminPayload } from "../../category/create-category/route";
import { upladProductImageToCloudinary } from "@/utils/cloudinary/product_cloudinary";
import mongoose from "mongoose";
console.log("create product route is calledddddddddddddddddd")
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
    const mongooseSession=await mongoose.startSession();
    mongooseSession.startTransaction();
    const adminId = payload.id;
    const formData = await req.formData();
    const name = formData.get("name") as string;
    const slug = formData.get("slug") as string;
    const description = formData.get("description") as string;
    const price = Number(formData.get("price"));
    const stock = Number(formData.get("stock"));
    const category = formData.get("category") as string;
    const brand = formData.get("brand") as string;
    const imageFiles = formData.getAll("images");
    const images: string[] = [];
    for (const file of imageFiles) {
      if (file instanceof File) {
        const uploaded = await upladProductImageToCloudinary(file, "products");
        images.push(uploaded.secure_url);
      }
    }
    const attributes = formData.get("attributes")
      ? JSON.parse(formData.get("attributes") as string)
      : [];
    const variants = formData.get("variants")
      ? JSON.parse(formData.get("variants") as string)
      : [];
    const newProduct = await Product.create({
      name,
      slug,
      description,
      price,
      stock,
      category,
      brand,
      images,
      attributes,
      variants,
      ratings: [],
      averageRating: 0,
      isFeatured: false,
      isActive: true,
      createdBy: adminId,
    });
    await mongooseSession.commitTransaction();
    mongooseSession.endSession();
    return NextResponse.json(newProduct, { status: 201 });
  } catch (err:any) {
    console.error("err creating product:", err);
    return NextResponse.json({ message: "internal server error" }, { status: 500 });
  }
}
