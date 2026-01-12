import Hero from "@/components/user/Hero";
import CategoriesGrid from "@/components/user/CategoriesGrid";
import FooterNav from "@/components/user/FooterNav";

import { getActiveCategories } from "@/lib/category";

export default async function HomePage() {
  const categories = await getActiveCategories();

  return (
    <>
      <Hero />
      <CategoriesGrid categories={categories} />
      
      <FooterNav />
    </>
  );
}
