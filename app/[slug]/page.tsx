import { getProductBySlug } from "@/lib/product";
import { notFound } from "next/navigation";
import { FaStar } from "react-icons/fa";
import ProductVariantSelector from "@/components/user/ProductVariantSelector";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function ProductDetail({ params }: PageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) return notFound();

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
    
        <ProductVariantSelector product={product} />

     
        <div className="space-y-4">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            {product.name}
          </h1>

        
          <div className="text-sm text-gray-600">
            <span className="font-medium">Brand:</span>{" "}
            {product.brand || "N/A"}
          </div>
          <div className="text-sm text-gray-600">
            <span className="font-medium">Category:</span>{" "}
            {product.category.name}
          </div>

          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 bg-green-600 text-white text-sm px-2 py-1 rounded">
              {product.averageRating || 0}
              <FaStar size={12} />
            </span>
            <span className="text-sm text-gray-500">
              ({product.ratings?.length || 0} reviews)
            </span>
          </div>

     
          <p className="text-gray-700 leading-relaxed">
            {product.description}
          </p>

          {product.attributes?.length > 0 && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Product Details
              </h3>
              <div className="border rounded">
                {product.attributes.map((attr: any, i: number) => (
                  <div
                    key={i}
                    className="flex justify-between px-4 py-2 text-sm border-b last:border-b-0"
                  >
                    <span className="text-gray-600">{attr.key}</span>
                    <span className="font-medium">{attr.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* REVIEWS */}
      {product.ratings?.length > 0 && (
        <div className="mt-10">
          <h2 className="text-xl font-bold mb-4">Customer Reviews</h2>
          <div className="space-y-4">
            {product.ratings.map((r: any, i: number) => (
              <div key={i} className="border rounded p-4">
                <div className="flex items-center gap-1 mb-1">
                  {[...Array(r.rating)].map((_, j) => (
                    <FaStar
                      key={j}
                      size={14}
                      className="text-yellow-400"
                    />
                  ))}
                </div>
                {r.comment && (
                  <p className="text-gray-700">{r.comment}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
