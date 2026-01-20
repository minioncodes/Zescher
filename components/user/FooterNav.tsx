"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import type { Session } from "next-auth";
import {
  FiHome,
  FiShoppingBag,
  FiHeart,
  FiUser,
  FiPackage,
  FiMapPin,
  FiLogOut,
} from "react-icons/fi";
import { useAuthModal } from "@/context/AuthModalContext";

type AppUser = Session["user"] & {
  phoneNumber?: string | null;
};

function getInitials(name?: string | null, phone?: string | null): string {
  if (name) {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  }
  if (phone) return phone.slice(-2);
  return "U";
}

export default function FooterNav() {
  const { data: session } = useSession();
  const user = session?.user as AppUser | undefined;
  const { openAuth } = useAuthModal();
  const [mobileProfileOpen, setMobileProfileOpen] = useState(false);

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-t border-gray-200 shadow-lg md:hidden">
      <div className="flex justify-around items-center h-14 relative">

        {/* HOME */}
        <Link
          href="/"
          className="flex flex-col items-center text-gray-600 hover:text-black"
        >
          <FiHome size={22} />
        </Link>

        {/* SHOP */}
        <Link
          href="/shop"
          className="flex flex-col items-center text-gray-600 hover:text-black"
        >
          <FiShoppingBag size={22} />
        </Link>

        {/* WISHLIST */}
        <Link
          href="/wishlist"
          className="flex flex-col items-center text-gray-600 hover:text-black"
        >
          <FiHeart size={22} />
        </Link>

        {/* USER */}
        <div className="relative">
          {user ? (
            <button
              onClick={() => setMobileProfileOpen((v) => !v)}
              className="h-9 w-9 rounded-full overflow-hidden flex items-center justify-center"
            >
              {user.image ? (
                <Image
                  src={user.image}
                  alt="User avatar"
                  width={36}
                  height={36}
                  className="rounded-full object-cover"
                />
              ) : (
                <div className="h-8 w-8 rounded-full bg-black text-white flex items-center justify-center text-sm font-semibold">
                  {getInitials(user.name, user.phoneNumber)}
                </div>
              )}
            </button>
          ) : (
<button
  title="Auth"
  onClick={() => openAuth()}
  className="flex flex-col items-center text-gray-600 hover:text-black"
>
  <FiUser size={22} />
</button>

          )}

          {/* USER DROPDOWN */}
          {user && mobileProfileOpen && (
            <div className="absolute bottom-14 right-0 w-48 bg-white border border-black/10 rounded-xl shadow-lg overflow-hidden">
              <Link
                href="/profile"
                onClick={() => setMobileProfileOpen(false)}
                className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-black/5"
              >
                <FiUser /> Profile
              </Link>

              <Link
                href="/orders"
                onClick={() => setMobileProfileOpen(false)}
                className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-black/5"
              >
                <FiPackage /> Orders
              </Link>

              <Link
                href="/addresses"
                onClick={() => setMobileProfileOpen(false)}
                className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-black/5"
              >
                <FiMapPin /> Addresses
              </Link>

              <div className="border-t" />

              <button
                onClick={() => {
                  setMobileProfileOpen(false);
                  signOut({ callbackUrl: "/" });
                }}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm hover:bg-black/5 text-left"
              >
                <FiLogOut /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
