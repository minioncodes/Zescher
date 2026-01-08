import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import mongoose from "mongoose";
import dbConnect from "@/lib/mongo";
import Product from "@/models/admin/ProductSchema";
import Category from "@/models/admin/Category";
import { upladProductImageToCloudinary } from "@/utils/cloudinary/product_cloudinary";

type AdminPayload = { id: string };
const SECRET = new TextEncoder().encode(process.env.SECRET_KEY);

export async function PATCH(req: NextRequest) {
  try {
    await dbConnect();

    const token = req.cookies.get("adminToken")?.value;
    if (!token) {
      return NextResponse.json({ msg: "Unauthorized" }, { status: 401 });
    }
    await jwtVerify<AdminPayload>(token, SECRET);

    const contentType = req.headers.get("content-type") || "";

   
    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();

      const id = formData.get("id") as string;
      if (!id || !mongoose.Types.ObjectId.isValid(id)) {
        return NextResponse.json(
          { msg: "Valid product id is required" },
          { status: 400 }
        );
      }

      const product = await Product.findById(id);
      if (!product) {
        return NextResponse.json({ msg: "Product not found" }, { status: 404 });
      }

      /* Existing images user wants to keep */
      const keepImages = formData.getAll("keepImages") as string[];

      /* New uploaded images */
      const files = formData.getAll("images");
      const uploadedImages: string[] = [];

      for (const file of files) {
        if (file instanceof File && file.size > 0) {
          const uploaded = await upladProductImageToCloudinary(
            file,
            "products"
          );
          uploadedImages.push(uploaded.secure_url);
        }
      }

      product.images = [...keepImages, ...uploadedImages];
      await product.save();

      return NextResponse.json(product, { status: 200 });
    }

   
    const body = (await req.json()) as {
      id: string;
      name?: string;
      slug?: string;
      description?: string;
      price?: number;
      stock?: number;
      category?: string;
      brand?: string;
      attributes?: any[];
      variants?: any[];
      isFeatured?: boolean;
      isActive?: boolean;
    };

    const { id, ...rest } = body;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { msg: "Valid product id is required" },
        { status: 400 }
      );
    }

    const allowed = [
      "name",
      "slug",
      "description",
      "price",
      "stock",
      "category",
      "brand",
      "attributes",
      "variants",
      "isFeatured",
      "isActive",
    ] as const;

    const update: Record<string, any> = {};
    for (const key of allowed) {
      if (rest[key] !== undefined) update[key] = rest[key];
    }

    if (update.category) {
      const exists = await Category.findById(update.category);
      if (!exists) {
        return NextResponse.json(
          { msg: "Invalid category" },
          { status: 400 }
        );
      }
    }

    const updated = await Product.findByIdAndUpdate(
      id,
      { $set: update },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return NextResponse.json({ msg: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(updated, { status: 200 });
  } catch (err) {
    console.error("PATCH /api/admin/product/edit-product", err);
    return NextResponse.json(
      { msg: "Internal server error" },
      { status: 500 }
    );
  }
}
