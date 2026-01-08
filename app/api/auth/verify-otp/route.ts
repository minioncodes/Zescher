import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import Otp from "@/models/Otp";
import User from "@/models/User";
import connectDB from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { phone, otp } = await req.json();
    if (!phone || !otp) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    await connectDB();

    const record = await Otp.findOne({ phone });
    if (!record) {
      return NextResponse.json({ error: "OTP expired" }, { status: 400 });
    }

    const valid = await bcrypt.compare(otp, record.otpHash);
    if (!valid) {
      return NextResponse.json({ error: "Invalid OTP" }, { status: 400 });
    }

    // OTP verified → delete it
    await Otp.deleteMany({ phone });

    let user = await User.findOne({ phone });

    if (!user) {
      user = await User.create({
        phone,
        phoneVerified: true,
      });
    } else {
      user.phoneVerified = true;
      await user.save();
    }

    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
