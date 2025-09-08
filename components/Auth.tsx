"use client";

import { signIn, useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
// import { FiApple } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";

export default function Auth() {
  const { data: session } = useSession();
  const router = useRouter();

  // If logged in, redirect to home
  useEffect(() => {
    if (session) {
      router.push("/");
    }
  }, [session, router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 tracking-tight">
        Welcome Back
      </h1>

      {/* Sign In Buttons */}
      <div className="flex flex-col space-y-4 w-full max-w-xs">
        <button
          onClick={() => signIn("google", { callbackUrl: "/" })}
          className="flex items-center justify-center space-x-3 px-6 py-3 border border-gray-300 rounded-xl text-lg font-medium text-gray-700 hover:bg-gray-100 transition"
        >
          <FcGoogle size={24} />
          <span>Sign in with Google</span>
        </button>

        <button
          onClick={() => signIn("apple", { callbackUrl: "/" })}
          className="flex items-center justify-center space-x-3 px-6 py-3 border border-gray-300 rounded-xl text-lg font-medium text-gray-700 hover:bg-gray-100 transition"
        >
          {/* <FiApple size={24} /> */}
          <span>Sign in with Apple</span>
        </button>
      </div>

      <p className="text-sm text-gray-500 mt-6">
        By continuing, you agree to our Terms & Privacy Policy.
      </p>
    </div>
  );
}
