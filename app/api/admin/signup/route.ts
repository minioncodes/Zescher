import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import bcrypt from "bcrypt";
import Admin from "@/models/admin/Signup"
import jwt from "jsonwebtoken"
import connectDB from "@/lib/mongo";

console.log("adming post function got called")
export async function POST(req: NextRequest) {
    try {
        await connectDB();
        const cookiestore = await cookies();
        const { name, email, password } = await req.json();
        const hashPassword = await bcrypt.hash(password, 10);
        const existingAdmin = await Admin.findOne({ email: email });
        if (existingAdmin) {
            return NextResponse.json("Admin already exists", { status: 400 });
        }
        const response = await Admin.create({
            name,
            email,
            password: hashPassword,
            createdAt: new Date()
        })
        const adminToken = jwt.sign({ email: response.email, id: response._id }, process.env.SECRET_KEY as string, { expiresIn: "7d" });
        cookiestore.set("adminToken", adminToken, {
            httpOnly: true, maxAge: 60 * 60 * 24 * 7
        })
        return NextResponse.json({ response, adminToken })

    } catch (error) {
        return NextResponse.json("Internal Server Error", { status: 500 })
    }
}