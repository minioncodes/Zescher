"use client";

import { useState } from "react";
import Image from "next/image";
import { useDispatch } from "react-redux";
import { addToCart } from "@/redux/slices/user-slice/cartSlice";
import { useBuyNow } from "./useBuyNow";

export default function ProductVariantSelector({ product }: { product: any }) {
  const dispatch = useDispatch();
  const { buyNow } = useBuyNow();

  const [selectedImage, setSelectedImage] = useState(
    product.images?.[0]
  );
  const [selectedVariant, setSelectedVariant] = useState(
    product.variants?.[0] || null
  );

  const price = selectedVariant?.price ?? product.price;
  const stock = selectedVariant?.stock ?? product.stock;

  return (
    <div className="space-y-6">
      {/* IMAGE */}
      <div className="bg-white rounded-lg shadow-lg">
        <div className="relative w-full h-[620px]">
          <Image
            src={selectedImage || "/placeholder.png"}
            alt={product.name}
            fill
            className="object-cover"
          />
        </div>

        {product.images?.length > 1 && (
          <div className="flex gap-2 mt-3 overflow-x-auto p-2">
            {product.images.map((img: string, i: number) => (
              <button
              title="Image"
                key={i}
                onClick={() => setSelectedImage(img)}
                className={`border rounded p-1 ${
                  selectedImage === img
                    ? "border-green-600"
                    : "border-gray-300"
                }`}
              >
                <Image src={img} alt="" width={60} height={60} />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* VARIANTS */}
      {product.variants?.length > 0 && (
        <div>
          <h3 className="font-semibold mb-2">Select Variant</h3>
          <div className="flex flex-wrap gap-2">
            {product.variants.map((v: any) => (
              <button
                key={v.sku}
                disabled={v.stock === 0}
                onClick={() => {
                  setSelectedVariant(v);
                  if (v.image) setSelectedImage(v.image);
                }}
                className={`px-4 py-2 border rounded text-sm font-medium ${
                  selectedVariant?.sku === v.sku
                    ? "border-green-600 bg-green-50"
                    : "border-gray-300"
                } ${v.stock === 0 ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                {v.color} {v.size && ` / ${v.size}`}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* PRICE */}
      <div className="text-2xl font-bold text-green-600">
        ₹{price}
      </div>

      <div
        className={`text-sm font-semibold ${
          stock > 0 ? "text-green-600" : "text-red-500"
        }`}
      >
        {stock > 0 ? "In Stock" : "Out of Stock"}
      </div>

      {/* ACTIONS */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          disabled={stock === 0}
          onClick={() =>
            dispatch(
              addToCart({
                _id: product._id,
                variantSku: selectedVariant?.sku,
                name: product.name,
                price,
                images: [selectedImage],
                quantity: 1,
                color: selectedVariant?.color,
                size: selectedVariant?.size,
              })
            )
          }
          className={`w-full sm:w-auto px-6 py-3 rounded-lg font-semibold ${
            stock > 0
              ? "bg-green-600 hover:bg-green-700 text-white"
              : "bg-gray-300 text-gray-600 cursor-not-allowed"
          }`}
        >
          Add to Cart
        </button>

        {stock > 0 && (
          <button
            onClick={() => buyNow(product._id)}
            className="w-full sm:w-auto px-6 py-3 rounded-lg font-semibold bg-black text-white hover:bg-black/90"
          >
            Buy Now
          </button>
        )}
      </div>
    </div>
  );
}
