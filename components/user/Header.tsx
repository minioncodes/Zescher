"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import type { Session } from "next-auth";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import {
  FiShoppingCart,
  FiMenu,
  FiX,
  FiSearch,
  FiUser,
  FiLogOut,
  FiPackage,
  FiMapPin,
} from "react-icons/fi";

const NAV_ITEMS = ["KIDS", "TEENS", "ADULT"];

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

export default function Header() {
  const { data: session } = useSession();
  const user = session?.user as AppUser | undefined;
const [mobileProfileOpen, setMobileProfileOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const profileRef = useRef<HTMLDivElement>(null);

  const cartCount = useSelector((state: RootState) =>
    state.cart.items.reduce((sum, i) => sum + i.quantity, 0)
  );

  // Close profile dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        profileRef.current &&
        !profileRef.current.contains(e.target as Node)
      ) {
        setProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <header className="sticky top-0 z-[999] bg-white border-b border-black/10">
      <div className="max-w-[1440px] mx-auto px-4">
        <div className="h-16 flex items-center gap-4">

          {/* MOBILE: BURGER (LEFT) */}
          <button
            onClick={() => setMobileOpen(true)}
            className="md:hidden p-2 rounded-full hover:bg-black/5"
          >
            <FiMenu size={22} />
          </button>

          {/* LOGO */}
          <Link href="/" className="text-xl font-black tracking-tight">
            ZESCHER
          </Link>

          {/* DESKTOP NAV */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-semibold ml-6">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item}
                href="#"
                className="relative after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-0 after:bg-black hover:after:w-full after:transition-all"
              >
                {item}
              </Link>
            ))}
          </nav>

          {/* RIGHT */}
          <div className="ml-auto flex items-center gap-3">

            {/* MOBILE SEARCH */}
            <div className="flex items-center md:hidden">
              {mobileSearchOpen && (
                <input
                  autoFocus
                  placeholder="Search"
                  className="w-36 border-b border-black text-sm outline-none mr-2"
                />
              )}
              <button
                onClick={() => setMobileSearchOpen((v) => !v)}
                className="p-2 rounded-full hover:bg-black/5"
              >
                {mobileSearchOpen ? <FiX size={20} /> : <FiSearch size={20} />}
              </button>
            </div>

            {/* DESKTOP SEARCH */}
            <div className="hidden md:flex items-center gap-2 px-4 py-2 border border-black/20 rounded-full">
              <FiSearch size={16} />
              <input
                placeholder="Search products"
                className="w-64 bg-transparent outline-none text-sm"
              />
            </div>

            {/* DESKTOP PROFILE */}
            {user ? (
              <div className="relative hidden md:flex" ref={profileRef}>
                <button
                  onClick={() => setProfileOpen((v) => !v)}
                  className="h-9 w-9 rounded-full overflow-hidden border border-black/20 flex items-center justify-center bg-black text-white text-sm font-semibold"
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
                    getInitials(user.name, user.phoneNumber)
                  )}
                </button>

                {profileOpen && (
                  <div className="absolute right-0 top-12 w-56 bg-white border border-black/10 rounded-xl shadow-lg overflow-hidden">
                    <Link
                      href="/profile"
                      className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-black/5"
                    >
                      <FiUser /> Profile
                    </Link>
                    <Link
                      href="/orders"
                      className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-black/5"
                    >
                      <FiPackage /> Orders
                    </Link>
                    <Link
                      href="/addresses"
                      className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-black/5"
                    >
                      <FiMapPin /> Addresses
                    </Link>
                    <div className="border-t" />
                    <button
                      onClick={() => signOut({ callbackUrl: "/" })}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm hover:bg-black/5 text-left"
                    >
                      <FiLogOut /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/auth"
                className="hidden md:flex p-2 rounded-full hover:bg-black/5"
              >
                <FiUser size={20} />
              </Link>
            )}

{/* MOBILE PROFILE ICON (RIGHT) */}
<div className="md:hidden relative">
  {user ? (
    <button
      onClick={() => setMobileProfileOpen((v) => !v)}
      className="p-1 rounded-full"
    >
      {user.image ? (
        <Image
          src={user.image}
          alt="User avatar"
          width={32}
          height={32}
          className="rounded-full object-cover"
        />
      ) : (
        <div className="h-8 w-8 rounded-full bg-black text-white flex items-center justify-center text-sm font-semibold">
          {getInitials(user.name, user.phoneNumber)}
        </div>
      )}
    </button>
  ) : (
    <Link href="/auth" className="p-2 rounded-full hover:bg-black/5">
      <FiUser size={20} />
    </Link>
  )}

  {/* MOBILE PROFILE DROPDOWN */}
  {user && mobileProfileOpen && (
    <div className="absolute right-0 top-12 w-48 bg-white border border-black/10 rounded-xl shadow-lg overflow-hidden z-[1000]">
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


            {/* CART */}
            <Link
              href="/cart"
              className="relative p-2 rounded-full hover:bg-black/5"
            >
              <FiShoppingCart size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-black text-white text-[10px] flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>

      {/* MOBILE DRAWER */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[900] bg-white flex flex-col">
          <div className="flex items-center justify-between px-6 h-16 border-b">
            <span className="text-lg font-black">ZESCHER</span>
            <button onClick={() => setMobileOpen(false)}>
              <FiX size={24} />
            </button>
          </div>
          <div className="flex-1 px-6 pt-8 space-y-6">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item}
                href="#"
                onClick={() => setMobileOpen(false)}
                className="block text-2xl font-semibold"
              >
                {item}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
