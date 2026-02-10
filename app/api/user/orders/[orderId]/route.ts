import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import mongoose from "mongoose";
import connectDB from "@/lib/db";
import Order from "@/models/Order";
import { authOptions } from "@/lib/auth";

/* ---------- TYPES ---------- */

type OrderItem = {
  name: string;
  price: number;
  qty: number;
};

type Address = {
  name: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
};

type Delhivery = {
  waybill?: string;
  trackingUrl?: string;
  status?: string;
};

type OrderDoc = {
  _id: mongoose.Types.ObjectId;
  userId: string;
  items?: OrderItem[];
  address?: Address;
  delhivery?: Delhivery;
  paymentMode: "COD" | "PREPAID";
  orderStatus: string;
  createdAt: Date;
  updatedAt: Date;
};

/* ---------- ROUTE ---------- */

export async function GET(
  req: Request,
  context: { params: Promise<{ orderId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { orderId } = await context.params;

    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return NextResponse.json(
        { error: "Invalid order id" },
        { status: 400 }
      );
    }

    await connectDB();

    const order = await Order.findOne<OrderDoc>({
      _id: orderId,
      userId: session.user.id,
    }).lean<OrderDoc | null>();

    if (!order) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      ...order,
      items: Array.isArray(order.items) ? order.items : [],
      address: order.address ?? {
        name: "",
        phone: "",
        address: "",
        city: "",
        state: "",
        pincode: "",
      },
      delhivery: order.delhivery ?? null,
    });
  } catch (err) {
    console.error("ORDER DETAILS ERROR:", err);
    return NextResponse.json(
      { error: "Failed to fetch order" },
      { status: 500 }
    );
  }
}
