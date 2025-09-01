import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import Admin from "@/models/admin/Signup";
import jwt from "jsonwebtoken";
import connectDB from "@/lib/mongo";
export async function POST(req: NextRequest) {
  try {
    await connectDB();
    console.log("MongoDB connected successfully");
    const { name, email, password } = await req.json();

    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return NextResponse.json(
        { message: "Admin already exists" },
        { status: 400 }
      );
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const response = await Admin.create({
      name,
      email,
      password: hashPassword,
      createdAt: new Date(),
    });

    const adminToken = jwt.sign(
      { email: response.email, id: response._id },
      process.env.SECRET_KEY as string,
      { expiresIn: "7d" }
    );

    const res = NextResponse.json({ response, adminToken });

    res.cookies.set("adminToken", adminToken, {
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 7,
    });

    return res;
  } catch (error) {
    console.error("Error in signup:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
