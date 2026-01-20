// app/api/admin/delhivery/create-shipment/route.ts
import Order from "@/models/Order";
import { connectDB } from "@/lib/db";
import axios from "axios";
import { isAdmin } from "@/lib/auth";

export async function POST(req: Request) {
  await connectDB();
  await isAdmin(req);

  const { orderId } = await req.json();
  const order = await Order.findById(orderId);

  if (!order) {
    return Response.json({ error: "Order not found" }, { status: 404 });
  }

  const payload = {
    shipments: [
      {
        name: order.address.name,
        add: order.address.address,
        city: order.address.city,
        state: order.address.state,
        pin: order.address.pincode,
        phone: order.address.phone,
        order: order._id.toString(),
        payment_mode: order.paymentMode === "COD" ? "COD" : "Prepaid",
        total_amount: order.items.reduce(
          (sum, i) => sum + i.price * i.qty,
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

  const res = await axios.post(
    `${process.env.DELHIVERY_BASE_URL}/api/cmu/create.json`,
    payload,
    {
      headers: {
        Authorization: `Token ${process.env.DELHIVERY_API_KEY}`,
        "Content-Type": "application/json",
      },
    }
  );

  const waybill =
    res.data?.packages?.[0]?.waybill;

  order.orderStatus = "SHIPPED";
  order.delhivery = {
    waybill,
    trackingUrl: `https://www.delhivery.com/track/package/${waybill}`,
    status: "SHIPPED",
  };

  await order.save();

  return Response.json({
    message: "Shipment created",
    waybill,
  });
}
