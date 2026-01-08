"use client";

import { useEffect, useState } from "react";
import { FiTrash2, FiRefreshCcw } from "react-icons/fi";

type Product = {
  _id: string;
  name: string;
  price: number;
  stock: number;
  images?: string[];
};

export default function DeleteProduct() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

 

  async function loadProducts() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/product/getProducts", {
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error("Unauthorized or failed to load products");
      }

      const data = await res.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch (err: any) {
      alert(err.message || "Failed to load products");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProducts();
  }, []);

 

  async function deleteProduct(id: string) {
    const confirmDelete = confirm(
      " Are you sure?\n\nThis product will be permanently deleted."
    );
    if (!confirmDelete) return;

    setDeletingId(id);

    try {
      const res = await fetch("/api/admin/product/delete-product", {
        method: "DELETE",
        credentials: "include", 
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.msg || "Delete failed");
      }

     
      setProducts((prev) => prev.filter((p) => p._id !== id));
    } catch (err: any) {
      alert(err.message || "Something went wrong");
    } finally {
      setDeletingId(null);
    }
  }

  

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-red-600">
          Delete Products (Admin Only)
        </h1>

        <button
          onClick={loadProducts}
          className="flex items-center gap-2 px-3 py-2 border rounded-lg bg-white hover:bg-gray-50"
        >
          <FiRefreshCcw /> Refresh
        </button>
      </div>

      {loading ? (
        <div>Loading products…</div>
      ) : products.length === 0 ? (
        <div className="text-gray-600">No products available.</div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => (
            <div
              key={p._id}
              className="border rounded-xl p-4 bg-white flex flex-col"
            >
              <div className="flex gap-3 items-center">
                {p.images?.[0] ? (
                  <img
                    src={p.images[0]}
                    alt={p.name}
                    className="w-14 h-14 rounded object-cover border"
                  />
                ) : (
                  <div className="w-14 h-14 rounded bg-gray-100 border" />
                )}

                <div className="flex-1">
                  <div className="font-semibold line-clamp-1">{p.name}</div>
                  <div className="text-sm text-gray-500">
                    ₹{p.price} • Stock {p.stock}
                  </div>
                </div>
              </div>

              <button
                onClick={() => deleteProduct(p._id)}
                disabled={deletingId === p._id}
                className="mt-4 inline-flex items-center justify-center gap-2 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 disabled:opacity-60"
              >
                <FiTrash2 />
                {deletingId === p._id ? "Deleting…" : "Delete"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
