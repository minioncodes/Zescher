import { NextRequest, NextResponse } from "next/server";
import jwt from 'jsonwebtoken'
import connectDB from "@/lib/mongo";
import Category from "@/models/admin/Category";
import { cookies } from "next/headers";
import { JWTPayload, jwtVerify } from "jose";
export interface AdminPayload extends JWTPayload {
    id: string;
    email: string
}

export async function POST(req: NextRequest) {
    try {
        await connectDB();
        const token = await req.cookies.get("adminToken")?.value;
        if (!token) {
            return NextResponse.json({ msg: "Unauthorized" }, { status: 401 })
        }
        const { name, slug, description, isActive, createdBy } = await req.json();
        const existingCategory = await Category.findOne({ name });
        const {payload}=await jwtVerify<AdminPayload>(token,new TextEncoder().encode(process.env.SECRET_KEY));
        const adminId=payload.id;
        if (existingCategory) {
            return NextResponse.json({ msg: "the category already exist" }, { status: 400 });
        }
        const response = await Category.create({
            name,
            slug,
            description,
            isActive,
            createdBy:adminId
        })
        return NextResponse.json({ msg: "category created",response }, { status: 201 });
    } catch (e: any) {
        console.log(e.message);
        return NextResponse.json({ msg: "some error in category creation" }, { status: 500 });
    }
}