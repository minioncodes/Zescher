"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import {
  FiCheckCircle,
  FiTruck,
  FiMapPin,
  FiClock,
} from "react-icons/fi";

export default function OrderDetailsPage() {
  const { orderId } = useParams();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/user/orders/${orderId}`)
      .then(res => res.json())
      .then(setOrder)
      .finally(() => setLoading(false));
  }, [orderId]);

  if (loading) {
    return <div className="p-10 text-center">Loading order…</div>;
  }

  if (!order) {
    return <div className="p-10 text-center">Order not found</div>;
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">

      {/* LEFT — PRODUCT + TRACKING */}
      <div className="md:col-span-2 space-y-6">

        {/* PRODUCT CARD */}
        {order.items.map((item: any, idx: number) => (
          <div
            key={idx}
            className="flex gap-4 p-4 border rounded-lg bg-white"
          >
            <Image
              src="/placeholder-product.png"
              alt={item.name}
              width={80}
              height={80}
              className="rounded object-cover"
            />

            <div className="flex-1">
              <h2 className="font-medium">{item.name}</h2>
              <p className="text-sm text-gray-600">
                Qty: {item.qty}
              </p>
              <p className="font-semibold mt-1">
                ₹{item.price * item.qty}
              </p>
            </div>

            <div className="text-sm text-green-600 font-medium">
              {order.orderStatus}
            </div>
          </div>
        ))}

        {/* 📦 TRACKING SECTION (DELHIVERY READY) */}
        <div className="border rounded-lg p-6 bg-white">
          <h3 className="font-semibold mb-4">Tracking</h3>

          <div className="space-y-4 text-sm">
            <TrackingStep
              done
              label="Order Confirmed"
            />
            <TrackingStep
              done={order.orderStatus !== "PENDING"}
              label="Shipped"
            />
            <TrackingStep
              done={order.orderStatus === "DELIVERED"}
              label="Delivered"
            />
          </div>

          {order.delhivery?.trackingUrl && (
            <a
              href={order.delhivery.trackingUrl}
              target="_blank"
              className="inline-block mt-4 text-blue-600 text-sm"
            >
              Track on Delhivery →
            </a>
          )}
        </div>
      </div>

      {/* RIGHT — ADDRESS + SUMMARY */}
      <div className="space-y-6">

        {/* ADDRESS */}
        <div className="border rounded-lg p-6 bg-white">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <FiMapPin /> Delivery Address
          </h3>

          <p className="font-medium">{order.address.name}</p>
          <p className="text-sm text-gray-600">
            {order.address.address},
            {order.address.city},
            {order.address.state} – {order.address.pincode}
          </p>
          <p className="text-sm mt-1">
            Phone: {order.address.phone}
          </p>
        </div>

        {/* PRICE SUMMARY */}
        <div className="border rounded-lg p-6 bg-white">
          <h3 className="font-semibold mb-3">Price Details</h3>

          <div className="flex justify-between text-sm">
            <span>Total Amount</span>
            <span className="font-semibold">₹{order.items.reduce(
              (sum: number, i: any) => sum + i.price * i.qty,
              0
            )}</span>
          </div>

          <p className="text-xs text-gray-500 mt-2">
            Payment Mode: {order.paymentMode}
          </p>
        </div>
      </div>
    </div>
  );
}

/* ---------------- TRACK STEP ---------------- */

function TrackingStep({
  label,
  done,
}: {
  label: string;
  done: boolean;
}) {
  return (
    <div className="flex items-center gap-3">
      {done ? (
        <FiCheckCircle className="text-green-600" />
      ) : (
        <FiClock className="text-gray-400" />
      )}
      <span className={done ? "text-black" : "text-gray-400"}>
        {label}
      </span>
    </div>
  );
}
