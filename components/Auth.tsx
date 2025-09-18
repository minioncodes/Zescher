"use client";

import { signIn, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Signin from "@/app/user/signin/page";
import { FcGoogle } from "react-icons/fc";

export default function Auth() {
  const { data: session } = useSession();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("")
  useEffect(() => {
    if (session) {
      router.push("/");
    }
  }, [session, router]);
  const [errorMsg, setErrorMsg] = useState("");

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg("");

    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (res?.error) {
      setErrorMsg("Invalid email or password");
      return;
    }

    router.push("/");
  };


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
      <form onSubmit={onSubmit} className="flex flex-col space-y-4 border-black mt-10 bg-yellow-600 text-black">
        <div><input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" /></div>
        <div><input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Password" /></div>
        <div><button type="submit" className="bg-black text-white top-80">Sign in</button></div>
        {errorMsg && <div>{errorMsg}</div>}
      </form>

      <p className="text-sm text-gray-500 mt-6">
        By continuing, you agree to our Terms & Privacy Policy.
      </p>
    </div>
  );
}
