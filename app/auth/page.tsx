"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";

export default function PhoneAuthPage() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function sendOtp(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/auth/send-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "Failed to send OTP");
      setLoading(false);
      return;
    }

    router.push(`/auth/verify?phone=${phone}`);
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6">
      <div className="w-full max-w-sm bg-white border border-black/10 rounded-2xl p-8">

        {/* HEADING */}
        <h1 className="text-2xl font-semibold text-center">
          Continue to your account
        </h1>
        <p className="text-sm text-black/60 text-center mt-2">
          Sign in or sign up with Google or your phone number
        </p>

        {/* GOOGLE LOGIN */}
        <button
          onClick={() => signIn("google", { callbackUrl: "/" })}
          className="mt-8 w-full flex items-center justify-center gap-3 border border-black/20 rounded-xl py-3 text-sm font-medium hover:bg-black/5 transition"
        >
          <FcGoogle size={22} />
          Continue with Google
        </button>

        {/* DIVIDER */}
        <div className="flex items-center gap-4 my-8">
          <span className="h-px flex-1 bg-black/10" />
          <span className="text-xs text-black/40">OR</span>
          <span className="h-px flex-1 bg-black/10" />
        </div>

        {/* PHONE OTP */}
        <form onSubmit={sendOtp} className="space-y-4">
          <div>
            <label className="text-xs font-medium">Phone number</label>
            <input
              required
              type="tel"
              placeholder="+91XXXXXXXXXX"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="mt-1 w-full rounded-xl border border-black/20 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            disabled={loading}
            className="w-full bg-black text-white py-3 rounded-xl text-sm font-medium hover:bg-black/90 transition"
          >
            {loading ? "Sending OTP..." : "Continue with phone"}
          </button>
        </form>

        {/* FOOTER NOTE */}
        <p className="text-xs text-black/50 text-center mt-6">
          By continuing, you agree to our{" "}
          <a href="/terms-and-conditions" className="underline">
            Terms
          </a>{" "}
          and{" "}
          <a href="/privacy-policy" className="underline">
            Privacy Policy
          </a>
          .
        </p>
      </div>
    </div>
  );
}
