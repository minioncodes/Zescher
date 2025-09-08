"use client";

import { useState } from "react";

export default function SigninPage() {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      const res = await fetch("/api/admin/signin", {
        method: "POST",
        body: JSON.stringify({
          email: formData.get("email"),
          password: formData.get("password"),
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();
      if (!res.ok) {
        alert("❌ " + data.message);
        return;
      }
      alert("✅ Login successful: " + data.admin.name);
      // token is set in cookie automatically
      form.reset();
    } catch (err) {
      console.error(err);
      alert("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Admin Signin</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          name="email"
          placeholder="Email"
          required
          className="border p-2 w-full"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          required
          className="border p-2 w-full"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          {loading ? "Signing in..." : "Signin"}
        </button>
      </form>
    </div>
  );
}
