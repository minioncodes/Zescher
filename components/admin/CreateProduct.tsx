"use client";

import { useEffect, useState } from "react";
import AttributeBuilder from "./AttributeBuilder";
import VariantBuilder from "./VariantBuilder";

export default function CreateProduct() {
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [attributes, setAttributes] = useState<any[]>([]);
  const [variants, setVariants] = useState<any[]>([]);
  const [slug, setSlug] = useState("");

  useEffect(() => {
    fetch("/api/admin/category/list")
      .then((res) => res.json())
      .then((data) => setCategories(data));
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    if (variants.length === 0) {
      alert("Please add at least one variant");
      setLoading(false);
      return;
    }

    const formData = new FormData(e.currentTarget);

    images.forEach((file) => formData.append("images", file));

    
    formData.append("attributes", JSON.stringify(attributes));
    formData.append("variants", JSON.stringify(variants));

    try {
      const res = await fetch("/api/admin/product/create-product", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Failed to create product");
        return;
      }

      alert("Product created successfully");
      e.currentTarget.reset();
      setImages([]);
      setAttributes([]);
      setVariants([]);
      setSlug("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Create Product</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="name"
          placeholder="Product Name"
          className="border p-2 w-full"
          required
        />

        <input
          name="slug"
          placeholder="Slug"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          className="border p-2 w-full"
          required
        />

        <textarea
          name="description"
          placeholder="Description"
          className="border p-2 w-full"
          required
        />

        <input
          type="number"
          name="price"
          placeholder="Base Price"
          className="border p-2 w-full"
          required
        />

        <input
          type="number"
          name="stock"
          placeholder="Base Stock"
          className="border p-2 w-full"
          required
        />

      
        <select name="category" className="border p-2 w-full" required>
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
        </select>

        <input
          name="brand"
          placeholder="Brand"
          className="border p-2 w-full"
        />

   
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={(e) => setImages(Array.from(e.target.files || []))}
          className="border p-2 w-full"
        />

   
        <AttributeBuilder onChange={setAttributes} />

      
        <VariantBuilder baseSlug={slug} onChange={setVariants} />

        <button
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded w-full"
        >
          {loading ? "Creating..." : "Create Product"}
        </button>
      </form>
    </div>
  );
}
