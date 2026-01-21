import { NextResponse } from "next/server";
import crypto from "crypto";
import connectDB from "@/lib/db";
import Order from "@/models/Order";

export async function POST(req: Request) {
  await connectDB();

  const body = await req.json();

  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    orderId,     // DB order id
    failed,
  } = body;

  const order = await Order.findById(orderId);
  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  /* 🔴 USER CLOSED MODAL */
  if (failed) {
    await Order.findByIdAndUpdate(orderId, {
      paymentStatus: "FAILED",
    });
    return NextResponse.json({ status: "FAILED" });
  }

  /* ✅ SUCCESS PATH ONLY */
  const generatedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");

  if (generatedSignature !== razorpay_signature) {
    return NextResponse.json(
      { error: "Signature mismatch" },
      { status: 400 }
    );
  }

  /* ✅ FINAL SUCCESS */
  await Order.findByIdAndUpdate(orderId, {
    paymentStatus: "PAID",
    razorpayOrderId: razorpay_order_id,
    razorpayPaymentId: razorpay_payment_id,
  });

  return NextResponse.json({ status: "PAID" });
}
