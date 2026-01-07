import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-black/10 mt-24">
      <div className="max-w-[1440px] mx-auto px-6 py-16">

        {/* TOP GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 text-sm">

          {/* BRAND */}
          <div>
            <h3 className="font-semibold mb-4">ZESCHER</h3>
            <p className="text-black/70 leading-relaxed">
              Modern fashion essentials designed for everyday comfort and style.
            </p>
          </div>

          {/* SHOP */}
          <div>
            <h4 className="font-semibold mb-4">Shop</h4>
            <ul className="space-y-3 text-black/70">
              <li><Link href="#">Women</Link></li>
              <li><Link href="#">Men</Link></li>
              <li><Link href="#">Kids</Link></li>
              <li><Link href="#">Beauty</Link></li>
            </ul>
          </div>

          {/* HELP */}
          <div>
            <h4 className="font-semibold mb-4">Help</h4>
            <ul className="space-y-3 text-black/70">
              <li><Link href="#">Customer Service</Link></li>
              <li><Link href="#">Shipping & Returns</Link></li>
              <li><Link href="#">Order Tracking</Link></li>
              <li><Link href="#">FAQs</Link></li>
            </ul>
          </div>

          {/* LEGAL */}
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-3 text-black/70">
              <li><Link href="/privacy-policy">Privacy Policy</Link></li>
              <li><Link href="/terms-and-conditions">Terms & Conditions</Link></li>
            </ul>
          </div>
        </div>

        {/* BOTTOM BAR */}
        <div className="mt-16 pt-6 border-t border-black/10 flex flex-col sm:flex-row justify-between items-center text-xs text-black/60 gap-4">
          <span>© {new Date().getFullYear()} ZESCHER. All rights reserved.</span>
          <span>Designed for modern lifestyles.</span>
        </div>

      </div>
    </footer>
  );
}
