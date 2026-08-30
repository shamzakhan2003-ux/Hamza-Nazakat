import Header from "../components/Header";
import { prisma } from "../lib/prisma";
import Link from "next/link";

export default async function CategoriesPage() {
  const categories = await prisma.product.findMany({
    where: {
      category: {
        not: "",
      },
    },
    select: {
      category: true,
    },
    distinct: ["category"],
    orderBy: {
      category: "asc",
    },
  });

  const categoryList = categories.map((item) => item.category);

  function getCategoryIcon(category: string) {
    const name = category.toLowerCase();

    if (name.includes("toy")) return "🧸";
    if (name.includes("mobile")) return "📱";
    if (name.includes("phone")) return "📱";
    if (name.includes("electronic")) return "💻";
    if (name.includes("audio")) return "🔊";
    if (name.includes("speaker")) return "🔊";
    if (name.includes("home")) return "🏠";
    if (name.includes("beauty")) return "💄";
    if (name.includes("fashion")) return "👕";
    if (name.includes("sport")) return "⚽";
    if (name.includes("computer")) return "💻";
    if (name.includes("accessor")) return "🛍️";

    return "🛍️";
  }

  return (
    <main className="min-h-screen bg-gray-100 text-gray-900">
      <Header />

      {/* PAGE HEADER */}
      <section className="border-b bg-white">
        <div className="mx-auto max-w-7xl px-4 py-10">
          <p className="text-sm font-semibold uppercase tracking-wider text-orange-500">
            AM Whole Sale Pakistan
          </p>

          <h1 className="mt-2 text-3xl font-bold md:text-4xl">
            Categories
          </h1>

          <p className="mt-2 text-gray-500">
            Browse our products by category.
          </p>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="mx-auto max-w-7xl px-4 py-10">
        {categoryList.length === 0 ? (
          <div className="rounded-lg bg-white py-20 text-center">
            <div className="text-5xl">🛍️</div>

            <h2 className="mt-4 text-2xl font-bold">
              No Categories Found
            </h2>

            <p className="mt-2 text-gray-500">
              There are currently no product categories available.
            </p>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <h2 className="text-2xl font-bold">
                Shop by Category
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                {categoryList.length}{" "}
                {categoryList.length === 1
                  ? "category"
                  : "categories"}{" "}
                available
              </p>
            </div>

            <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
              {categoryList.map((category) => (
                <Link
                  key={category}
                  href={`/products?category=${encodeURIComponent(
                    category
                  )}`}
                  className="group rounded-lg border bg-white p-6 text-center transition hover:-translate-y-1 hover:border-orange-500 hover:shadow-lg"
                >
                  <div className="text-5xl">
                    {getCategoryIcon(category)}
                  </div>

                  <h3 className="mt-4 text-sm font-bold group-hover:text-orange-500">
                    {category}
                  </h3>

                  <p className="mt-2 text-xs text-gray-400">
                    View Products →
                  </p>
                </Link>
              ))}
            </div>
          </>
        )}
      </section>

      {/* FOOTER */}
      <footer className="mt-10 bg-gray-900 text-white">
        <div className="mx-auto max-w-7xl px-4 py-10 text-center">
          <p className="text-sm text-gray-400">
            © 2026 AM Whole Sale Pakistan. All rights reserved.
          </p>
        </div>
      </footer>
    </main>
  );
}