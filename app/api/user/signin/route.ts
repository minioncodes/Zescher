import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt"
import jwt from 'jsonwebtoken'
import { cookies } from "next/headers"
import User from "@/models/User";
export async function POST(req: NextRequest, res: NextResponse) {
    try {
        const cookiestore = await cookies();
        const body = await req.json();
        // const {email,password}=await req.json();
        const isuser = await User.findOne({email:body.email});
        if (!isuser) {
            return NextResponse.json({ msg: "user is not found with this email" }, { status: 401 });
        }
        const isvaliduser = await bcrypt.compare(body.password, isuser.password);
        if (!isvaliduser) {
            return NextResponse.json({ msg: "unauthorized user" }, { status: 401 });
        }
        const {password, ...userwithoutpassword}=isuser;
        if (!process.env.SECRET_KEY) throw new Error("SECRET_KEY is not defined");
        const token = jwt.sign(
            { id: isuser.id, email: isuser.email, role: "user" },
            process.env.SECRET_KEY,
            { expiresIn: "1h" }
        );
        cookiestore.set("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV !== "development",
            sameSite: "lax", 
            maxAge: 60 * 60, 
            path: "/",
        });
        return NextResponse.json({ userwithoutpassword, token }, { status: 201 });
    } catch (e: any) {
        return NextResponse.json({ msg: e.message || "error in the user signin func" }, { status: 500 });
    }
}