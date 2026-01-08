"use client";

import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/redux-hooks";
import { fetchUser } from "@/redux/slices/user-slice/user-slice";
import { signOut } from "next-auth/react";
import {
  FiMail,
  FiLogOut,
  FiEdit,
  FiPhone,
  FiUser,
} from "react-icons/fi";

type ProfileForm = {
  name: string;
  email: string;
  phoneNumber: string;
  gender: string;
};

export default function Profile() {
  const dispatch = useAppDispatch();
  const { user, loading, err } = useAppSelector((state) => state.user);

  const [formData, setFormData] = useState<ProfileForm | null>(null);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  // Fetch user
  useEffect(() => {
    if (!user) dispatch(fetchUser());
  }, [dispatch, user]);

  // Prefill form
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phoneNumber: user.phoneNumber || "",
        gender: user.gender || "",
      });
    }
  }, [user]);

  if (loading || !formData) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] text-black/60 text-lg">
        Loading profile…
      </div>
    );
  }

  if (err) {
    return (
      <p className="text-red-600 text-center mt-8 text-lg">{err}</p>
    );
  }

  const handleChange = (field: keyof ProfileForm, value: string) => {
    setFormData((prev) =>
      prev ? { ...prev, [field]: value } : prev
    );
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage("");

    try {
      const res = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          gender: formData.gender,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Update failed");

      setMessage("Profile updated successfully");
      setEditing(false);
      dispatch(fetchUser());
    } catch (e: unknown) {
      setMessage("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-semibold mb-8">
        My Profile
      </h1>

      <div className="bg-white border border-black/10 rounded-2xl p-8 space-y-6">

        {/* NAME */}
        <div>
          <label className="text-sm font-medium flex items-center gap-2 mb-1">
            <FiUser /> Name
          </label>
          <input
            value={formData.name}
            onChange={(e) => handleChange("name", e.target.value)}
            readOnly={!editing}
            className={`w-full rounded-xl border px-4 py-2.5 text-sm outline-none ${
              editing
                ? "bg-white focus:ring-2 focus:ring-black"
                : "bg-gray-100 cursor-not-allowed"
            }`}
          />
        </div>

        {/* EMAIL (READ ONLY) */}
        <div>
          <label className="text-sm font-medium flex items-center gap-2 mb-1">
            <FiMail /> Email
          </label>
          <input
          title="Email"
            value={formData.email}
            readOnly
            className="w-full rounded-xl border px-4 py-2.5 text-sm bg-gray-100 cursor-not-allowed"
          />
        </div>

        {/* PHONE (READ ONLY) */}
        <div>
          <label className="text-sm font-medium flex items-center gap-2 mb-1">
            <FiPhone /> Phone
          </label>
          <input
          title="Phone"
            value={formData.phoneNumber}
            readOnly
            className="w-full rounded-xl border px-4 py-2.5 text-sm bg-gray-100 cursor-not-allowed"
          />
        </div>

        {/* GENDER */}
        <div>
          <label className="text-sm font-medium mb-1 block">
            Gender
          </label>
          <select
          title="Gender"
            value={formData.gender}
            onChange={(e) => handleChange("gender", e.target.value)}
            disabled={!editing}
            className={`w-full rounded-xl border px-4 py-2.5 text-sm outline-none ${
              editing
                ? "bg-white focus:ring-2 focus:ring-black"
                : "bg-gray-100 cursor-not-allowed"
            }`}
          >
            <option value="">Select</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>

        {/* ACTIONS */}
        <div className="pt-6 flex flex-col sm:flex-row gap-4 justify-between">
          {!editing ? (
            <button
              onClick={() => setEditing(true)}
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-black text-white text-sm font-medium hover:bg-black/90"
            >
              <FiEdit /> Edit Profile
            </button>
          ) : (
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-black text-white text-sm font-medium hover:bg-black/90"
            >
              {saving ? "Saving…" : "Save Changes"}
            </button>
          )}

          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl border text-sm font-medium hover:bg-gray-100"
          >
            <FiLogOut /> Sign Out
          </button>
        </div>

        {message && (
          <p className="text-center text-sm mt-2 text-black/70">
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
