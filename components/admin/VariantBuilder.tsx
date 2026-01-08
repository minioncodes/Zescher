"use client";

import { useState } from "react";

type Variant = {
     sku: string; 
  color: string;
  size: string;
  price: number;
  stock: number;
};

export default function VariantBuilder({
  baseSlug,
  onChange,
}: {
  baseSlug: string;
  onChange: (variants: any[]) => void;
}) {
  const [variants, setVariants] = useState<Variant[]>([]);
  const [variant, setVariant] = useState<Variant>({
    sku: "",
    color: "",
    size: "",
    price: 0,
    stock: 0,
  });

  const generateSKU = (v: Variant) =>
    `${baseSlug}-${v.color}-${v.size}`.toUpperCase().replace(/\s+/g, "-");

  const addVariant = () => {
    if (!variant.color || !variant.size || !variant.price) return;

    const newVariants = [
      ...variants,
      {
        ...variant,
        sku: generateSKU(variant),
      },
    ];

    setVariants(newVariants);
    onChange(newVariants);

    setVariant({ sku: "", color: "", size: "", price: 0, stock: 0 });
  };

  const removeVariant = (index: number) => {
    const updated = variants.filter((_, i) => i !== index);
    setVariants(updated);
    onChange(updated);
  };

  return (
    <div className="border p-4 rounded">
      <h3 className="font-semibold mb-2">Variants</h3>

      {/* INPUTS */}
      <div className="grid grid-cols-2 gap-2 mb-3">
        <input
          placeholder="Color"
          value={variant.color}
          onChange={(e) =>
            setVariant({ ...variant, color: e.target.value })
          }
          className="border p-2"
        />
        <input
          placeholder="Size"
          value={variant.size}
          onChange={(e) =>
            setVariant({ ...variant, size: e.target.value })
          }
          className="border p-2"
        />
        <input
          type="number"
          placeholder="Price"
          value={variant.price}
          onChange={(e) =>
            setVariant({ ...variant, price: Number(e.target.value) })
          }
          className="border p-2"
        />
        <input
          type="number"
          placeholder="Stock"
          value={variant.stock}
          onChange={(e) =>
            setVariant({ ...variant, stock: Number(e.target.value) })
          }
          className="border p-2"
        />
      </div>

      <button
        type="button"
        onClick={addVariant}
        className="bg-black text-white px-4 py-2 rounded"
      >
        Add Variant
      </button>

      {/* TABLE */}
      {variants.length > 0 && (
        <table className="w-full mt-4 border text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">SKU</th>
              <th className="border p-2">Color</th>
              <th className="border p-2">Size</th>
              <th className="border p-2">Price</th>
              <th className="border p-2">Stock</th>
              <th className="border p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {variants.map((v, i) => (
              <tr key={i}>
                <td className="border p-2">{v.sku}</td>
                <td className="border p-2">{v.color}</td>
                <td className="border p-2">{v.size}</td>
                <td className="border p-2">{v.price}</td>
                <td className="border p-2">{v.stock}</td>
                <td className="border p-2 text-center">
                  <button
                    type="button"
                    onClick={() => removeVariant(i)}
                    className="text-red-600"
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
