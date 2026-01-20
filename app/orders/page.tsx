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
  const totalAmount = order.amount;

  return (
    <div className="border p-4 rounded space-y-2">
      <div className="flex justify-between">
        <span className="font-medium">
          Order #{order.orderId ?? order._id.slice(-6)}
        </span>
        <span className="text-sm text-gray-500">
          {new Date(order.createdAt).toLocaleDateString()}
        </span>
      </div>

      {/* Product */}
      {order.product && (
        <div className="flex gap-3 items-center">
<Image
  src={order.product.images?.[0] || "/placeholder.png"}
  alt={order.product.name}
  width={64}
  height={64}
  className="object-cover rounded"
  unoptimized
/>

          <div>
            <p className="font-medium">{order.product.name}</p>
            <p className="text-sm text-gray-600">₹{order.amount}</p>
          </div>
        </div>
      )}

      {/* Status */}
      <div className="flex justify-between items-center">
        <span className="text-sm">
          Payment:{" "}
          <strong
            className={
              order.paymentStatus === "PAID"
                ? "text-green-600"
                : order.paymentStatus === "FAILED"
                ? "text-red-600"
                : "text-yellow-600"
            }
          >
            {order.paymentStatus}
          </strong>
        </span>

        <span className="font-semibold">₹{totalAmount}</span>
      </div>

      {/* Retry */}
      {order.paymentStatus === "FAILED" && (
        <button className="text-sm text-blue-600 underline">
          Retry Payment
        </button>
      )}
    </div>
  );
}


function StatusIcon({ status }: { status: Order["orderStatus"] }) {
  if (status === "DELIVERED") return <FiCheckCircle className="text-green-600" />;
  if (status === "SHIPPED") return <FiTruck className="text-blue-600" />;
  if (status === "CANCELLED") return <FiPackage className="text-red-600" />;
  return <FiClock className="text-black/50" />;
}
