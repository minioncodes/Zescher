import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Category from "@/models/admin/Category";
import { jwtVerify } from "jose";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const token = req.cookies.get("adminToken")?.value;
    if (!token) {
      return NextResponse.json(
        { msg: "Unauthorized" },
        { status: 401 }
      );
    }

    const { payload }: any = await jwtVerify(
      token,
      new TextEncoder().encode(process.env.SECRET_KEY)
    );

    const adminId = payload.id;

    const { name, slug, description, isActive, image } =
      await req.json();

    if (!name || !slug || isActive === undefined) {
      return NextResponse.json(
        { msg: "Missing required fields" },
        { status: 400 }
      );
    }

    const existingCategory = await Category.findOne({ slug });
    if (existingCategory) {
      return NextResponse.json(
        { msg: "Category already exists" },
        { status: 400 }
      );
    }

    const category = await Category.create({
      name,
      slug,
      description,
      image,
      isActive,
      createdBy: adminId,
    });

    return NextResponse.json(
      { msg: "Category created", category },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("CATEGORY ERROR:", error);
    return NextResponse.json(
      { msg: "Internal server error" },
      { status: 500 }
    );
  }
}
