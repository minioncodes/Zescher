// app/api/admin/orders/route.ts
import Order from "@/models/Order";
import connectDB from "@/lib/db";
// import { isAdmin } from "@/lib/auth";

export async function GET(req: Request) {
  await connectDB();
  // await isAdmin(req);

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");

  const orders = await Order.find(
    status ? { orderStatus: status } : {}
  ).sort({ createdAt: -1 });

  return Response.json(orders);
}
  