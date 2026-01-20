import Razorpay from "razorpay";
import { NextResponse } from "next/server";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(req: Request) {
  const { orderId, amount } = await req.json();

  const razorpayOrder = await razorpay.orders.create({
    amount: amount * 100,
    currency: "INR",
    receipt: orderId,
  });

  return NextResponse.json({
    key: process.env.RAZORPAY_KEY_ID,
    orderId: razorpayOrder.id,
    amount: razorpayOrder.amount,
    currency: razorpayOrder.currency,
  });
}
