import { getAllProducts } from "@/lib/product";
import ProductsList from "@/components/user/Products";

export default async function ProductsPage() {
  const products = await getAllProducts();

  return <ProductsList products={products} />;
}
