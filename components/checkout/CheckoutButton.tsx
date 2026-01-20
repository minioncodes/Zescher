"use client";

import Script from "next/script";
import { useState } from "react";

export default function CheckoutButton({ amount }: { amount: number }) {
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/payment/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount }),
      });

      const data = await res.json();
      if (!data.success) {
        alert("Order creation failed: " + data.error);
        setLoading(false);
        return;
      }

      const options = {
        key: data.key,
        amount: data.amount,
        currency: data.currency,
        name: "Zescher Store",
        description: "Order Payment",
        order_id: data.orderId,
        handler: async function (response: any) {
          const verifyRes = await fetch("/api/payment/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(response),
          });

          const verifyData = await verifyRes.json();
          if (verifyData.success) {
            alert("Payment successful ✅");
          } else {
            alert("Payment verification failed ❌");
          }
        },
        prefill: {
          name: "Test User",
          email: "test@example.com",
          contact: "9999999999",
        },
        theme: { color: "#3399cc" },
      };

      // @ts-ignore
      const rzp = new window.Razorpay(options);
      if (!(window as any).Razorpay) {
  alert("Payment system not loaded. Please refresh.");
  return;
}

      rzp.open();
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
      <button
        onClick={handleCheckout}
        disabled={loading}
        className="bg-blue-700 text-white px-6 py-2 rounded-lg hover:bg-blue-900 transition disabled:opacity-50"
      >
        {loading ? "Processing..." : `Buy Now`}
      </button>
    </>
  );
}
