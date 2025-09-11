"use client";

import FooterNav from "@/components/user/FooterNav";
import Header from "@/components/user/Header";
import Hero from "@/components/user/Hero";
import Products from "@/components/user/Products";
import { IProduct } from "@/models/admin/ProductSchema";
import { useEffect, useState } from "react";
import { getProducts } from "./actions/userActions/user-products";

export default function Home() {
  const [products, setProducts] = useState<IProduct[]>([]);

  useEffect(() => {
    async function fetchData() {
      const res = await getProducts();
      setProducts(res);
    }
    fetchData();
  }, []);

  return (
    <>
      <Header />
      <Hero />
      <Products products={products} />
      <FooterNav />
    </>
  );
}
