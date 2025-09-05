"use client";

import { useState } from "react";
import Link from "next/link";
import { FiShoppingCart, FiMenu, FiX, FiSearch } from "react-icons/fi";

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [cartCount] = useState(2);

  return (
    <header className="sticky top-0 z-50 backdrop-blur-lg bg-white/70 border-b border-gray-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="#" className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-600 to-fuchsia-500 bg-clip-text text-transparent">
            Zescher
          </Link>

          <nav className="hidden md:flex space-x-8 text-gray-700 font-medium">
            <Link href="#" className="hover:text-indigo-600 transition-colors">Shop</Link>
    
            <Link href="#" className="hover:text-indigo-600 transition-colors">Contact</Link>
          </nav>

          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex items-center bg-gray-100 px-3 py-1 rounded-full transition focus-within:ring-2 focus-within:ring-indigo-500">
              <FiSearch size={18} className="text-gray-500" />
              <input
                type="text"
                placeholder="Search..."
                className="bg-transparent border-none focus:ring-0 text-sm ml-2 outline-none"
              />
            </div>

            <Link href="#" className="relative hover:scale-105 transition-transform">
              <FiShoppingCart size={24} className="text-gray-700" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-gradient-to-r from-indigo-600 to-fuchsia-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center shadow-md">
                  {cartCount}
                </span>
              )}
            </Link>

            <button
              className="md:hidden p-2 rounded-md text-gray-700 hover:bg-gray-100"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-white/90 backdrop-blur-md shadow-lg border-t border-gray-200 animate-fade-in">
          <nav className="flex flex-col space-y-2 px-4 py-3 text-gray-700 font-medium">
          
            <Link href="#" onClick={() => setMobileOpen(false)} className="hover:text-indigo-600 transition-colors">Shop</Link>
        
            <Link href="#" onClick={() => setMobileOpen(false)} className="hover:text-indigo-600 transition-colors">Contact</Link>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
