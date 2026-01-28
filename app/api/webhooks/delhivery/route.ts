// app/api/webhooks/delhivery/route.ts
import connectDB from "@/lib/db";
import Order from "@/models/Order";

export async function POST(req: Request) {
  await connectDB();

  const payload = await req.json();


  const waybill = payload?.waybill;
  const status = payload?.status;

  if (!waybill) {
    return Response.json({ ok: true });
  }

  const order = await Order.findOne({
    "delhivery.waybill": waybill,
  });

  if (!order) {
    return Response.json({ ok: true });
  }

  // Map Delhivery → Internal status
  const statusMap: Record<string, string> = {
    "In Transit": "SHIPPED",
    "Out For Delivery": "OUT_FOR_DELIVERY",
    Delivered: "DELIVERED",
    "RTO Initiated": "RTO",
    "RTO Delivered": "RTO_COMPLETED",
  };

  order.delhivery.status = status;
  order.orderStatus = statusMap[status] || order.orderStatus;

  await order.save();

  return Response.json({ success: true });
}
