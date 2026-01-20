"use client";

import { useAuthModal } from "@/context/AuthModalContext";
import { signIn } from "next-auth/react";

export default function AuthModal() {
  const { isOpen, closeAuthModal } = useAuthModal();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={closeAuthModal}
      />

      {/* Modal */}
      <div className="relative bg-white w-full max-w-md rounded-xl p-6 z-10">
        <h2 className="text-xl font-semibold mb-4">Login / Signup</h2>

        <button
          onClick={() => signIn("google")}
          className="w-full bg-black text-white py-3 rounded mb-3"
        >
          Continue with Google
        </button>

        <button
          onClick={closeAuthModal}
          className="w-full border py-3 rounded"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
