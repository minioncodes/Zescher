"use client";

import { useState } from "react";

export default function AttributeBuilder({
  onChange,
}: {
  onChange: (attrs: any[]) => void;
}) {
  const [attrs, setAttrs] = useState<any[]>([]);
  const [key, setKey] = useState("");
  const [value, setValue] = useState("");

  const addAttr = () => {
    if (!key || !value) return;
    const updated = [...attrs, { key, value }];
    setAttrs(updated);
    onChange(updated);
    setKey("");
    setValue("");
  };

  return (
    <div className="border p-4 rounded">
      <h3 className="font-semibold mb-2">Attributes</h3>

      <div className="flex gap-2 mb-2">
        <input
          placeholder="Key (e.g. fit)"
          value={key}
          onChange={(e) => setKey(e.target.value)}
          className="border p-2 w-1/2"
        />
        <input
          placeholder="Value (e.g. Skinny Fit)"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="border p-2 w-1/2"
        />
      </div>

      <button
        type="button"
        onClick={addAttr}
        className="bg-black text-white px-3 py-1 rounded"
      >
        Add Attribute
      </button>

      <ul className="mt-2 text-sm">
        {attrs.map((a, i) => (
          <li key={i}>
            {a.key}: {a.value}
          </li>
        ))}
      </ul>
    </div>
  );
}
