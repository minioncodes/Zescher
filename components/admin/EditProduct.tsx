// components/admin/EditProduct.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import {
  FiEdit,
  FiX,
  FiSearch,
  FiRefreshCcw,
  FiSave,
} from "react-icons/fi";

type Rating = {
  userId: string;
  rating: number;
  comment?: string;
  createdAt: string | Date;
};

type Attr = { key: string; value: string };
type Variant = { sku: string; color?: string; size?: string; price?: number; stock?: number };

export type Product = {
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
  ratings: Rating[];
  averageRating: number;
  isFeatured: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
};

export default function EditProduct() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");

  // Modal state
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);

  // Load all
  async function load() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/product/getProducts", { credentials: "include" });
      const data = await res.json();
      setProducts(Array.isArray(data) ? data : []);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return products;
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(term) ||
        p.slug.toLowerCase().includes(term) ||
        (p.brand ?? "").toLowerCase().includes(term) ||
        (p.category ?? "").toLowerCase().includes(term)
    );
  }, [q, products]);

  async function startEdit(id: string) {
    setErr(null);
    setMsg(null);
    // fetch fresh product detail
    const res = await fetch(`/api/admin/product/getProducts/${id}`, { credentials: "include" });
    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      setErr(j?.msg || "Failed to load product");
      return;
    }
    const data: Product = await res.json();
    setEditing(data);
    setOpen(true);
  }

  async function save() {
    if (!editing) return;
    setSaving(true);
    setErr(null);
    setMsg(null);
    try {
      let attributes: Attr[] | string | undefined = editing.attributes;
      let variants: Variant[] | string | undefined = editing.variants;

      // If user changed textareas to strings (JSON), parse
      if (typeof attributes === "string") attributes = JSON.parse(attributes);
      if (typeof variants === "string") variants = JSON.parse(variants);

      const res = await fetch(`/api/admin/product/edit-products/${editing._id}`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editing.name,
          slug: editing.slug,
          description: editing.description,
          price: editing.price,
          stock: editing.stock,
          category: editing.category,
          brand: editing.brand,
          images: editing.images,
          attributes,
          variants,
          isFeatured: editing.isFeatured,
          isActive: editing.isActive,
        }),
      });
      const j = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(j?.msg || "Update failed");

      setProducts((prev) => prev.map((p) => (p._id === j._id ? j : p)));
      setMsg(" Product updated");
    } catch (e: any) {
      setErr(e?.message || "Error updating product");
    } finally {
      setSaving(false);
    }
  }

  function close() {
    setOpen(false);
    setEditing(null);
    setErr(null);
    setMsg(null);
  }

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
        <div className="flex items-center gap-2 border rounded-lg px-3 py-2 bg-white w-full sm:max-w-md">
          <FiSearch className="text-gray-400" />
          <input
            placeholder="Search by name, slug, brand, category"
            className="w-full outline-none bg-transparent"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
        <button
          onClick={load}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border bg-white hover:bg-gray-50"
          title="Refresh"
        >
          <FiRefreshCcw /> Refresh
        </button>
      </div>

      {/* Grid */}
      {loading ? (
        <div>Loading products…</div>
      ) : filtered.length === 0 ? (
        <div className="text-gray-600">No products found.</div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((p) => (
            <div key={p._id} className="bg-white border rounded-xl p-4 flex flex-col">
              <div className="flex items-center gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                {p.images?.[0] ? (
                  <img
                    src={p.images[0]}
                    alt={p.name}
                    className="w-16 h-16 rounded object-cover border"
                  />
                ) : (
                  <div className="w-16 h-16 rounded bg-gray-100 border" />
                )}
                <div className="flex-1">
                  <div className="font-medium line-clamp-1">{p.name}</div>
                  <div className="text-xs text-gray-500">
                    ₹{p.price} • Stock {p.stock}
                  </div>
                </div>
              </div>

              <div className="mt-3 flex gap-2">
                <button
                  onClick={() => startEdit(p._id)}
                  className="px-3 py-2 rounded-lg bg-blue-600 text-white text-sm hover:bg-blue-700 inline-flex items-center gap-2"
                >
                  <FiEdit /> Edit
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {open && editing && (
        <div className="fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={saving ? undefined : close}
          />
          <div className="absolute inset-0 p-4 md:p-8 overflow-auto flex items-start md:items-center justify-center">
            <div className="w-full max-w-3xl bg-white border rounded-2xl shadow-xl">
              {/* Modal header */}
              <div className="flex items-center justify-between px-6 py-4 border-b">
                <h3 className="text-lg font-semibold">Edit Product</h3>
                <button
                  onClick={close}
                  disabled={saving}
                  className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-60"
                  aria-label="Close"
                >
                  <FiX />
                </button>
              </div>

              {/* Body */}
              <div className="p-6 space-y-4">
                {err && (
                  <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                    {err}
                  </div>
                )}
                {msg && (
                  <div className="text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg px-3 py-2">
                    {msg}
                  </div>
                )}

                <div className="grid sm:grid-cols-2 gap-4">
                  <label className="flex flex-col gap-1">
                    <span className="text-sm text-gray-600">Name</span>
                    <input
                      className="border rounded-lg px-3 py-2"
                      value={editing.name}
                      onChange={(e) =>
                        setEditing({ ...editing, name: e.target.value })
                      }
                    />
                  </label>

                  <label className="flex flex-col gap-1">
                    <span className="text-sm text-gray-600">Slug</span>
                    <input
                      className="border rounded-lg px-3 py-2"
                      value={editing.slug}
                      onChange={(e) =>
                        setEditing({ ...editing, slug: e.target.value })
                      }
                    />
                  </label>

                  <label className="sm:col-span-2 flex flex-col gap-1">
                    <span className="text-sm text-gray-600">Description</span>
                    <textarea
                      className="border rounded-lg px-3 py-2"
                      rows={4}
                      value={editing.description}
                      onChange={(e) =>
                        setEditing({ ...editing, description: e.target.value })
                      }
                    />
                  </label>

                  <label className="flex flex-col gap-1">
                    <span className="text-sm text-gray-600">Price</span>
                    <input
                      type="number"
                      min={0}
                      className="border rounded-lg px-3 py-2"
                      value={editing.price}
                      onChange={(e) =>
                        setEditing({ ...editing, price: Number(e.target.value) })
                      }
                    />
                  </label>

                  <label className="flex flex-col gap-1">
                    <span className="text-sm text-gray-600">Stock</span>
                    <input
                      type="number"
                      min={0}
                      className="border rounded-lg px-3 py-2"
                      value={editing.stock}
                      onChange={(e) =>
                        setEditing({ ...editing, stock: Number(e.target.value) })
                      }
                    />
                  </label>

                  <label className="flex flex-col gap-1">
                    <span className="text-sm text-gray-600">Category</span>
                    <input
                      className="border rounded-lg px-3 py-2"
                      value={editing.category}
                      onChange={(e) =>
                        setEditing({ ...editing, category: e.target.value })
                      }
                    />
                  </label>

                  <label className="flex flex-col gap-1">
                    <span className="text-sm text-gray-600">Brand</span>
                    <input
                      className="border rounded-lg px-3 py-2"
                      value={editing.brand ?? ""}
                      onChange={(e) =>
                        setEditing({ ...editing, brand: e.target.value })
                      }
                    />
                  </label>

                  <label className="sm:col-span-2 flex flex-col gap-1">
                    <span className="text-sm text-gray-600">
                      Images (comma-separated URLs)
                    </span>
                    <input
                      className="border rounded-lg px-3 py-2"
                      value={(editing.images ?? []).join(", ")}
                      onChange={(e) =>
                        setEditing({
                          ...editing,
                          images: e.target.value
                            .split(",")
                            .map((s) => s.trim())
                            .filter(Boolean),
                        })
                      }
                    />
                  </label>

                  <label className="sm:col-span-2 flex flex-col gap-1">
                    <span className="text-sm text-gray-600">Attributes (JSON)</span>
                    <textarea
                      className="border rounded-lg px-3 py-2 font-mono text-sm"
                      rows={3}
                      value={JSON.stringify(editing.attributes ?? [], null, 2)}
                      onChange={(e) =>
                        setEditing({
                          ...editing,
                          // store raw string; we parse before PATCH
                          attributes: e.target.value as unknown as any,
                        })
                      }
                    />
                  </label>

                  <label className="sm:col-span-2 flex flex-col gap-1">
                    <span className="text-sm text-gray-600">Variants (JSON)</span>
                    <textarea
                      className="border rounded-lg px-3 py-2 font-mono text-sm"
                      rows={3}
                      value={JSON.stringify(editing.variants ?? [], null, 2)}
                      onChange={(e) =>
                        setEditing({
                          ...editing,
                          variants: e.target.value as unknown as any,
                        })
                      }
                    />
                  </label>

                  <div className="flex items-center gap-6 sm:col-span-2">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={!!editing.isFeatured}
                        onChange={(e) =>
                          setEditing({ ...editing, isFeatured: e.target.checked })
                        }
                      />
                      <span className="text-sm text-gray-700">Featured</span>
                    </label>

                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={!!editing.isActive}
                        onChange={(e) =>
                          setEditing({ ...editing, isActive: e.target.checked })
                        }
                      />
                      <span className="text-sm text-gray-700">Active</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-end gap-2 px-6 py-4 border-t">
                <button
                  onClick={close}
                  disabled={saving}
                  className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-60"
                >
                  Cancel
                </button>
                <button
                  onClick={save}
                  disabled={saving}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60"
                >
                  <FiSave />
                  {saving ? "Saving…" : "Save changes"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
