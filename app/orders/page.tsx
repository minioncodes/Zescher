"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  FiPackage,
  FiTruck,
  FiCheckCircle,
  FiClock,
} from "react-icons/fi";

type OrderItem = {
  productId: string;
  name: string;
  quantity: number;
  price: number;
};

type Order = {
  _id: string;
  orderNumber: string;
  createdAt: string;
  status:
    | "placed"
    | "confirmed"
    | "shipped"
    | "out_for_delivery"
    | "delivered"
    | "cancelled";
  totalAmount: number;
  items: OrderItem[];
};

const STATUS_LABEL: Record<Order["status"], string> = {
  placed: "Order Placed",
  confirmed: "Confirmed",
  shipped: "Shipped",
  out_for_delivery: "Out for delivery",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/user/orders")
      .then((res) => res.json())
      .then((data) => setOrders(data || []))
      .finally(() => setLoading(false));
  }, []);

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

      {/* RECENT ORDERS */}
      <section className="mb-10">
        <h2 className="text-lg font-medium mb-4">Recent Orders</h2>
        <div className="space-y-4">
          {recentOrders.map((order) => (
            <OrderCard key={order._id} order={order} />
          ))}
        </div>
      </section>

      {/* ORDER HISTORY */}
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

/* ----------------------------
   ORDER CARD
----------------------------- */
function OrderCard({ order }: { order: Order }) {
  return (
    <div className="border border-black/10 rounded-xl p-5 bg-white">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <p className="text-sm text-black/60">
            Order #{order.orderNumber}
          </p>
          <p className="text-sm text-black/60">
            Placed on {new Date(order.createdAt).toLocaleDateString()}
          </p>
        </div>

        <div className="text-sm font-medium">
          ₹{order.totalAmount.toFixed(2)}
        </div>
      </div>

      {/* STATUS */}
      <div className="mt-4 flex items-center gap-2 text-sm">
        <StatusIcon status={order.status} />
        <span>{STATUS_LABEL[order.status]}</span>
      </div>

      {/* ITEMS */}
      <div className="mt-4 text-sm text-black/70">
        {order.items.map((item) => (
          <div key={item.productId} className="flex justify-between">
            <span>
              {item.name} × {item.quantity}
            </span>
            <span>₹{item.price * item.quantity}</span>
          </div>
        ))}
      </div>

      {/* ACTIONS */}
      <div className="mt-5 flex gap-4">
        <Link
          href={`/orders/${order._id}`}
          className="text-sm font-medium text-blue-600"
        >
          Track Order
        </Link>
      </div>
    </div>
  );
}

/* ----------------------------
   STATUS ICON
----------------------------- */
function StatusIcon({ status }: { status: Order["status"] }) {
  if (status === "delivered") {
    return <FiCheckCircle className="text-green-600" />;
  }
  if (status === "shipped" || status === "out_for_delivery") {
    return <FiTruck className="text-blue-600" />;
  }
  return <FiClock className="text-black/50" />;
}
