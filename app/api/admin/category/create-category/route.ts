import { NextRequest, NextResponse } from "next/server";
import jwt from 'jsonwebtoken'
import connectDB from "@/lib/mongo";
import Category from "@/models/admin/Category";
import { cookies } from "next/headers";
export async function POST(req: NextRequest) {
    try {
        const cookiestore = await cookies();
        const token = cookieStore.get("adminToken");
        if (!token) {
            return NextResponse.json({ err: "Unauthorized" }, { status: 401 });
        }
        
    } catch (e: any) {

    }
}