import { notFound } from "next/navigation";
import ProductsList from "@/components/user/Products";
import { getProductsByCategorySlug } from "@/lib/category";

type PageProps = {
  params: { slug: string };
};

export default async function CategoryProductsPage({
  params,
}: PageProps) {
  const { slug } = await params;

  const data = await getProductsByCategorySlug(slug);

  if (!data) return notFound();

  const { category, products } = data;

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">
        {category.name}
      </h1>

      {products.length > 0 ? (
        <ProductsList products={products} />
      ) : (
        <p className="text-gray-500">
          No products found in this category.
        </p>
      )}
    </div>
  );
}
