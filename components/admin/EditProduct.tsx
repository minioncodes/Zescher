"use client";

import { useEffect, useMemo, useState } from "react";
import {
  FiEdit,
  FiX,
  FiSearch,
  FiRefreshCcw,
  FiSave,
  FiTrash2,
} from "react-icons/fi";
import AttributeBuilder from "./AttributeBuilder";
import VariantBuilder from "./VariantBuilder";

type Attr = { key: string; value: string };
type Variant = {
  sku: string;
  color?: string;
  size?: string;
  price?: number;
  stock?: number;
};

type Product = {
  _id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  brand?: string;
  images: string[];
  attributes?: Attr[];
  variants?: Variant[];
  isFeatured: boolean;
  isActive: boolean;
};

export default function EditProduct() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [saving, setSaving] = useState(false);

  const [attributes, setAttributes] = useState<Attr[]>([]);
  const [variants, setVariants] = useState<Variant[]>([]);

  const [keepImages, setKeepImages] = useState<string[]>([]);
  const [newImages, setNewImages] = useState<File[]>([]);

  /* ---------------- LOADERS ---------------- */

  async function loadProducts() {
    setLoading(true);
    const res = await fetch("/api/admin/product/getProducts", {
      credentials: "include",
    });
    const data = await res.json();
    setProducts(Array.isArray(data) ? data : []);
    setLoading(false);
  }

  async function loadCategories() {
    const res = await fetch("/api/admin/category/list", {
      credentials: "include",
    });
    const data = await res.json();
    setCategories(Array.isArray(data) ? data : []);
  }

  useEffect(() => {
    loadProducts();
    loadCategories();
  }, []);

  /* ---------------- SEARCH ---------------- */

  const filtered = useMemo(() => {
    const term = q.toLowerCase();
    if (!term) return products;
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(term) ||
        p.slug.toLowerCase().includes(term) ||
        (p.brand ?? "").toLowerCase().includes(term)
    );
  }, [q, products]);

  /* ---------------- EDIT ---------------- */

  async function startEdit(id: string) {
    const res = await fetch(`/api/admin/product/getProducts/${id}`, {
      credentials: "include",
    });
    const data: Product = await res.json();

    setEditing(data);
    setAttributes(data.attributes || []);
    setVariants(data.variants || []);
    setKeepImages(data.images || []);
    setNewImages([]);
    setOpen(true);
  }

  function closeModal() {
    setOpen(false);
    setEditing(null);
    setAttributes([]);
    setVariants([]);
    setKeepImages([]);
    setNewImages([]);
  }

  /* ---------------- SAVE ---------------- */

  async function save() {
    if (!editing) return;
    setSaving(true);

    try {
      /* ---- 1. SAVE TEXT DATA ---- */
      await fetch("/api/admin/product/edit-product", {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editing._id,
          name: editing.name,
          slug: editing.slug,
          description: editing.description,
          price: editing.price,
          stock: editing.stock,
          category: editing.category,
          brand: editing.brand,
          attributes,
          variants,
          isFeatured: editing.isFeatured,
          isActive: editing.isActive,
        }),
      });

      /* ---- 2. SAVE IMAGES ---- */
      if (newImages.length > 0 || keepImages.length !== editing.images.length) {
        const fd = new FormData();
        fd.append("id", editing._id);
        keepImages.forEach((url) => fd.append("keepImages", url));
        newImages.forEach((file) => fd.append("images", file));

        await fetch("/api/admin/product/edit-product", {
          method: "PATCH",
          credentials: "include",
          body: fd,
        });
      }

      await loadProducts();
      closeModal();
    } finally {
      setSaving(false);
    }
  }

  /* ---------------- UI ---------------- */

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex items-center gap-2 border rounded-lg px-3 py-2 bg-white w-full sm:max-w-md">
          <FiSearch />
          <input
            placeholder="Search products"
            className="w-full outline-none"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>

        <button
          onClick={loadProducts}
          className="flex items-center gap-2 px-3 py-2 border rounded-lg bg-white"
        >
          <FiRefreshCcw /> Refresh
        </button>
      </div>

      {/* Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((p) => (
          <div key={p._id} className="border rounded-xl p-4 bg-white">
            <div className="flex gap-3">
              {p.images?.[0] && (
                <img
                  src={p.images[0]}
                  className="w-14 h-14 rounded object-cover"
                />
              )}
              <div>
                <div className="font-semibold">{p.name}</div>
                <div className="text-sm text-gray-500">
                  ₹{p.price} • Stock {p.stock}
                </div>
              </div>
            </div>

            <button
              onClick={() => startEdit(p._id)}
              className="mt-3 w-full flex justify-center gap-2 bg-blue-600 text-white py-2 rounded-lg"
            >
              <FiEdit /> Edit
            </button>
          </div>
        ))}
      </div>

      {/* Modal */}
      {open && editing && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-auto">
            <div className="p-4 border-b flex justify-between">
              <h3 className="font-semibold">Edit Product</h3>
              <button onClick={closeModal}>
                <FiX />
              </button>
            </div>

            <div className="p-4 space-y-4">
              {/* BASIC INFO */}
              <input
                className="border p-2 w-full"
                value={editing.name}
                onChange={(e) =>
                  setEditing({ ...editing, name: e.target.value })
                }
                placeholder="Product name"
              />

              <input
                className="border p-2 w-full"
                value={editing.slug}
                onChange={(e) =>
                  setEditing({ ...editing, slug: e.target.value })
                }
                placeholder="Slug"
              />

              <textarea
                className="border p-2 w-full"
                rows={3}
                value={editing.description}
                onChange={(e) =>
                  setEditing({ ...editing, description: e.target.value })
                }
                placeholder="Description"
              />

              <div className="grid grid-cols-2 gap-3">
                <input
                  type="number"
                  className="border p-2"
                  value={editing.price}
                  onChange={(e) =>
                    setEditing({ ...editing, price: Number(e.target.value) })
                  }
                  placeholder="Price"
                />
                <input
                  type="number"
                  className="border p-2"
                  value={editing.stock}
                  onChange={(e) =>
                    setEditing({ ...editing, stock: Number(e.target.value) })
                  }
                  placeholder="Stock"
                />
              </div>

              <select
                className="border p-2 w-full"
                value={editing.category}
                onChange={(e) =>
                  setEditing({ ...editing, category: e.target.value })
                }
              >
                <option value="">Select category</option>
                {categories.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>

              <input
                className="border p-2 w-full"
                value={editing.brand ?? ""}
                onChange={(e) =>
                  setEditing({ ...editing, brand: e.target.value })
                }
                placeholder="Brand"
              />

              {/* FLAGS */}
              <div className="flex gap-6">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={editing.isFeatured}
                    onChange={(e) =>
                      setEditing({
                        ...editing,
                        isFeatured: e.target.checked,
                      })
                    }
                  />
                  Featured
                </label>

                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={editing.isActive}
                    onChange={(e) =>
                      setEditing({
                        ...editing,
                        isActive: e.target.checked,
                      })
                    }
                  />
                  Active
                </label>
              </div>

              {/* IMAGES */}
              <div>
                <div className="font-medium mb-2">Images</div>
                <div className="flex gap-3 flex-wrap">
                  {keepImages.map((img) => (
                    <div key={img} className="relative">
                      <img
                        src={img}
                        className="w-20 h-20 rounded object-cover border"
                      />
                      <button
                        onClick={() =>
                          setKeepImages((prev) =>
                            prev.filter((i) => i !== img)
                          )
                        }
                        className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1"
                      >
                        <FiTrash2 size={12} />
                      </button>
                    </div>
                  ))}
                </div>

                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) =>
                    setNewImages(Array.from(e.target.files || []))
                  }
                  className="mt-2"
                />
              </div>

              {/* ATTRIBUTES & VARIANTS */}
              <AttributeBuilder onChange={setAttributes} />
              <VariantBuilder
                baseSlug={editing.slug}
                onChange={setVariants}
              />
            </div>

            <div className="p-4 border-t flex justify-end gap-2">
              <button onClick={closeModal} className="px-4 py-2 border rounded">
                Cancel
              </button>
              <button
                onClick={save}
                disabled={saving}
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                <FiSave /> {saving ? "Saving…" : "Save changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
