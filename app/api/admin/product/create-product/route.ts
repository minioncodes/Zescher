import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import Product from "@/models/admin/ProductSchema";
import Category from "@/models/admin/Category";
import dbConnect from "@/lib/mongo";
import { upladProductImageToCloudinary } from "@/utils/cloudinary/product_cloudinary";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const token = req.cookies.get("adminToken")?.value;
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(process.env.SECRET_KEY)
    );

    const adminId = payload.id;
    const formData = await req.formData();

    const name = formData.get("name") as string;
    const slug = formData.get("slug") as string;
    const description = formData.get("description") as string;
    const price = Number(formData.get("price"));
    const stock = Number(formData.get("stock"));
    const category = formData.get("category") as string;
    const brand = formData.get("brand") as string;

    if (!name || !slug || !price || !category) {
      return NextResponse.json({ message: "Missing fields" }, { status: 400 });
    }

    /** 1️⃣ Validate category exists */
    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      return NextResponse.json(
        { message: "Invalid category selected" },
        { status: 400 }
      );
    }

    /** 2️⃣ Check slug uniqueness */
    const slugExists = await Product.findOne({ slug });
    if (slugExists) {
      return NextResponse.json(
        { message: "Product slug already exists" },
        { status: 400 }
      );
    }

    /** 3️⃣ Upload images */
    const imageFiles = formData.getAll("images");
    if (imageFiles.length === 0) {
      return NextResponse.json(
        { message: "At least one image is required" },
        { status: 400 }
      );
    }

    const images: string[] = [];
    for (const file of imageFiles) {
      if (file instanceof File) {
        const uploaded = await upladProductImageToCloudinary(file, "products");
        images.push(uploaded.secure_url);
      }
    }

    /** 4️⃣ Safe JSON parsing */
    let attributes = [];
    let variants = [];

    try {
      if (formData.get("attributes")) {
        attributes = JSON.parse(formData.get("attributes") as string);
      }
      if (formData.get("variants")) {
        variants = JSON.parse(formData.get("variants") as string);
      }
    } catch {
      return NextResponse.json(
        { message: "Invalid attributes or variants JSON" },
        { status: 400 }
      );
    }

    const product = await Product.create({
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

    return NextResponse.json(product, { status: 201 });
  } catch (err) {
    console.error("Create product error:", err);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
