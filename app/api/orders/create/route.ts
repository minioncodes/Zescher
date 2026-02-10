import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/db";

import Order from "@/models/Order";
import Product from "@/models/Products";
import User from "@/models/User";
import Address from "@/models/Address";

export async function POST(req: Request) {
  try {
    await connectDB();

    /* ---------- AUTH ---------- */
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const dbUser = await User.findOne({ email: session.user.email }).select("_id");
    if (!dbUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    /* ---------- BODY ---------- */
    const { product, addressId, paymentMethod } = await req.json();

    if (!product || !addressId || !paymentMethod) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    /* ---------- PRODUCT ---------- */
    const dbProduct = await Product.findById(product);
    if (!dbProduct) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    /* ---------- ADDRESS ---------- */
    const dbAddress = await Address.findById(addressId);
    if (!dbAddress) {
      return NextResponse.json({ error: "Address not found" }, { status: 404 });
    }

    /* ---------- CREATE ORDER ---------- */
const order = await Order.create({
  userId: dbUser._id,

items: [
  {
    productId: dbProduct._id,
    name: dbProduct.name,
    image: dbProduct.images?.[0], // SINGLE IMAGE
    price: dbProduct.price,
    qty: 1,
  },
],

totalAmount: dbProduct.price,
paymentMode: paymentMethod,


  address: {
    name: dbAddress.name || "N/A",
    phone: dbAddress.phone || "0000000000",
    address:
      dbAddress.address ||
      dbAddress.addressLine ||
      dbAddress.line1 ||
      "UNKNOWN ADDRESS",
    city: dbAddress.city || "N/A",
    state: dbAddress.state || "N/A",
    pincode: dbAddress.pincode || "000000",
  },

  totalAmount: dbProduct.price,

  paymentMode: paymentMethod === "COD" ? "COD" : "PREPAID",
  orderStatus: "CREATED",
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
