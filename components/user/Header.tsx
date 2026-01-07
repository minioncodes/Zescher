"use client";

import { useState } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import {
  FiShoppingCart,
  FiMenu,
  FiX,
  FiSearch,
  FiUser,
} from "react-icons/fi";

const NAV_ITEMS = ["KIDS", "TEENS", "ADULT"];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const { data: session } = useSession();

  const cartCount = useSelector((state: RootState) =>
    state.cart.items.reduce((sum, i) => sum + i.quantity, 0)
  );

  return (
    <header className="sticky top-0 z-[999] bg-white border-b border-black/10">
      <div className="max-w-[1440px] mx-auto px-4">
        <div className="h-16 flex items-center gap-6">

          {/* LOGO */}
          <Link href="/" className="text-xl font-black tracking-tight">
            ZESCHER
          </Link>

          {/* NAV LINKS – LEFT (DESKTOP + TABLET) */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-semibold tracking-wide">
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

          {/* RIGHT SIDE */}
          <div className="ml-auto flex items-center gap-3">

            {/* MOBILE SEARCH (PHONE ONLY) */}
            <div className="flex items-center md:hidden">
              {mobileSearchOpen && (
                <input
                  autoFocus
                  placeholder="Search products"
                  className="w-40 border-b border-black text-sm outline-none mr-2"
                />
              )}

              <button
                onClick={() => setMobileSearchOpen((v) => !v)}
                className="p-2 rounded-full hover:bg-black/5"
              >
                {mobileSearchOpen ? <FiX size={20} /> : <FiSearch size={20} />}
              </button>
            </div>

            {/* DESKTOP + TABLET SEARCH (ALWAYS OPEN) */}
            <div className="hidden md:flex items-center gap-2 px-4 py-2 border border-black/20 rounded-full">
              <FiSearch size={16} />
              <input
                placeholder="Search products"
                className="w-64 bg-transparent outline-none text-sm"
              />
            </div>

            {/* USER ICON (DESKTOP + TABLET) */}
            {session ? (
              <button
              title="Signout"
                onClick={() => signOut({ callbackUrl: "/" })}
                className="hidden md:flex p-2 rounded-full hover:bg-black/5"
              >
                <FiUser size={20} />
              </button>
            ) : (
              <Link
                href="/signin"
                className="hidden md:flex p-2 rounded-full hover:bg-black/5"
              >
                <FiUser size={20} />
              </Link>
            )}

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

            {/* MOBILE MENU */}
            <button
            title="Menu"
              onClick={() => setMobileOpen(true)}
              className="md:hidden p-2 rounded-full hover:bg-black/5"
            >
              <FiMenu size={22} />
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE DRAWER */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[900] bg-white flex flex-col">
          <div className="flex items-center justify-between px-6 h-16 border-b">
            <span className="text-lg font-black">ZESCHER</span>
            <button title="Menu" onClick={() => setMobileOpen(false)}>
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

            {/* AUTH – FIXED (NOW VISIBLE ON PHONE) */}
            <div className="pt-8 border-t space-y-4 text-lg">
              {session ? (
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="block w-full text-left"
                >
                  Sign Out
                </button>
              ) : (
                <>
                  <Link href="/signin" className="block">
                    Sign In
                  </Link>
                  <Link href="/signin" className="block">
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
