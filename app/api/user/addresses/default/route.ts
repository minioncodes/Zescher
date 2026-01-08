import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import connectDB from "@/lib/db";
import Address from "@/models/Address";

export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await req.json();
  if (!id) {
    return NextResponse.json({ error: "Address ID required" }, { status: 400 });
  }

  await connectDB();

  // Remove default from all
  await Address.updateMany(
    { userId: session.user.id },
    { isDefault: false }
  );

  // Set selected as default
  await Address.updateOne(
    { _id: id, userId: session.user.id },
    { isDefault: true }
  );

  const addresses = await Address.find({ userId: session.user.id });
  return NextResponse.json(addresses);
}
