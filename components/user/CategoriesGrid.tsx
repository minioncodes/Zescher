import Image from "next/image";
import Link from "next/link";

type Category = {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
};

export default function CategoriesGrid({
  categories,
}: {
  categories: Category[];
}) {
  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h2 className="text-2xl font-bold mb-6">
        Shop by Category
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
        {categories.map((cat) => (
          <Link
            key={cat._id}
            href={`/category/${cat.slug}`}
            className="bg-white border rounded-xl overflow-hidden hover:shadow-lg transition block"
          >
            <div className="relative w-full h-36 bg-gray-100">
              <Image
                src={cat.image || "/placeholder.png"}
                alt={cat.name}
                fill
                className="object-cover"
              />
            </div>

            <div className="p-4 text-center">
              <h3 className="font-semibold text-gray-800">
                {cat.name}
              </h3>

              {cat.description && (
                <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                  {cat.description}
                </p>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
