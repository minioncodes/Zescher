"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { FiCheckCircle } from "react-icons/fi";

type Address = {
  _id: string;
  name: string;
  phone: string;
  address: string;
  locality: string;
  city: string;
  state: string;
  pincode: string;
};

export default function CheckoutPage() {
  const router = useRouter();
  const cartItems = useSelector((state: RootState) => state.cart.items);

  const [step, setStep] = useState<1 | 2>(1);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "online">("cod");
  const [placingOrder, setPlacingOrder] = useState(false);

  const totalAmount = cartItems.reduce(
    (sum, i) => sum + i.price * i.quantity,
    0
  );

  useEffect(() => {
    if (cartItems.length === 0) {
      router.push("/cart");
    }
  }, [cartItems, router]);

  useEffect(() => {
    fetch("/api/user/addresses")
      .then((res) => res.json())
      .then((data) => setAddresses(data || []));
  }, []);

  const placeOrder = async () => {
    if (!selectedAddress) return;

    setPlacingOrder(true);

    // Placeholder – integrate payment / order API here
    setTimeout(() => {
      router.push("/orders");
    }, 1200);
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-semibold mb-8">Checkout</h1>

      {/* STEP INDICATOR */}
      <div className="flex items-center gap-6 mb-10 text-sm">
        <div className={`flex items-center gap-2 ${step >= 1 ? "text-black" : "text-black/40"}`}>
          <FiCheckCircle /> Shipping
        </div>
        <div className={`flex items-center gap-2 ${step === 2 ? "text-black" : "text-black/40"}`}>
          <FiCheckCircle /> Payment
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

        {/* LEFT */}
        <div className="md:col-span-2 space-y-8">

          {/* STEP 1: ADDRESS */}
          {step === 1 && (
            <section className="border rounded-xl p-6">
              <h2 className="text-lg font-medium mb-4">
                Select Delivery Address
              </h2>

              <div className="space-y-4">
                {addresses.map((addr) => (
                  <label
                    key={addr._id}
                    className={`block border rounded-lg p-4 cursor-pointer ${
                      selectedAddress === addr._id
                        ? "border-black"
                        : "border-black/10"
                    }`}
                  >
                    <input
                      type="radio"
                      name="address"
                      checked={selectedAddress === addr._id}
                      onChange={() => setSelectedAddress(addr._id)}
                      className="mr-3"
                    />
                    <span className="font-medium">{addr.name}</span>
                    <p className="text-sm text-black/60 mt-1">
                      {addr.address}, {addr.locality}, {addr.city},{" "}
                      {addr.state} – {addr.pincode}
                    </p>
                    <p className="text-sm mt-1">Phone: {addr.phone}</p>
                  </label>
                ))}
              </div>

              <button
                disabled={!selectedAddress}
                onClick={() => setStep(2)}
                className="mt-6 px-6 py-3 bg-black text-white rounded-xl disabled:opacity-50"
              >
                Continue to Payment
              </button>
            </section>
          )}

          {/* STEP 2: PAYMENT */}
          {step === 2 && (
            <section className="border rounded-xl p-6">
              <h2 className="text-lg font-medium mb-4">
                Payment Method
              </h2>

              <div className="space-y-4">
                <label className="flex items-center gap-3">
                  <input
                    type="radio"
                    checked={paymentMethod === "cod"}
                    onChange={() => setPaymentMethod("cod")}
                  />
                  Cash on Delivery
                </label>

                <label className="flex items-center gap-3">
                  <input
                    type="radio"
                    checked={paymentMethod === "online"}
                    onChange={() => setPaymentMethod("online")}
                  />
                  Online Payment (UPI / Card)
                </label>
              </div>

              <div className="flex gap-4 mt-6">
                <button
                  onClick={() => setStep(1)}
                  className="px-6 py-3 border rounded-xl"
                >
                  Back
                </button>

                <button
                  disabled={placingOrder}
                  onClick={placeOrder}
                  className="px-6 py-3 bg-black text-white rounded-xl"
                >
                  {placingOrder ? "Placing Order…" : "Place Order"}
                </button>
              </div>
            </section>
          )}
        </div>

        {/* RIGHT – ORDER SUMMARY */}
        <aside className="border rounded-xl p-6 h-fit">
          <h3 className="text-lg font-medium mb-4">Order Summary</h3>

          <div className="space-y-3 text-sm">
            {cartItems.map((item) => (
              <div key={item._id} className="flex justify-between">
                <span>
                  {item.name} × {item.quantity}
                </span>
                <span>₹{item.price * item.quantity}</span>
              </div>
            ))}
          </div>

          <div className="border-t mt-4 pt-4 flex justify-between font-medium">
            <span>Total</span>
            <span>₹{totalAmount}</span>
          </div>
        </aside>
      </div>
    </div>
  );
}
