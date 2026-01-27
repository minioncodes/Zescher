"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useAuthModal } from "@/context/AuthModalContext";
import { loadRazorpay } from "@/lib/razorpay";
import Image from "next/image";

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
const [product, setProduct] = useState<any | null>(null);

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] =
    useState<"COD" | "ONLINE" | null>(null);
  const [loading, setLoading] = useState(false);

  const [productId, setProductId] = useState<string | null>(null);

  /* 🧾 Fetch product details for preview */
useEffect(() => {
  if (!productId) return;

  fetch(`/api/products/${productId}`)
    .then(res => {
      if (!res.ok) throw new Error("Product not found");
      return res.json();
    })
    .then(setProduct)
    .catch(() => setProduct(null));
}, [productId]);

  /* 🔐 Force login */
useEffect(() => {
  if (status === "unauthenticated") {
    openAuthModal("/checkout");
  }
}, [status, openAuthModal]);


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

  const quantity = 1;
const totalAmount = product ? product.price * quantity : 0;

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
          amount: totalAmount,
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
  <div className="max-w-6xl mx-auto px-4 py-6">
    <h1 className="text-2xl font-semibold mb-6">Checkout</h1>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* ================= LEFT SIDE ================= */}
      <div className="md:col-span-2 space-y-6">
        {/* ADDRESS */}
        <div className="border rounded-lg p-4 bg-white">
          <h2 className="font-medium mb-3">Select Address</h2>

          {addresses.length === 0 && (
            <p className="text-sm text-gray-500">
              No address found. Please add one.
            </p>
          )}

          {addresses.map(addr => (
            <label
              key={addr._id}
              className={`flex items-start gap-3 border p-3 mb-2 rounded cursor-pointer ${
                selectedAddress === addr._id
                  ? "border-black"
                  : "border-gray-200"
              }`}
            >
              <input
                type="radio"
                name="address"
                checked={selectedAddress === addr._id}
                onChange={() => setSelectedAddress(addr._id)}
                className="mt-1"
              />
              <div className="text-sm">
                <p className="font-medium">{addr.name}</p>
                <p className="text-gray-600">
                  {addr.addressLine}, {addr.city}, {addr.state} –{" "}
                  {addr.pincode}
                </p>
                <p className="text-gray-600">📞 {addr.phone}</p>
              </div>
            </label>
          ))}
        </div>

        {/* PAYMENT */}
        <div className="border rounded-lg p-4 bg-white">
          <h2 className="font-medium mb-3">Payment Method</h2>

          <label className="flex items-center gap-2 mb-2">
            <input
              type="radio"
              name="payment"
              checked={paymentMethod === "COD"}
              onChange={() => setPaymentMethod("COD")}
            />
            Cash on Delivery
          </label>

          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="payment"
              checked={paymentMethod === "ONLINE"}
              onChange={() => setPaymentMethod("ONLINE")}
            />
            Online Payment (UPI / Card)
          </label>
        </div>

        {/* CTA */}
        <button
          disabled={!selectedAddress || !paymentMethod || loading}
          onClick={placeOrder}
          className="w-full bg-black text-white py-3 rounded disabled:opacity-50"
        >
          {loading
            ? "Processing..."
            : paymentMethod === "COD"
            ? "Place Order"
            : "Pay Now"}
        </button>
      </div>

      {/* ================= RIGHT SIDE ================= */}
      <div className="md:col-span-1">
        {product && (
          <div className="border rounded-lg p-4 bg-white sticky top-20">
            <h2 className="font-medium mb-4">Order Summary</h2>

            <div className="flex gap-4">
              <Image
                src={product.images?.[0]}
                alt={product.name}
                width={80}
                height={80}
                className="rounded object-cover"
              />

              <div className="flex-1">
                <p className="font-medium">{product.name}</p>
                <p className="text-sm text-gray-500">
                  Qty: {quantity}
                </p>
              </div>

              <div className="font-semibold">
                ₹{product.price}
              </div>
            </div>

            <div className="border-t mt-4 pt-3 flex justify-between font-semibold">
              <span>Total</span>
              <span>₹{totalAmount}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  </div>
);

}
