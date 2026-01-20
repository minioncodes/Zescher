import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import connectDB from "@/lib/db";
import Address from "@/models/Address";
import mongoose from "mongoose";
import { authOptions } from "@/lib/auth";



export async function GET() {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();

  const addresses = await Address.find({ userId }).sort({
    isDefault: -1,
    createdAt: -1,
  });

  return NextResponse.json(addresses);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  await connectDB();

  const count = await Address.countDocuments({ userId });

  if (count === 0 || body.isDefault) {
    await Address.updateMany({ userId }, { isDefault: false });
  }

  await Address.create({
    ...body,
    userId,
    isDefault: count === 0,
  });

  const addresses = await Address.find({ userId }).sort({
    isDefault: -1,
    createdAt: -1,
  });

  return NextResponse.json(addresses);
}

/* =======================
   PATCH – Update address
======================= */
export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id, ...updates } = await req.json();

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid address ID" }, { status: 400 });
    }

    await connectDB();

    // If setting default → unset others
    if (updates.isDefault === true) {
      await Address.updateMany({ userId }, { isDefault: false });
    }

    await Address.findOneAndUpdate(
      { _id: id, userId },
      updates,
      { new: true }
    );

    const addresses = await Address.find({ userId })
      .sort({ isDefault: -1, createdAt: -1 })
      .lean();

    return NextResponse.json(addresses);
  } catch (error) {
    console.error("UPDATE ADDRESS ERROR:", error);
    return NextResponse.json(
      { error: "Failed to update address" },
      { status: 500 }
    );
  }
}

/* =======================
   DELETE – Remove address
======================= */
export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Valid address ID required" },
        { status: 400 }
      );
    }

    await connectDB();

    const deleted = await Address.findOneAndDelete({ _id: id, userId });

    // If deleted address was default → promote latest address
    if (deleted?.isDefault) {
      const next = await Address.findOne({ userId }).sort({ createdAt: -1 });
      if (next) {
        next.isDefault = true;
        await next.save();
      }
    }

    const addresses = await Address.find({ userId })
      .sort({ isDefault: -1, createdAt: -1 })
      .lean();

    return NextResponse.json(addresses);
  } catch (error) {
    console.error("DELETE ADDRESS ERROR:", error);
    return NextResponse.json(
      { error: "Failed to delete address" },
      { status: 500 }
    );
  }
}
