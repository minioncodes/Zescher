"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export function useBuyNow() {
  const { status } = useSession();
  const router = useRouter();

  function buyNow(productId: string) {
    if (status !== "authenticated") {
      // Save redirect target
      sessionStorage.setItem("postAuthRedirect", "/checkout");
      sessionStorage.setItem("buyNowProduct", productId);

      // Open auth modal
      router.push("/auth?modal=true");
      return;
    }

    // Already logged in → go checkout
    router.push("/checkout");
  }

  return { buyNow };
}
