"use client";

import { useDispatch } from "react-redux";
import Image from "next/image";
import Link from "next/link";
import { FaStar } from "react-icons/fa";
import { addToCart } from "@/redux/slices/user-slice/cartSlice";
import { useBuyNow } from "./useBuyNow";

export default function ProductsList({ products = [] }: { products?: any[] }) {
  const dispatch = useDispatch();
  const { buyNow } = useBuyNow();
  

  return (
    <div className="px-4 sm:px-6 max-w-7xl mx-auto mt-6">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6">
        Products
      </h1>

      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.map((product) => (
<div
  key={product._id}
  className="bg-white rounded-lg shadow-lg hover:shadow-xl transition duration-200 flex flex-col relative"
>

            <Link href={`/${product.slug}`} className="block flex-1">
              <div className="relative w-full h-44 sm:h-52 bg-gray-100">
                <Image
                  src={product.images?.[0] || "/placeholder.png"}
                  alt={product.name}
                  fill
                  className="object-cover rounded-t-lg"
                />

                {product.isFeatured && (
                  <span className="absolute top-2 left-2 bg-green-600 text-white text-[10px] px-2 py-1 rounded">
                    FEATURED
                  </span>
                )}
              </div>

              <div className="p-3 space-y-1">
                <h2 className="text-sm sm:text-base font-medium text-gray-800 line-clamp-2">
                  {product.name}
                </h2>

                <div className="flex items-center gap-1 text-xs">
                  <span className="flex items-center gap-0.5 bg-green-600 text-white px-1.5 py-0.5 rounded">
                    {product.averageRating || 0}
                    <FaStar size={10} />
                  </span>
                  <span className="text-gray-500">
                    ({product.ratings?.length || 0})
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-base sm:text-lg font-semibold text-gray-900">
                    ₹{product.price}
                  </span>
                </div>

                <p
                  className={`text-xs font-medium ${
                    product.stock > 0 ? "text-green-600" : "text-red-500"
                  }`}
                >
                  {product.stock > 0 ? "In Stock" : "Out of Stock"}
                </p>
              </div>
            </Link>
<div className="hidden lg:flex items-center gap-3 p-4 pt-0 mt-auto">
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
  className={`flex-1 px-4 py-2.5 text-sm rounded-lg font-semibold transition
    ${
      product.stock > 0
        ? "bg-green-600 hover:bg-green-700 text-white"
        : "bg-gray-300 text-gray-600 cursor-not-allowed"
    }
  `}
>
  Add to Cart
</button>

{product.stock > 0 && (
<button
  onClick={() => buyNow(product._id)}
  className="flex-1 px-4 py-2.5 text-sm rounded-lg font-semibold bg-black text-white hover:bg-black/90"
>
  Buy Now
</button>
)}
    </div>
          </div>
        ))}
      </div>
    </div>
  );
}
