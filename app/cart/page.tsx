"use client";

import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import {
  addToCart,
  removeFromCart,
  clearCart,
} from "@/redux/slices/user-slice/cartSlice";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useAuthModal } from "@/context/AuthModalContext";

export default function CartPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { status } = useSession();
  const { openAuth } = useAuthModal();

  const cart = useSelector((state: RootState) => state.cart.items);

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  function handleCheckout() {
    if (status === "loading") return;

    if (status === "unauthenticated") {
      openAuth("/checkout");
      return;
    }

    router.push("/checkout");
  }

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto mt-20 text-center">
        <h1 className="text-3xl font-bold mb-4">Your Cart is Empty</h1>
        <p className="text-gray-600">
          Add some products to see them here.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-8">
        Your Cart
      </h1>

      {/* CART ITEMS */}
      <div className="space-y-5">
        {cart.map((item) => (
          <div
            key={item._id}
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-4 rounded-xl shadow"
          >
            {/* LEFT */}
            <div className="flex items-center gap-4">
              <div className="relative w-20 h-20 shrink-0">
                <Image
                  src={item.images?.[0] || "/placeholder.png"}
                  alt={item.name}
                  fill
                  className="object-cover rounded-lg"
                />
              </div>
              <div>
                <h2 className="text-lg font-semibold">
                  {item.name}
                </h2>
                <p className="text-gray-600">
                  ₹{item.price}
                </p>
              </div>
            </div>

            {/* QUANTITY */}
            <div className="flex items-center gap-3">
              <button
                onClick={() =>
                  dispatch(
                    removeFromCart({
                      id: item._id,
                      decreaseOnly: true,
                    })
                  )
                }
                className="h-8 w-8 rounded bg-gray-200 hover:bg-gray-300"
              >
                −
              </button>

              <span className="font-medium">
                {item.quantity}
              </span>

              <button
                onClick={() => dispatch(addToCart(item))}
                className="h-8 w-8 rounded bg-gray-200 hover:bg-gray-300"
              >
                +
              </button>
            </div>

            {/* REMOVE */}
            <button
              onClick={() =>
                dispatch(removeFromCart({ id: item._id }))
              }
              className="text-sm text-red-600 hover:underline"
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      {/* FOOTER BAR */}
      <div className="mt-10 bg-white p-6 rounded-xl shadow flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-2xl font-bold">
          Total: ₹{total.toFixed(2)}
        </h2>

        <div className="flex gap-3">
          <button
            onClick={() => dispatch(clearCart())}
            className="px-5 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100"
          >
            Clear Cart
          </button>

          <button
            onClick={handleCheckout}
            className="px-6 py-2 rounded-lg bg-black text-white font-semibold hover:bg-black/90"
          >
            Checkout
          </button>
        </div>
      </div>
    </div>
  );
}
