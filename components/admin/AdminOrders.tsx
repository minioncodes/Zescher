// app/admin/orders/page.tsx   
"use client";

import { useEffect, useState } from "react";

export default function AdminOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchOrders = async () => {
    setLoading(true);
    const res = await fetch("/api/admin/orders");
    const data = await res.json();
    setOrders(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

const createShipment = async (orderId: string) => {
  console.log("Creating shipment for:", orderId);

  const res = await fetch("/api/delhivery/create-shipment", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ orderId }),
  });

  console.log("Response status:", res.status);

  const text = await res.text();
  console.log("Raw response from server:", text);

  if (!res.ok) {
    alert("API route not found or error. Check console.");
    return;
  }

  const data = JSON.parse(text);
  alert(data.message);
};




  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Pending Orders</h1>

      {loading && <p>Loading...</p>}

      <div className="space-y-4">
        {orders.map((order) => (
          <div
            key={order._id}
            className="border rounded-lg p-4 flex justify-between items-center"
          >
            <div>
              <p className="font-medium">Order ID: {order._id}</p>
              <p>{order.address.name}</p>
              <p>{order.address.city}</p>
              <p>Status: {order.orderStatus}</p>
            </div>

            <button
              onClick={() => createShipment(order._id)}
              className="bg-black text-white px-4 py-2 rounded"
            >
              Create Shipment
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
