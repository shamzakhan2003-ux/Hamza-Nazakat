import Header from "../components/Header";
import { prisma } from "../lib/prisma";
import Link from "next/link";

type ProductsPageProps = {
  searchParams: Promise<{
    search?: string;
    category?: string;
    deals?: string;
    new?: string;
  }>;
};

export default async function ProductsPage({
  searchParams,
}: ProductsPageProps) {
  const params = await searchParams;

  const search = (params.search || "").trim();
  const category = (params.category || "").trim();
  const deals = params.deals === "true";
  const newArrivals = params.new === "true";

  const products = await prisma.product.findMany({
    where: {
      ...(search
        ? {
            OR: [
              {
                name: {
                  contains: search,
                  mode: "insensitive",
                },
              },
              {
                description: {
                  contains: search,
                  mode: "insensitive",
                },
              },
            ],
          }
        : {}),

      ...(category
        ? {
            category: {
              equals: category,
              mode: "insensitive",
            },
          }
        : {}),

      ...(deals
        ? {
            flashDeal: true,
          }
        : {}),

      ...(newArrivals
        ? {
            createdAt: {
              gte: new Date(
                Date.now() - 30 * 24 * 60 * 60 * 1000
              ),
            },
          }
        : {}),
    },

    orderBy: {
      createdAt: "desc",
    },
  });

  let pageTitle = "All Products";

  if (category) {
    pageTitle = category;
  } else if (deals) {
    pageTitle = "Flash Deals";
  } else if (newArrivals) {
    pageTitle = "New Arrivals";
  } else if (search) {
    pageTitle = `Search Results for "${search}"`;
  }

  return (
    <main className="min-h-screen bg-gray-100 text-gray-900">
      <Header />

      {/* Page Header */}
      <section className="border-b bg-white">
        <div className="mx-auto max-w-7xl px-4 py-8">
          <p className="text-sm font-semibold uppercase tracking-wider text-orange-500">
            AM Whole Sale UK
          </p>

          <h1 className="mt-2 text-3xl font-bold">
            {pageTitle}
          </h1>

          <p className="mt-2 text-gray-500">
            {search
              ? `Products matching keyword "${search}".`
              : category
              ? `Browse products in ${category}.`
              : deals
              ? "Limited-time offers and special deals."
              : newArrivals
              ? "Our latest products."
              : "Browse our complete collection of products."}
          </p>
        </div>
      </section>

      {/* Products */}
      <section className="mx-auto max-w-7xl px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold">
            {products.length}{" "}
            {products.length === 1
              ? "Product"
              : "Products"}
          </h2>

          <button
            type="button"
            className="rounded-md border bg-white px-4 py-2 text-sm"
          >
            Sort by: Latest
          </button>
        </div>

        {products.length === 0 ? (
          <div className="rounded-lg bg-white py-20 text-center">
            <p className="text-2xl font-bold text-gray-700">
              No Products Found
            </p>

            <p className="mt-2 text-gray-500">
              {category
                ? `There are currently no products in ${category}.`
                : search
                ? `No products matched "${search}".`
                : deals
                ? "There are currently no flash deals."
                : newArrivals
                ? "There are currently no new arrivals."
                : "No products are available."}
            </p>

            <Link
              href="/products"
              className="mt-6 inline-block rounded-md bg-orange-500 px-6 py-3 font-bold text-white hover:bg-orange-600"
            >
              View All Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {products.map((product) => (
              <Link
                key={product.id}
                href={`/products/${product.id}`}
                className="group overflow-hidden rounded-lg border bg-white transition hover:-translate-y-1 hover:shadow-lg"
              >
                {/* Product Image */}
                <div className="relative flex h-64 items-center justify-center bg-gray-100">
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="text-gray-400">
                      Product Image
                    </span>
                  )}

                  {product.discount ? (
                    <span className="absolute left-2 top-2 rounded bg-red-500 px-2 py-1 text-xs font-bold text-white">
                      {product.discount}% OFF
                    </span>
                  ) : null}
                </div>

                {/* Product Details */}
                <div className="p-4">
                  <h3 className="line-clamp-2 min-h-[48px] text-sm font-semibold">
                    {product.name}
                  </h3>

                  <div className="mt-3">
                    <span className="text-xl font-bold text-red-600">
                      £{product.price.toString()}
                    </span>

                    {product.oldPrice ? (
                      <span className="ml-2 text-sm text-gray-400 line-through">
                        £{product.oldPrice.toString()}
                      </span>
                    ) : null}
                  </div>

                  <div className="mt-2 text-sm text-yellow-500">
                    ★★★★★
                    <span className="ml-1 text-gray-400">
                      ({product.reviews})
                    </span>
                  </div>

                  <div className="mt-4 w-full rounded-md bg-orange-500 py-2.5 text-center text-sm font-bold text-white transition group-hover:bg-orange-600">
                    View Product
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="mt-8 bg-gray-900 text-white">
        <div className="mx-auto max-w-7xl px-4 py-10 text-center">
          <p className="text-sm text-gray-400">
            © 2026 AM Whole Sale UK. All rights reserved.
          </p>
        </div>
      </footer>
    </main>
  );
}