"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import AuthForm from "@/components/user/Authform";

export default function AuthPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useSearchParams();

  const isModal = params.get("modal") === "true";

  // ✅ THIS IS WHERE YOUR EFFECT GOES
  useEffect(() => {
    if (status === "authenticated") {
      const redirect = sessionStorage.getItem("postAuthRedirect");

      if (redirect) {
        sessionStorage.removeItem("postAuthRedirect");
        router.push(redirect);
      } else {
        router.push("/");
      }
    }
  }, [status, router]);

  // Optional loading state
  if (status === "loading") {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        Loading…
      </div>
    );
  }

  // Modal auth (Buy Now flow)
  if (isModal) {
    return (
      <div className="fixed inset-0 z-[999] bg-black/40 flex items-center justify-center">
        <div className="bg-white w-full max-w-md rounded-xl p-6">
          <AuthForm />
        </div>
      </div>
    );
  }

  // Normal auth page
  return <AuthForm />;
}
