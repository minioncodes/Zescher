"use client";

import { useEffect, useState } from "react";
import {
  FiEdit,
  FiTrash2,
  FiPlus,
  FiHome,
  FiBriefcase,
} from "react-icons/fi";

type Address = {
  _id?: string;
  name: string;
  phone: string;
  pincode: string;
  locality: string;
  address: string;
  city: string;
  state: string;
  landmark?: string;
  altPhone?: string;
  type: "home" | "work";
};

const emptyAddress: Address = {
  name: "",
  phone: "",
  pincode: "",
  locality: "",
  address: "",
  city: "",
  state: "",
  landmark: "",
  altPhone: "",
  type: "home",
};

export default function AddressesPage() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [form, setForm] = useState<Address>(emptyAddress);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Fetch addresses
  useEffect(() => {
    fetch("/api/user/addresses")
      .then((res) => res.json())
      .then((data) => setAddresses(data || []));
  }, []);

  const handleChange = (field: keyof Address, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setSaving(true);

    const res = await fetch("/api/user/addresses", {
      method: editingId ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, id: editingId }),
    });

    const data = await res.json();

    if (res.ok) {
      setAddresses(data);
      resetForm();
    }

    setSaving(false);
  };

  const handleEdit = (address: Address) => {
    setForm(address);
    setEditingId(address._id || null);
    setShowForm(true);
  };

const handleDelete = async (_id: string) => {
  if (!_id) {
    console.error("Delete failed: missing _id");
    return;
  }

  if (!confirm("Are you sure you want to delete this address?")) return;

  const res = await fetch(`/api/user/addresses?id=${_id}`, {
    method: "DELETE",
  });

  const data = await res.json();

  if (!res.ok) {
    console.error("Delete error:", data);
    return;
  }

  setAddresses(data);
};


  const resetForm = () => {
    setForm(emptyAddress);
    setEditingId(null);
    setShowForm(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">My Addresses</h1>

        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 text-blue-600 font-medium"
          >
            <FiPlus /> ADD NEW ADDRESS
          </button>
        )}
      </div>

      {/* ADDRESS FORM */}
      {showForm && (
        <div className="bg-white border border-black/10 rounded-xl p-6 mb-8">
          <h2 className="text-lg font-semibold mb-4">
            {editingId ? "Edit Address" : "Add New Address"}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input className="input" placeholder="Name" value={form.name} onChange={(e) => handleChange("name", e.target.value)} />
            <input className="input" placeholder="10-digit mobile number" value={form.phone} onChange={(e) => handleChange("phone", e.target.value)} />
            <input className="input" placeholder="Pincode" value={form.pincode} onChange={(e) => handleChange("pincode", e.target.value)} />
            <input className="input" placeholder="Locality" value={form.locality} onChange={(e) => handleChange("locality", e.target.value)} />
          </div>

          <textarea
            className="input mt-4 h-24"
            placeholder="Address (Area and Street)"
            value={form.address}
            onChange={(e) => handleChange("address", e.target.value)}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <input className="input" placeholder="City / District / Town" value={form.city} onChange={(e) => handleChange("city", e.target.value)} />
            <select title="Select State" className="input" value={form.state} onChange={(e) => handleChange("state", e.target.value)}>
            <option value="">-- Select State --</option>
            <option>Andhra Pradesh</option>
            <option>Arunachal Pradesh</option>
            <option>Assam</option>
            <option>Bihar</option>
            <option>Chhattisgarh</option>
            <option>Goa</option>
            <option>Gujarat</option>
            <option>Haryana</option>
            <option>Himachal Pradesh</option>
            <option>Jharkhand</option>
            <option>Karnataka</option>
            <option>Kerala</option>
            <option>Madhya Pradesh</option>
            <option>Maharashtra</option>
            <option>Manipur</option>
            <option>Meghalaya</option>
            <option>Mizoram</option>
            <option>Nagaland</option>
            <option>Odisha</option>
            <option>Punjab</option>
            <option>Rajasthan</option>
            <option>Sikkim</option>
            <option>Tamil Nadu</option>
            <option>Telangana</option>
            <option>Tripura</option>
            <option>Uttar Pradesh</option>
            <option>Uttarakhand</option>
            <option>West Bengal</option>

            </select>
            <input className="input" placeholder="Landmark (Optional)" value={form.landmark} onChange={(e) => handleChange("landmark", e.target.value)} />
            <input className="input" placeholder="Alternate Phone (Optional)" value={form.altPhone} onChange={(e) => handleChange("altPhone", e.target.value)} />
          </div>

          {/* ADDRESS TYPE */}
          <div className="mt-4 flex gap-6 text-sm">
            <label className="flex items-center gap-2">
              <input type="radio" checked={form.type === "home"} onChange={() => handleChange("type", "home")} />
              <FiHome /> Home
            </label>
            <label className="flex items-center gap-2">
              <input type="radio" checked={form.type === "work"} onChange={() => handleChange("type", "work")} />
              <FiBriefcase /> Work
            </label>
          </div>

          {/* ACTIONS */}
          <div className="flex gap-6 mt-6">
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-8 py-3 bg-blue-600 text-white rounded-md font-medium"
            >
              {saving ? "Saving..." : "SAVE"}
            </button>
            <button onClick={resetForm} className="text-blue-600 font-medium">
              CANCEL
            </button>
          </div>
        </div>
      )}

      {/* SAVED ADDRESSES */}
      <div className="space-y-4">
        {addresses.map((addr) => (
          <div
            key={addr._id}
            className="border border-black/10 rounded-xl p-5 flex flex-col sm:flex-row sm:justify-between gap-4"
          >
            <div>
              <p className="font-semibold flex items-center gap-2">
                {addr.name}
                <span className="text-xs px-2 py-0.5 rounded bg-black/5">
                  {addr.type}
                </span>
              </p>
              <p className="text-sm text-black/70 mt-1">
                {addr.address}, {addr.locality}, {addr.city}, {addr.state} –{" "}
                {addr.pincode}
              </p>
              <p className="text-sm mt-1">Phone: {addr.phone}</p>
            </div>

            <div className="flex items-center gap-4 text-sm">
              <button
                onClick={() => handleEdit(addr)}
                className="flex items-center gap-1 text-blue-600"
              >
                <FiEdit /> Edit
              </button>
              <button
                onClick={() => handleDelete(addr._id)}
                disabled={deletingId === addr._id}
                className="flex items-center gap-1 text-red-600"
              >
                <FiTrash2 />
                {deletingId === addr._id ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* INPUT STYLE */}
      <style jsx>{`
        .input {
          width: 100%;
          border: 1px solid #e5e7eb;
          border-radius: 0.5rem;
          padding: 0.75rem;
          font-size: 0.875rem;
          outline: none;
        }
        .input:focus {
          border-color: #2563eb;
          box-shadow: 0 0 0 1px #2563eb;
        }
      `}</style>
    </div>
  );
}
