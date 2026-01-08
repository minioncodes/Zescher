import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import connectDB from "@/lib/db";
import Address from "@/models/Address";

/* =======================
   GET
======================= */
export async function GET() {
  try {
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
  } catch (error) {
    console.error("GET ADDRESSES ERROR:", error);
    return NextResponse.json(
      { error: "Failed to fetch addresses" },
      { status: 500 }
    );
  }
}

/* =======================
   POST
======================= */
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    await connectDB();

    const count = await Address.countDocuments({ userId });

    // First address OR explicitly default
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
  } catch (error) {
    console.error("ADD ADDRESS ERROR:", error);
    return NextResponse.json(
      { error: "Failed to add address" },
      { status: 500 }
    );
  }
}

/* =======================
   PATCH
======================= */
export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id, ...updates } = await req.json();

    await connectDB();

    await Address.findOneAndUpdate(
      { _id: id, userId },
      updates
    );

    const addresses = await Address.find({ userId });

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
   DELETE
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

    if (!id) {
      return NextResponse.json(
        { error: "Address ID required" },
        { status: 400 }
      );
    }

    await connectDB();

    await Address.deleteOne({ _id: id, userId });

    const addresses = await Address.find({ userId });

    return NextResponse.json(addresses);
  } catch (error) {
    console.error("DELETE ADDRESS ERROR:", error);
    return NextResponse.json(
      { error: "Failed to delete address" },
      { status: 500 }
    );
  }
}
