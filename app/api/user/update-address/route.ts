import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import connectDB from "@/lib/db";
import User from "@/models/User";

export async function POST(req: Request) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ success: false, error: "Not logged in" }, { status: 401 });
    }

    const { address, phone } = await req.json();
    if (!address || !phone) {
      return NextResponse.json({ success: false, error: "Address and phone required" }, { status: 400 });
    }

    await connectDB();
    await User.findOneAndUpdate(
      { email: session.user.email },
      { address, phone },
      { new: true }
    );

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
