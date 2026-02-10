"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { FiPackage } from "react-icons/fi";

type OrderItem = {
  productId: string;
  name: string;
  image?: string;
  qty: number;
  price: number;
};

type Order = {
  _id: string;
  createdAt: string;
  updatedAt: string;
  orderStatus: "PENDING" | "CONFIRMED" | "SHIPPED" | "DELIVERED" | "CANCELLED";
  paymentMode: "COD" | "PREPAID";
  totalAmount: number;
  items: OrderItem[];
  delhivery?: {
    deliveredAt?: string;
  };
};

export default function OrdersPage() {
  const { status } = useSession();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status !== "authenticated") {
      setLoading(false);
      return;
    }

    fetch("/api/user/orders")
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => setOrders(data || []))
      .finally(() => setLoading(false));
  }, [status]);

  if (loading) {
    return <div className="text-center py-20">Loading orders…</div>;
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-20">
        <FiPackage size={48} className="mx-auto mb-4 text-black/40" />
        <p className="text-lg font-medium">No orders yet</p>
        <Link href="/" className="inline-block mt-6 px-6 py-3 bg-black text-white rounded-lg">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-semibold mb-8">My Orders</h1>

      <div className="space-y-4">
        {orders.map((order) => (
          <OrderCard key={order._id} order={order} />
        ))}
      </div>
    </div>
  );
}

function OrderCard({ order }: { order: Order }) {
  const firstItem = order.items?.[0];
  const delivered = order.orderStatus === "DELIVERED";

  return (
    <Link
      href={`/orders/${order._id}`}
      className="block border rounded-lg bg-white hover:shadow transition"
    >
      <div className="flex items-center gap-4 p-4">
        {/* IMAGE */}
        <Image
          src={firstItem?.image || "/placeholder-product.png"}
          alt={firstItem?.name || "Product"}
          width={72}
          height={72}
          className="rounded object-cover"
        />

        {/* INFO */}
        <div className="flex-1">
          <p className="font-medium line-clamp-1">
            {firstItem?.name || "Order"}
          </p>

          <p className="text-sm text-gray-600 mt-1">
            ₹{order.totalAmount}
          </p>

          {order.items && order.items.length > 1 && (
            <p className="text-xs text-gray-500 mt-1">
              +{order.items.length - 1} more item(s)
            </p>
          )}
        </div>

        {/* STATUS */}
        <div className="text-right">
          <p className="text-sm font-medium">
            {order.orderStatus}
          </p>

          {delivered && (
            <p className="text-xs text-gray-500 mt-1">
              Delivered on{" "}
              {new Date(
                order.delhivery?.deliveredAt || order.updatedAt
              ).toLocaleDateString()}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}

