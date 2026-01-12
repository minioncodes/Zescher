"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";
import { IoMdClose } from "react-icons/io";

export default function AuthForm() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showExitConfirm, setShowExitConfirm] = useState(false);

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
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center px-4 z-50">
      {/* Modal */}
      <div className="relative w-full max-w-md bg-white rounded-2xl p-6 sm:p-8 shadow-xl">

        {/* Close Button */}
        <button
        title="Close"
          onClick={() => setShowExitConfirm(true)}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-black/10 transition"
        >
          <IoMdClose size={18} />
        </button>

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
            className="w-full bg-black text-white py-3 rounded-xl text-sm font-medium hover:bg-black/90 transition disabled:opacity-50"
          >
            {loading ? "Sending OTP..." : "Continue with phone"}
          </button>
        </form>

        {/* FOOTER */}
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

      {/* EXIT CONFIRMATION */}
      {showExitConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-[90%] max-w-sm text-center">
            <h2 className="text-lg font-semibold">Exit?</h2>
            <p className="text-sm text-black/60 mt-2">
              Are you sure you want to exit login?
            </p>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowExitConfirm(false)}
                className="flex-1 border border-black/20 py-2 rounded-lg text-sm"
              >
                Stay
              </button>
              <button
                onClick={() => router.push("/")}
                className="flex-1 bg-black text-white py-2 rounded-lg text-sm"
              >
                Exit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
