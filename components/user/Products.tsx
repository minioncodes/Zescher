"use client";

import { useDispatch } from "react-redux";
import { addToCart } from "@/redux/slices/user-slice/cartSlice";
import Image from "next/image";
import { FaStar } from "react-icons/fa";
import CheckoutButton from "../checkout/CheckoutButton";

export default function ProductsList({ products }: { products: any[] }) {
  const dispatch = useDispatch();

  return (
  <div className="p-6 max-w-7xl mx-auto mt-10">
 
  <h1 className="text-4xl font-extrabold text-green-600 mb-10 text-center">
    Products
  </h1>


  <div className="grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
    {products?.map((product) => (
      <div
        key={product._id}
        className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col"
      >
  
        <div className="relative w-full h-64 bg-gray-50">
          <Image
            src={product.images?.[0] || "/placeholder.png"}
            alt={product.name}
            fill
            className="object-cover"
          />
          {product.isFeatured && (
            <span className="absolute top-2 left-2 text-white text-xs px-3 py-1 rounded-full bg-gradient-to-r from-indigo-600 to-pink-500 shadow-md">
              Featured
            </span>
          )}
        </div>

   
        <div className="p-5 flex flex-col flex-grow space-y-3">
    
          <h2 className="text-lg font-semibold text-gray-900 truncate">
            {product.name}
          </h2>

     
          <p className="text-sm text-gray-600 line-clamp-2">
            {product.description}
          </p>


          <div className="flex items-center space-x-1">
            {[...Array(5)].map((_, i) => (
              <FaStar
                key={i}
                size={16}
                className={`${
                  i < Math.round(product.averageRating || 0)
                    ? "text-yellow-400 fill-yellow-400"
                    : "text-gray-300"
                }`}
              />
            ))}
            <span className="text-sm text-gray-500 ml-1">
              ({product.ratings?.length || 0})
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-xl font-bold text-green-600">
              ₹{product.price}
            </span>
            <span
              className={`text-sm font-medium ${
                product.stock > 0 ? "text-green-500" : "text-red-500"
              }`}
            >
              {product.stock > 0 ? "In Stock" : "Out of Stock"}
            </span>
          </div>

          {product.brand && (
            <div className="text-xs text-gray-500">{product.brand}</div>
          )}

          <div className="grid grid-cols-2 gap-2 mt-auto pt-1">
       
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
              className={`p-0 rounded-xl text-white font-semibold transition ${
                product.stock > 0
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
            >
              {product.stock > 0 ? "Add to Cart" : "Sold Out"}
            </button>

            {product.stock > 0 && (
              <div>
                <CheckoutButton
                  amount={product.price}
                
                />
              </div>
            )}
          </div>
        </div>
      </div>
    ))}
  </div>
</div>

  );
}
