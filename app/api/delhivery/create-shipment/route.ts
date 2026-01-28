// app/api/admin/delhivery/create-shipment/route.ts
import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Order from "@/models/Order";
import axios from "axios";

export async function POST(req: Request) {
  console.log("🔵 [DELHIVERY] Route hit");

  try {
    await connectDB();
    console.log("🟢 DB connected");

    const body = await req.json();
    console.log("🟢 Request body:", body);

    const { orderId } = body;

    const order = await Order.findById(orderId);
    console.log("🟢 Order fetched:", !!order);

    if (!order) {
      console.log("🔴 Order not found");
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      );
    }

    const payload = {
      shipments: [
        {
          name: order.address.name,
          add: order.address.address,
          city: order.address.city,
          state: order.address.state,
          pin: String(order.address.pincode),
          phone: String(order.address.phone),
          order: order._id.toString(),
          payment_mode: order.paymentMode === "COD" ? "COD" : "Prepaid",
          total_amount: order.items.reduce(
            (sum: number, i: any) => sum + i.price * i.qty,
            0
          ),
          quantity: order.items.length,
          weight: 0.5,
        },
      ],
      pickup_location: {
        name: process.env.DELHIVERY_PICKUP_NAME,
      },
    };

    console.log(
      "🟡 Payload sent to Delhivery:",
      JSON.stringify(payload, null, 2)
    );

    const delhiveryRes = await axios.post(
      `${process.env.DELHIVERY_BASE_URL}/api/cmu/create.json`,
      payload,
      {
        headers: {
          Authorization: `Token ${process.env.DELHIVERY_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log(
      "🟢 Delhivery raw response:",
      JSON.stringify(delhiveryRes.data, null, 2)
    );

    const waybill = delhiveryRes.data?.packages?.[0]?.waybill;

    console.log("🟢 Waybill extracted:", waybill);

    order.orderStatus = "SHIPPED";
    order.delhivery = {
      waybill,
      trackingUrl: `https://www.delhivery.com/track/package/${waybill}`,
      status: "SHIPPED",
    };

    await order.save();
    console.log("🟢 Order updated & saved");

    console.log("✅ Sending final response");
    return NextResponse.json(
      { message: "Shipment created", waybill },
      { status: 200 }
    );
  } catch (error: any) {
    console.error(
      "🔴 Create shipment failed:",
      error?.response?.data || error
    );

    return NextResponse.json(
      {
        error: "Shipment creation failed",
        details: error?.response?.data,
      },
      { status: 500 }
    );
  }
}
