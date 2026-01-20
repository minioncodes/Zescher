"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useAuthModal } from "@/context/AuthModalContext";

export const useBuyNow = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { openAuthModal } = useAuthModal();

const buyNow = (product: any) => {
  localStorage.setItem("buy_now_product", JSON.stringify(product));

  if (status !== "authenticated") {
    openAuthModal(() => router.push("/checkout"));
    return;
  }

  router.push("/checkout");
};


  return { buyNow };
};
