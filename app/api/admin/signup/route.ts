import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import Admin from "@/models/admin/Signup";
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


    const newAdmin = await Admin.create({
      name,
      email,
      password: hashPassword,
      createdAt: new Date(),
    });

  
    return NextResponse.json(
      {
        message: "Admin registered successfully",
        admin: {
          id: newAdmin._id,
          name: newAdmin.name,
          email: newAdmin.email,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error in signup:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
