"use client";

import Link from "next/link";
import { FiHome, FiShoppingBag, FiHeart, FiUser, FiShoppingCart } from "react-icons/fi";

const FooterNav = () => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-t border-gray-200 shadow-lg md:hidden">
      <div className="flex justify-around items-center h-14">
        <Link href="#" className="flex flex-col items-center text-gray-600 hover:text-indigo-600 transition-colors">
          <FiHome size={22} />
        </Link>
        <Link href="#" className="flex flex-col items-center text-gray-600 hover:text-indigo-600 transition-colors">
          <FiShoppingBag size={22} />
        </Link>
        <Link href="#" className="flex flex-col items-center text-gray-600 hover:text-indigo-600 relative transition-colors">
          <FiShoppingCart size={22} />
          <span className="absolute -top-1 -right-2 bg-indigo-600 text-white text-[10px] rounded-full h-4 w-4 flex items-center justify-center">
            2
          </span>
        </Link>
        <Link href="#" className="flex flex-col items-center text-gray-600 hover:text-indigo-600 transition-colors">
          <FiHeart size={22} />
        </Link>
        <Link href="#" className="flex flex-col items-center text-gray-600 hover:text-indigo-600 transition-colors">
          <FiUser size={22} />
        </Link>
      </div>
    </nav>
  );
};

export default FooterNav;
