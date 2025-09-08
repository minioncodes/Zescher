"use client";

import { useState } from "react";

export default function CreateProduct() {
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<File[]>([]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    images.forEach((file) => formData.append("images", file));

    try {
      const res = await fetch("/api/admin/product/create-product", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json();
        alert("err " + err.message);
        return;
      }

      const data = await res.json();
      console.log("data = ",data);
      e.currentTarget.reset();
      setImages([]);
    } catch (error) {
      console.error(error);
      alert("something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Create Product</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="name" placeholder="Product Name" className="border p-2 w-full" required />
        <input name="slug" placeholder="Slug" className="border p-2 w-full" required />
        <textarea name="description" placeholder="Description" className="border p-2 w-full" required />
        <input type="number" name="price" placeholder="Price" className="border p-2 w-full" required />
        <input type="number" name="stock" placeholder="Stock" className="border p-2 w-full" required />
        <input name="category" placeholder="Category ID" className="border p-2 w-full" required />
        <input name="brand" placeholder="Brand ID" className="border p-2 w-full" required />

        {/* File input */}
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={(e) => setImages(Array.from(e.target.files || []))}
          className="border p-2 w-full"
        />

        {/* JSON inputs */}
        <textarea
          name="attributes"
          placeholder='Attributes JSON e.g. [{"key":"color","value":"red"}]'
          className="border p-2 w-full"
        />
        <textarea
          name="variants"
          placeholder='Variants JSON e.g. [{"size":"M","price":500}]'
          className="border p-2 w-full"
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          {loading ? "Creating..." : "Create Product"}
        </button>
      </form>
    </div>
  );
}
