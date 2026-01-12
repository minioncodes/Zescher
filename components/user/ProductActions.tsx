"use client";

import { useDispatch } from "react-redux";
import { addToCart } from "@/redux/slices/user-slice/cartSlice";
import CheckoutButton from "@/components/checkout/CheckoutButton";

export default function ProductActions({ product }: { product: any }) {
  const dispatch = useDispatch();

  return (
    <div className="flex flex-col sm:flex-row gap-3 mt-4">
   
      <button
        disabled={product.stock === 0}
        onClick={() =>
          dispatch(
            addToCart({
              _id: product._id,
              name: product.name,
              price: product.price,
              images: product.images,
              quantity: 1,
            })
          )
        }
        className={`
          w-full sm:w-auto
          px-4 sm:px-6
          py-2.5
          text-sm sm:text-base
          rounded-lg
          font-semibold
          transition
          ${
            product.stock > 0
              ? "bg-green-600 hover:bg-green-700 text-white"
              : "bg-gray-300 text-gray-600 cursor-not-allowed"
          }
        `}
      >
        Add to Cart
      </button>

      {/* BUY NOW */}
      {product.stock > 0 && (
        <div className="w-full sm:w-auto">
          <CheckoutButton amount={product.price} />
        </div>
      )}
    </div>
  );
}
