import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import OrderSchema from "@/models/OrderSchema";
import axios from "axios";
import User from "@/models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

async function getShiprocketToken() {
  const { data } = await axios.post("https://apiv2.shiprocket.in/v1/external/auth/login", {
    email: process.env.SHIPROCKET_EMAIL,
    password: process.env.SHIPROCKET_PASSWORD,
  });
  return data.token;
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);
    console.log("session id from the api =", session?.user.email);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const body = await req.json();
    console.log("session id from the api =", session.user.email);
    const userProfileData = await User.findOne({ email: session.user.email });

    if (!userProfileData) {
      return NextResponse.json({ msg: "user not found" }, { status: 404 });
    }
    console.log("user profile data = ", userProfileData);
    const order = new OrderSchema(body);
    await order.save();
    const shipRocketToken = await getShiprocketToken();
    const pickupdata = await axios.get('https://apiv2.shiprocket.in/v1/external/settings/company/pickup',
      {
        headers: { Authorization: `Bearer ${shipRocketToken}` }
      })
    const pickupAddresses = pickupdata.data.data.shipping_address;
    const validPickupLocation = pickupAddresses[0].pickup_location;
    const payload = {
      order_id: order.orderId,
      order_date: order.orderDate.toISOString().slice(0, 19).replace("T", " "),
      pickup_location: validPickupLocation,
      billing_customer_name: `${userProfileData?.name} ${userProfileData?.name || ""}`.trim(),
      billing_last_name: userProfileData?.name,
      billing_address: userProfileData?.address,
      billing_address_2: userProfileData?.address || "",
      billing_city: userProfileData?.address,
      billing_pincode: order.billing.pincode,
      billing_state: order.billing.state,
      billing_country: order.billing.country,
      billing_email: userProfileData?.email,
      billing_phone: userProfileData?.phoneNumber,

      shipping_is_billing: order.shipping.useBilling,

      ...(order.shipping.useBilling
        ? {}
        : {
          shipping_customer_name: `${order.shipping.firstName} ${order.shipping.lastName || ""}`.trim(),
          shipping_address: order.shipping.address1,
          shipping_address_2: order.shipping.address2 || "",
          shipping_city: order.shipping.city,
          shipping_pincode: order.shipping.pincode,
          shipping_state: order.shipping.state,
          shipping_country: order.shipping.country,
          shipping_email: order.shipping.email,
          shipping_phone: order.shipping.phone,
        }),
      order_items: order.items.map((i: any) => ({
        name: i.name,
        sku: i.sku,
        units: i.units,
        selling_price: i.selling_price,
        discount: i.discount || 0,
        tax: i.tax || 0,
        hsn: i.hsn || ""
      })),

      payment_method: order.paymentMethod,
      shipping_charges: order.shippingCharges || 0,
      giftwrap_charges: order.giftwrapCharges || 0,
      transaction_charges: order.transactionCharges || 0,
      total_discount: order.totalDiscount || 0,

      sub_total: order.subTotal,
      length: order.package.length,
      breadth: order.package.breadth,
      height: order.package.height,
      weight: order.package.weight
    };
    const { data: shipRes } = await axios.post(
      "https://apiv2.shiprocket.in/v1/external/orders/create/adhoc",
      payload,
      { headers: { Authorization: `Bearer ${shipRocketToken}` } }
    );
    order.shiprocketResponse = shipRes;
    await order.save();
    return NextResponse.json({ success: true, order });
  } catch (err: any) {
    console.error("Order creation error:", err.response?.data || err.message);
    return NextResponse.json(
      { success: false, error: err.response?.data || err.message },
      { status: 500 }
    );
  }
}
export async function GET() {
  try {
    await connectDB();
    const orders = await OrderSchema.find();
    return NextResponse.json({ success: true, orders });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

/*
add city pincode state country in the user model
*/