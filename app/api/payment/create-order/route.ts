import Razorpay from "razorpay";
import connectDB from "@/lib/db";
import Order from "@/models/Order";
import { NextResponse } from "next/server";

const razorpay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(req: Request) {
  await connectDB();

  const { orderId, amount } = await req.json();

  const razorpayOrder = await razorpay.orders.create({
    amount: amount * 100,
    currency: "INR",
  });

  // 🔥 VERY IMPORTANT
  await Order.findByIdAndUpdate(orderId, {
    razorpayOrderId: razorpayOrder.id,
  });

  return NextResponse.json(razorpayOrder);
}
