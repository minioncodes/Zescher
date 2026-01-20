import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/db";

import Order from "@/models/Order";
import Product from "@/models/Products"; // ✅ IMPORTANT
import User from "@/models/User";

export async function GET() {
  try {
    await connectDB();

    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const dbUser = await User.findOne({ email: session.user.email }).select("_id");
    if (!dbUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const orders = await Order.find({ userId: dbUser._id })
      .sort({ createdAt: -1 })
      .populate("product"); // ✅ now works

    return NextResponse.json(orders);
  } catch (err) {
    console.error("USER ORDERS ERROR:", err);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}
