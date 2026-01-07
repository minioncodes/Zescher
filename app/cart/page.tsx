"use client";

import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import { addToCart, removeFromCart, clearCart} from "@/redux/slices/user-slice/cartSlice";
import Image from "next/image";

export default function CartPage() {
  const dispatch = useDispatch();
  const cart = useSelector((state: RootState) => state.cart.items);

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto mt-16 text-center">
        <h1 className="text-3xl font-bold mb-4">Your Cart is Empty 🛒</h1>
        <p className="text-gray-600">Add some products to see them here.</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-8">Your Cart</h1>

      <div className="space-y-6">
        {cart.map((item) => (
          <div
            key={item._id}
            className="flex items-center justify-between bg-white p-4 rounded-xl shadow"
          >
            
            <div className="flex items-center space-x-4">
              <div className="relative w-20 h-20">
                <Image
                  src={item.images[0] || ""}
                  alt={item.name}
                  fill
                  className="object-cover rounded-lg"
                />
              </div>
              <div>
                <h2 className="text-lg font-semibold">{item.name}</h2>
                <p className="text-gray-600">${item.price}</p>
              </div>
            </div>

           
            <div className="flex items-center space-x-3">
              <button
                onClick={() =>
                  dispatch(removeFromCart({ id: item._id, decreaseOnly: true }))
                }
                className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
              >
                -
              </button>
              <span className="font-medium">{item.quantity}</span>
              <button
                onClick={() => dispatch(addToCart(item))}
                className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
              >
                +
              </button>
            </div>

            <button
              onClick={() => dispatch(removeFromCart({ id: item._id }))}
              className="text-red-500 hover:text-red-700 text-sm"
            >
              Remove
            </button>
          </div>
        ))}
      </div>


      <div className="mt-10 flex justify-between items-center bg-white p-6 rounded-xl shadow">
        <h2 className="text-2xl font-bold">Total: ${total.toFixed(2)}</h2>
        <div className="flex space-x-4">
          <button
            onClick={() => dispatch(clearCart())}
            className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100"
          >
            Clear Cart
          </button>
          <button className="px-6 py-2 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700">
            Checkout
          </button>
        </div>
      </div>
    </div>
  );
}
