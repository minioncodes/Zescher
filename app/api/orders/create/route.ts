import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/db";

import Order from "@/models/Order";
import Products from "@/models/Products";
import User from "@/models/User";

export async function POST(req: Request) {
  try {
    await connectDB();

    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const dbUser = await User.findOne({ email: session.user.email }).select("_id");
    if (!dbUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    console.log("DB USER ID:", dbUser._id, typeof dbUser._id);

    const { product, addressId, paymentMethod } = await req.json();

    const dbProduct = await Products.findById(product);
    if (!dbProduct) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

const order = await Order.create({
  userId: dbUser._id, 
  product: dbProduct._id,
  address: addressId,
  amount: dbProduct.price,
  paymentMethod,
  orderStatus: "CREATED",
  paymentStatus: paymentMethod === "COD" ? "COD" : "PENDING",
});


    return NextResponse.json(order, { status: 201 });
  } catch (err: any) {
    console.error("ORDER CREATE ERROR:", err);
    return NextResponse.json(
      { error: "Order creation failed", message: err.message },
      { status: 500 }
    );
  }
}
