import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Address from "@/models/Address";
import jwt from "jsonwebtoken";

export async function GET(req: Request) {
  try {
    await connectDB();

    const token = req.headers.get("authorization")?.replace("Bearer ", "");
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    const userId = decoded.userId;

    const addresses = await Address.find({ userId }).sort({
      isDefault: -1,
      createdAt: -1,
    });

    return NextResponse.json(addresses);
  } catch (error) {
    console.error("GET ADDRESSES ERROR:", error);
    return NextResponse.json({ error: "Failed to fetch addresses" }, { status: 500 });
  }
}
