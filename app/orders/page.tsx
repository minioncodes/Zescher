"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import {
  FiPackage,
  FiTruck,
  FiCheckCircle,
  FiClock,
} from "react-icons/fi";
import Image from "next/image";

/* =====================
   TYPES
===================== */

type OrderItem = {
  productId: string;
  name: string;
  qty: number;
  price: number;
};

type Order = {
  _id: string;
  createdAt: string;
  orderStatus:
    | "PENDING"
    | "CONFIRMED"
    | "SHIPPED"
    | "DELIVERED"
    | "CANCELLED";
  paymentMode: "COD" | "PREPAID";
  items: OrderItem[];
  delhivery?: {
    waybill?: string;
    trackingUrl?: string;
    status?: string;
  };
};

const STATUS_LABEL: Record<Order["orderStatus"], string> = {
  PENDING: "Payment Pending",
  CONFIRMED: "Order Confirmed",
  SHIPPED: "Shipped",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
};

export default function OrdersPage() {
  const { status } = useSession();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // ✅ DO NOT fetch until user explicitly visits orders
    if (status !== "authenticated") {
      setLoading(false);
      return;
    }

    fetch("/api/user/orders")
      .then((res) => res.ok ? res.json() : [])
      .then((data) => setOrders(data || []))
      .finally(() => setLoading(false));
  }, [status]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] text-black/60">
        Loading orders…
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-16 text-center">
        <FiPackage size={48} className="mx-auto text-black/40 mb-4" />
        <h2 className="text-xl font-semibold">No orders yet</h2>
        <p className="text-black/60 mt-2">
          Looks like you haven’t placed any orders.
        </p>
        <Link
          href="/"
          className="inline-block mt-6 px-6 py-3 bg-black text-white rounded-xl"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  const recentOrders = orders.slice(0, 2);
  const pastOrders = orders.slice(2);

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-semibold mb-8">My Orders</h1>

      <section className="mb-10">
        <h2 className="text-lg font-medium mb-4">Recent Orders</h2>
        <div className="space-y-4">
          {recentOrders.map((order) => (
            <OrderCard key={order._id} order={order} />
          ))}
        </div>
      </section>

      {pastOrders.length > 0 && (
        <section>
          <h2 className="text-lg font-medium mb-4">Order History</h2>
          <div className="space-y-4">
            {pastOrders.map((order) => (
              <OrderCard key={order._id} order={order} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

/* =====================
   ORDER CARD
===================== */

function OrderCard({ order }: { order: any }) {
  const product = order.product;
  const delivered =
    order.orderStatus === "DELIVERED";

  return (
    <Link
      href={`/orders/${order._id}`}
      className="block border rounded-lg bg-white hover:shadow transition"
    >
      <div className="flex items-center gap-4 p-4">
        {/* PRODUCT IMAGE */}
        <Image
          src={product?.images?.[0] || "/placeholder.png"}
          alt={product?.name}
          width={72}
          height={72}
          className="rounded object-cover"
        />

        {/* PRODUCT INFO */}
        <div className="flex-1">
          <p className="font-medium line-clamp-1">
            {product?.name}
          </p>

          <p className="text-sm text-gray-600 mt-1">
            ₹{order.amount}
          </p>
        </div>

        {/* STATUS */}
        <div className="text-right">
          <p className="flex items-center gap-2 text-sm font-medium">
            <span
              className={`h-2 w-2 rounded-full ${
                delivered ? "bg-green-600" : "bg-yellow-500"
              }`}
            />
            {delivered
              ? "Delivered"
              : order.orderStatus}
          </p>

          {delivered && (
            <p className="text-xs text-gray-500 mt-1">
              Delivered on{" "}
              {new Date(
                order.delhivery?.deliveredAt ||
                  order.updatedAt
              ).toLocaleDateString()}
            </p>
          )}

          {/* RATE & REVIEW */}
          {delivered && (
            <button
              onClick={(e) => {
                e.preventDefault();
                // later: open rating modal
              }}
              className="mt-2 text-sm text-blue-600 font-medium hover:underline"
            >
              ★ Rate & Review Product
            </button>
          )}
        </div>
      </div>
    </Link>
  );
}


function StatusIcon({ status }: { status: Order["orderStatus"] }) {
  if (status === "DELIVERED") return <FiCheckCircle className="text-green-600" />;
  if (status === "SHIPPED") return <FiTruck className="text-blue-600" />;
  if (status === "CANCELLED") return <FiPackage className="text-red-600" />;
  return <FiClock className="text-black/50" />;
}
