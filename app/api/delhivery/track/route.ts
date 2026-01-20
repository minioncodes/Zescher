// app/api/admin/delhivery/track/route.ts
import axios from "axios";
import { isAdmin } from "@/lib/auth";

export async function GET(req: Request) {
  await isAdmin(req);

  const { searchParams } = new URL(req.url);
  const waybill = searchParams.get("waybill");

  const res = await axios.get(
    `${process.env.DELHIVERY_BASE_URL}/api/v1/packages/json/?waybill=${waybill}`,
    {
      headers: {
        Authorization: `Token ${process.env.DELHIVERY_API_KEY}`,
      },
    }
  );

  return Response.json(res.data);
}
