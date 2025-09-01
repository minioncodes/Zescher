import User from "@/models/User";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt'
import { NextResponse, NextRequest } from "next/server";
import { cookies } from "next/headers";
import connectDB from "@/lib/mongo";

export async function POST(req: NextRequest, res: NextResponse) {
    try {
        await connectDB();
        const body = await req.json();
        const { name, email, password, location, phoneNumber, dateOfBirth, address, gender } = body;
        const cookieStore = await cookies();
        const hashedPassword = await bcrypt.hashSync(password, 10);
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json({ msg: "user alrady exist" }, { status: 400 });
        }
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            createdAt: new Date(),
            location,
            phoneNumber,
            dateOfBirth,
            address,
            gender
        });
        await newUser.save();
        if (!process.env.SECRET_KEY) throw new Error("SECRET_KEY is not defined");
        const token = jwt.sign({ id: newUser._id, email: newUser.email }, process.env.SECRET_KEY, { expiresIn: "1h" });
        cookieStore.set("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV !== "development",
            sameSite: "lax",
            maxAge: 60 * 60,
            path: "/",
        });
        console.log("response = ", newUser);
        return NextResponse.json({ newUser, token }, { status: 201 })
    } catch (e: any) {
        console.log("message = ", e.message);
        return NextResponse.json({ msg: e.message }, { status: 500 })
    }
}
