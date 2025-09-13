"use client";

import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/redux-hooks";
import { fetchUser } from "@/redux/slices/user-slice/user-slice";
import { signOut } from "next-auth/react";
import { FiMail, FiLogOut, FiEdit } from "react-icons/fi";

export default function Profile() {
  const dispatch = useAppDispatch();
  const { user, loading, err } = useAppSelector((state) => state.user);
  const [formData, setFormData] = useState<any>(null);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  // Fetch user if not loaded
  useEffect(() => {
    if (!user) dispatch(fetchUser());
  }, [dispatch, user]);

  // Prefill formData
  useEffect(() => {
    if (user) {
      setFormData({
        ...user,
        address: user.address ? JSON.parse(user.address) : {},
      });
    }
  }, [user]);

  if (loading || !formData) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] text-gray-600 text-xl font-medium">
        Loading profile...
      </div>
    );
  }

  if (err) {
    return <p className="text-red-500 text-center mt-4 text-lg">{err}</p>;
  }

  const handleChange = (field: string, value: string) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleAddressChange = (field: string, value: string) => {
    setFormData((prev: any) => ({
      ...prev,
      address: { ...prev.address, [field]: value },
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage("");
    try {
      const payload = {
        ...formData,
        address: JSON.stringify(formData.address),
      };

      const res = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Update failed");

      setMessage("✅ Profile updated successfully!");
      setEditing(false);
      dispatch(fetchUser());
    } catch (err: any) {
      setMessage(`❌ ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-12 font-sans">
      <h1 className="text-4xl font-bold text-gray-900 mb-8 tracking-wide">My Profile</h1>

      <div className="bg-white border border-gray-200 rounded-2xl shadow-md p-8 space-y-6">
        {/* Name */}
        <div>
          <label className="block text-lg font-semibold text-gray-700 mb-1">Name</label>
          <input
            type="text"
            value={formData.name || ""}
            onChange={(e) => handleChange("name", e.target.value)}
            readOnly={!editing}
            className={`w-full border rounded-lg p-3 text-lg ${
              editing ? "bg-white" : "bg-gray-100 cursor-not-allowed"
            }`}
          />
        </div>

        {/* Email */}
        <div className="flex items-center space-x-3">
          <FiMail size={22} className="text-gray-600" />
          <span className="text-lg font-medium text-gray-800">{formData.email}</span>
        </div>

        {/* Phone */}
        <div>
          <label className="block text-lg font-semibold text-gray-700 mb-1">Phone</label>
          <input
            type="text"
            value={formData.phoneNumber || ""}
            onChange={(e) => handleChange("phoneNumber", e.target.value)}
            readOnly={!editing}
            className={`w-full border rounded-lg p-3 text-lg ${
              editing ? "bg-white" : "bg-gray-100 cursor-not-allowed"
            }`}
          />
        </div>

        {/* DOB */}
        <div>
          <label className="block text-lg font-semibold text-gray-700 mb-1">Date of Birth</label>
          <input
            type="date"
            value={formData.dateOfBirth || ""}
            onChange={(e) => handleChange("dateOfBirth", e.target.value)}
            readOnly={!editing}
            className={`w-full border rounded-lg p-3 text-lg ${
              editing ? "bg-white" : "bg-gray-100 cursor-not-allowed"
            }`}
          />
        </div>

        {/* Gender */}
        <div>
          <label className="block text-lg font-semibold text-gray-700 mb-1">Gender</label>
          <select
            value={formData.gender || ""}
            onChange={(e) => handleChange("gender", e.target.value)}
            disabled={!editing}
            className={`w-full border rounded-lg p-3 text-lg ${
              editing ? "bg-white" : "bg-gray-100 cursor-not-allowed"
            }`}
          >
            <option value="">Select</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>

        {/* Address */}
        <div className="space-y-2">
          <label className="block text-lg font-semibold text-gray-700 mb-1">Address</label>
          {["street", "area", "city", "state", "pincode"].map((field) => (
            <input
              key={field}
              type="text"
              placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
              value={formData.address?.[field] || ""}
              onChange={(e) => handleAddressChange(field, e.target.value)}
              readOnly={!editing}
              className={`w-full border rounded-lg p-3 text-lg ${
                editing ? "bg-white" : "bg-gray-100 cursor-not-allowed"
              }`}
            />
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col md:flex-row md:justify-between mt-6 gap-4">
          {!editing ? (
            <button
              onClick={() => setEditing(true)}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-lg font-semibold"
            >
              <FiEdit size={20} /> Update Profile
            </button>
          ) : (
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-lg font-semibold"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          )}

          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="flex items-center justify-center gap-2 px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition text-lg font-semibold"
          >
            <FiLogOut size={20} /> Sign Out
          </button>
        </div>

        {message && (
          <p className="text-center mt-3 text-md font-medium text-gray-800">{message}</p>
        )}
      </div>
    </div>
  );
}
  