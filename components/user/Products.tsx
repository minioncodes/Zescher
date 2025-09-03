import { getProducts } from "@/app/actions/userActions/user-products";

export default async function Products() {
  const products = await getProducts();

  return (
    <div className="p-6 shadow-xl rounded-2xl bg-gray-300 text-white border border-green-500 max-w-3xl mx-auto mt-10">
      <h1 className="text-4xl font-extrabold text-green-400 mb-6 text-center">
        Products
      </h1>

     
      <ul className="space-y-3">
        {products?.map((product) => (
          <li
            key={product._id}
            className="p-4 bg-gray-800 rounded-lg border border-gray-700 hover:border-green-400 transition"
          >
            <span className="font-semibold">{product.name}</span>{" "}
            <span className="text-green-400">${product.price}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
