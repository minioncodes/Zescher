"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FiMail, FiLock, FiEye, FiEyeOff, FiLogIn, FiShield } from "react-icons/fi";

export default function SigninPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState<string | null>(null);


  const safeNext = (() => {
    const next = searchParams.get("next") || "/admin/dashboard";
    try {
     
      if (next.startsWith("/") && !next.startsWith("//")) return next;
    } catch {}
    return "/admin/dashboard";
  })();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      const res = await fetch("/api/admin/signin", {
        method: "POST",
        body: JSON.stringify({
          email: formData.get("email"),
          password: formData.get("password"),
        }),
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data?.message || data?.msg || "Invalid credentials");
        return;
      }

      // HttpOnly cookie should be set by the API.
      form.reset();
      router.replace(safeNext as any);
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white/90 backdrop-blur border rounded-2xl shadow-xl overflow-hidden">

          <div className="px-6 py-5 bg-white">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-blue-100">
                <FiShield className="text-blue-600" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Admin Sign in</h1>
                <p className="text-sm text-gray-500">Access your Zescher dashboard</p>
              </div>
            </div>
          </div>

 
          <form onSubmit={handleSubmit} className="px-6 pb-6 pt-2 space-y-4">
            {error && (
              <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                {error}
              </div>
            )}

            <div className="space-y-1.5">
              <label htmlFor="email" className="text-sm text-gray-700">
                Email
              </label>
              <div className="flex items-center gap-2 border rounded-lg px-3 py-2 bg-white focus-within:ring-2 focus-within:ring-blue-500">
                <FiMail className="text-gray-400" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="admin@zescher.com"
                  required
                  className="w-full outline-none bg-transparent"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="password" className="text-sm text-gray-700">
                Password
              </label>
              <div className="flex items-center gap-2 border rounded-lg px-3 py-2 bg-white focus-within:ring-2 focus-within:ring-blue-500">
                <FiLock className="text-gray-400" />
                <input
                  id="password"
                  name="password"
                  type={showPwd ? "text" : "password"}
                  placeholder="••••••••"
                  required
                  className="w-full outline-none bg-transparent"
                />
                <button
                  type="button"
                  aria-label={showPwd ? "Hide password" : "Show password"}
                  onClick={() => setShowPwd((s) => !s)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  {showPwd ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-lg hover:bg-blue-700 disabled:opacity-60"
            >
              <FiLogIn />
              {loading ? "Signing in..." : "Sign in"}
            </button>

            <p className="text-xs text-gray-500 text-center">
              Protected area. You’ll be redirected to{" "}
              <span className="font-medium text-gray-700">{safeNext}</span> after login.
            </p>
          </form>
        </div>

      
        <p className="text-center text-xs text-gray-500 mt-4">
          © {new Date().getFullYear()} Zescher Admin
        </p>
      </div>
    </div>
  );
}
