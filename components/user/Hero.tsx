"use client";

import Image from "next/image";
import Link from "next/link";

const Hero = () => {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center py-20">
          <div className="w-full lg:w-3/5">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight">
              Discover the Latest in Fashion
            </h1>
            <p className="mt-6 text-lg text-gray-600 max-w-xl">
              Shop the trendiest collections and get exclusive offers only at
              Zescher. Elevate your style with ease.
            </p>
            <div className="mt-8 flex space-x-4">
              <Link
                href="#"
                className="px-6 py-3 rounded-xl bg-gray-900 text-white font-semibold shadow hover:bg-gray-800 transition"
              >
                Shop Now
              </Link>
              <Link
                href="#"
                className="px-6 py-3 rounded-xl border border-gray-300 text-gray-700 font-semibold hover:bg-gray-100 transition"
              >
                Learn More
              </Link>
            </div>
          </div>

          <div className="w-full lg:w-2/5 mt-10 lg:mt-0 lg:pl-12">
            <div className="relative w-full h-80 lg:h-[500px]">
              <Image
                src="https://unsplash.com/photos/a-shopping-cart-next-to-a-sign-that-says-online-is-better-ByoLORRlUdk"
                alt="Fashion banner"
                fill
                className="object-cover rounded-2xl shadow-xl"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
