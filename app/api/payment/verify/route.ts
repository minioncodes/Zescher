import { NextResponse } from "next/server";
import crypto from "crypto";
import connectDB from "@/lib/db";
import Order from "@/models/Order";

export async function POST(req: Request) {
  try {
    await connectDB();

    const body = await req.json();
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderId,
      failed,
    } = body;

    // 🔴 User closed modal / payment failed
    if (failed) {
      await Order.findByIdAndUpdate(orderId, {
        paymentStatus: "FAILED",
      });

      return NextResponse.json({ status: "FAILED" });
    }

    // 🔴 If success payload is incomplete → mark FAILED (not 400)
    if (
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature
    ) {
      await Order.findByIdAndUpdate(orderId, {
        paymentStatus: "FAILED",
      });

      return NextResponse.json({ status: "FAILED" });
    }

    // 🔐 Verify signature
    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      await Order.findByIdAndUpdate(orderId, {
        paymentStatus: "FAILED",
      });

      return NextResponse.json({ status: "FAILED" });
    }

    // ✅ Payment verified
    await Order.findByIdAndUpdate(orderId, {
      paymentStatus: "PAID",
    });

    return NextResponse.json({ status: "PAID" });
  } catch (err: any) {
    console.error("PAYMENT VERIFY ERROR:", err);
    return NextResponse.json(
      { error: "Payment verification failed" },
      { status: 500 }
    );
  }
}
