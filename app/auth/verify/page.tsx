"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";

export default function VerifyOtpPage() {
  const params = useSearchParams();
  const phone = params.get("phone") || "";
  const router = useRouter();

  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function verifyOtp(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/auth/verify-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone, otp }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "Invalid OTP");
      setLoading(false);
      return;
    }

    // auto-login with NextAuth
    await signIn("phone", {
      phone,
      redirect: false,
    });

    router.push("/");
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6">
      <div className="w-full max-w-sm bg-white border rounded-2xl p-8">

        <h1 className="text-2xl font-semibold text-center">
          Verify OTP
        </h1>
        <p className="text-sm text-black/60 text-center mt-2">
          Sent to {phone}
        </p>

        <form onSubmit={verifyOtp} className="mt-8 space-y-4">
          <input
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            maxLength={6}
            placeholder="••••••"
            className="w-full rounded-xl border px-4 py-3 text-center text-lg tracking-widest outline-none focus:ring-2 focus:ring-black"
          />

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            disabled={loading}
            className="w-full bg-black text-white py-3 rounded-xl text-sm font-medium"
          >
            Verify & Continue
          </button>
        </form>
      </div>
    </div>
  );
}
