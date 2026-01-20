"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";
import { IoMdClose } from "react-icons/io";
import { useAuthModal } from "@/context/AuthModalContext";

export default function AuthForm() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const { closeAuth } = useAuthModal();
  
  
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
  
  <>
    {/* MAIN MODAL */}
    <div className="relative w-full max-w-md bg-white rounded-2xl p-6 sm:p-8 shadow-xl">
      <button
        title="Close"
        onClick={() => setShowExitConfirm(true)}
        className="absolute top-4 right-4 p-2 rounded-full hover:bg-black/10 transition"
      >
        <IoMdClose size={18} />
      </button>

      <h1 className="text-2xl font-semibold text-center">
        Continue to your account
      </h1>

      <p className="text-sm text-black/60 text-center mt-2">
        Sign in or sign up with Google or your phone number
      </p>

      <button
        onClick={() => signIn("google", { redirect: false })}
        className="mt-8 w-full flex items-center justify-center gap-3 border border-black/20 rounded-xl py-3 text-sm font-medium hover:bg-black/5 transition"
      >
        <FcGoogle size={22} />
        Continue with Google
      </button>

      <div className="flex items-center gap-4 my-8">
        <span className="h-px flex-1 bg-black/10" />
        <span className="text-xs text-black/40">OR</span>
        <span className="h-px flex-1 bg-black/10" />
      </div>

      <form onSubmit={sendOtp} className="space-y-4">
        <input
          required
          type="tel"
          placeholder="+91XXXXXXXXXX"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full rounded-xl border border-black/20 px-4 py-3"
        />

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button className="w-full bg-black text-white py-3 rounded-xl">
          {loading ? "Sending OTP..." : "Continue"}
        </button>
      </form>
    </div>

    {/* EXIT CONFIRMATION */}
    {showExitConfirm && (
      <div className="fixed inset-0 z-[1000] bg-black/50 flex items-center justify-center">
        <div className="bg-white rounded-xl p-6 w-[90%] max-w-sm text-center">
          <h2 className="text-lg font-semibold">Exit?</h2>

          <p className="text-sm text-black/60 mt-2">
            Are you sure you want to exit login?
          </p>

          <div className="flex gap-3 mt-6">
            <button
              onClick={() => setShowExitConfirm(false)}
              className="flex-1 border py-2 rounded-lg"
            >
              Stay
            </button>

            <button
              onClick={() => {
                setShowExitConfirm(false);
                closeAuth();
                router.push("/");
              }}
              className="flex-1 bg-black text-white py-2 rounded-lg"
            >
              Exit
            </button>
          </div>
        </div>
      </div>
    )}
  </>
);
}
