"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useAuthModal } from "@/context/AuthModalContext";
import { loadRazorpay } from "@/lib/razorpay";

type Address = {
  _id: string;
  name: string;
  phone: string;
  addressLine: string;
  city: string;
  state: string;
  pincode: string;
};

export default function CheckoutPage() {
  const router = useRouter();
  const { status } = useSession();
  const { openAuthModal } = useAuthModal();

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] =
    useState<"COD" | "ONLINE" | null>(null);
  const [loading, setLoading] = useState(false);

  const [productId, setProductId] = useState<string | null>(null);

  /* 🔐 Force login */
  useEffect(() => {
    if (status === "unauthenticated") {
      openAuthModal(() => router.replace("/checkout"));
    }
  }, [status, openAuthModal, router]);

  /* 🧠 Load product safely */
  useEffect(() => {
    const stored = localStorage.getItem("buy_now_product");
    if (!stored) {
      router.replace("/");
      return;
    }

    try {
      const parsed = JSON.parse(stored);
      setProductId(parsed._id ?? parsed); // supports object or id
    } catch {
      router.replace("/");
    }
  }, [router]);

  /* 📦 Fetch addresses */
  useEffect(() => {
    if (status === "authenticated") {
      fetch("/api/user/addresses")
        .then(res => res.json())
        .then(data => setAddresses(data || []));
    }
  }, [status]);

  /* 🧾 Place Order */
  const placeOrder = async () => {
    if (!selectedAddress || !paymentMethod || !productId) return;

    setLoading(true);

    try {
      const res = await fetch("/api/orders/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product: productId, // ✅ ONLY ID
          addressId: selectedAddress,
          paymentMethod,
        }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Order creation failed");
      }

      const order = await res.json();

      /* 💵 COD */
      if (paymentMethod === "COD") {
        localStorage.removeItem("buy_now_product");
        router.push("/orders");
        return;
      }

      /* 💳 Online Payment */
      const loaded = await loadRazorpay();
      if (!loaded) {
        alert("Failed to load Razorpay. Please try again.");
        return;
      }

      const paymentRes = await fetch("/api/payment/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: order._id,
          amount: order.amount,
        }),
      });

      const paymentData = await paymentRes.json();

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY,
        amount: paymentData.amount,
        currency: "INR",
        order_id: paymentData.id,

        handler: async (response: any) => {
          await fetch("/api/payment/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              ...response,
              orderId: order._id,
            }),
          });

          localStorage.removeItem("buy_now_product");
          router.push("/orders");
        },

        modal: {
          ondismiss: async () => {
            await fetch("/api/payment/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                orderId: order._id,
                failed: true,
              }),
            });

            router.push("/orders");
          },
        },
      };

      const razorpay = new (window as any).Razorpay(options);
      razorpay.open();
    } catch (err) {
      console.error(err);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-semibold">Checkout</h1>

      {/* ADDRESS */}
      <div>
        <h2 className="font-medium mb-2">Select Address</h2>
        {addresses.map(addr => (
          <label
            key={addr._id}
            className={`block border p-3 mb-2 cursor-pointer ${
              selectedAddress === addr._id ? "border-black" : ""
            }`}
          >
            <input
              type="radio"
              name="address"
              className="mr-2"
              onChange={() => setSelectedAddress(addr._id)}
            />
            {addr.addressLine}, {addr.city} - {addr.pincode}
          </label>
        ))}
      </div>

      {/* PAYMENT */}
      <div>
        <h2 className="font-medium mb-2">Payment Method</h2>
        <label className="block">
          <input
            type="radio"
            name="payment"
            className="mr-2"
            onChange={() => setPaymentMethod("COD")}
          />
          Cash on Delivery
        </label>
        <label className="block">
          <input
            type="radio"
            name="payment"
            className="mr-2"
            onChange={() => setPaymentMethod("ONLINE")}
          />
          Online Payment
        </label>
      </div>

      {/* CTA */}
      <button
        disabled={!selectedAddress || !paymentMethod || loading}
        onClick={placeOrder}
        className="w-full bg-black text-white py-3 disabled:opacity-50"
      >
        {paymentMethod === "COD" ? "Place Order" : "Pay Now"}
      </button>
    </div>
  );
}
