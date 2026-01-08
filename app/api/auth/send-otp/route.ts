import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import Otp from "@/models/Otp";
import connectDB from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { phone } = await req.json();
    if (!phone) {
      return NextResponse.json({ error: "Phone required" }, { status: 400 });
    }

    const cleanPhone = phone.replace(/\D/g, "").slice(-10);

    await connectDB();
    await Otp.deleteMany({ phone: cleanPhone });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpHash = await bcrypt.hash(otp, 10);

    await Otp.create({
      phone: cleanPhone,
      otpHash,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    });

    const res = await fetch("https://www.fast2sms.com/dev/bulkV2", {
      method: "POST",
      headers: {
        authorization: process.env.FAST2SMS_API_KEY!,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        route: "q",
        message: `Your OTP is ${otp}. Do not share this OTP with anyone.`,
        numbers: cleanPhone,
      }),
    });

    const data = await res.json();
    console.log("FAST2SMS RESPONSE:", data);

    if (!data.return) {
      return NextResponse.json(
        { error: data.message || "SMS failed" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("OTP ERROR:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
