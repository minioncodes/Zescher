import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Admin from "@/models/admin/Signup";
import connectDB from "@/lib/mongo";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    console.log("MongoDB connected successfully");

    const { email, password } = await req.json();

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 }
      );
    }
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 }
      );
    }
    const adminToken = jwt.sign(
      { email: admin.email, id: admin._id },
      process.env.SECRET_KEY as string,
      { expiresIn: "7d" }
    );

    const res = NextResponse.json({
      message: "Login successful",
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
      },
      token: adminToken,
    });

    res.cookies.set("adminToken", adminToken, {
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 7, 
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    return res;
  } catch (error) {
    console.error("Error in signin:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
