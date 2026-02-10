import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/db";
import User from "@/models/User";
import Order from "@/models/Order";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json([], { status: 200 });
    }

    await connectDB();

    const dbUser = await User.findOne({ email: session.user.email }).select("_id");
    if (!dbUser) {
      return NextResponse.json([], { status: 200 });
    }

    const orders = await Order.find({ userId: dbUser._id })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(orders);
  } catch (err) {
    console.error("USER ORDERS ERROR:", err);
    return NextResponse.json([], { status: 500 });
  }
}
