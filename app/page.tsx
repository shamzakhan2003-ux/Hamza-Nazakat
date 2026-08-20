import Header from "./components/Header";
import { prisma } from "./lib/prisma";
import Link from "next/link";

const categories = [
  "Electronics",
  "Home & Kitchen",
  "Toys",
  "Beauty",
  "Fashion",
  "Sports",
];

export default async function Home() {
  const products = await prisma.product.findMany({
    orderBy: {
      createdAt: "desc",
    },
    take: 8,
  });

  return (
    <main className="min-h-screen bg-gray-100 text-gray-900">
      <Header />

      {/* Hero Banner */}
      <section className="mx-auto max-w-7xl px-4 py-5">
        <div className="grid overflow-hidden rounded-lg bg-orange-500 md:grid-cols-2">
          <div className="flex flex-col justify-center px-8 py-14 text-white md:px-14">
            <p className="mb-3 text-sm font-semibold uppercase tracking-widest">
              AM Whole Sale UK
            </p>

            <h1 className="text-4xl font-extrabold leading-tight md:text-5xl">
              Great Products.
              <br />
              Great Prices.
            </h1>

            <p className="mt-5 max-w-md text-lg text-orange-50">
              Discover amazing products at competitive prices.
              Shop electronics, toys, home essentials and more.
            </p>

            <Link
              href="/products"
              className="mt-7 w-fit rounded-md bg-white px-7 py-3 font-bold text-gray-900 hover:bg-gray-100"
            >
              Shop Now
            </Link>
          </div>

          <div className="flex min-h-[320px] items-center justify-center bg-gray-200">
            <span className="text-gray-500">
              Promotional Image
            </span>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-7xl px-4 py-5">
        <div className="rounded-lg bg-white p-6">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">
                Shop by Category
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Find the products you need.
              </p>
            </div>

            <Link
              href="/products"
              className="text-sm font-semibold text-orange-500 hover:text-orange-600"
            >
              View All
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-6">
            {categories.map((category) => (
              <Link
                key={category}
                href="/products"
                className="rounded-lg border p-5 text-center transition hover:-translate-y-1 hover:border-orange-500 hover:shadow-md"
              >
                <div className="mb-3 text-4xl">
                  🛍️
                </div>

                <h3 className="text-sm font-semibold">
                  {category}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Flash Deals */}
      <section className="mx-auto max-w-7xl px-4 py-5">
        <div className="rounded-lg bg-white">
          <div className="flex items-center justify-between border-b px-6 py-5">
            <div>
              <h2 className="text-2xl font-bold">
                🔥 Flash Deals
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Limited-time offers
              </p>
            </div>

            <Link
              href="/products"
              className="text-sm font-semibold text-orange-500 hover:text-orange-600"
            >
              View All
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-5 p-6 sm:grid-cols-2 md:grid-cols-4">
            {products.length === 0 ? (
              <p className="col-span-full py-10 text-center text-gray-500">
                No products available.
              </p>
            ) : (
              products.map((product) => (
                <Link
                  key={product.id}
                  href={`/products/${product.id}`}
                  className="group overflow-hidden rounded-lg border bg-white transition hover:-translate-y-1 hover:shadow-lg"
                >
                  {/* Product Image */}
                  <div className="relative flex h-60 items-center justify-center bg-gray-100">
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
              ))
            )}
          </div>
        </div>
      </section>

      {/* Why Shop With Us */}
      <section className="mx-auto max-w-7xl px-4 py-5">
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
          {[
            ["🚚", "Fast UK Delivery"],
            ["🔒", "Secure Shopping"],
            ["💷", "Great Prices"],
            ["💬", "Customer Support"],
          ].map(([icon, title]) => (
            <div
              key={title}
              className="rounded-lg bg-white p-6 text-center"
            >
              <div className="text-3xl">
                {icon}
              </div>

              <h3 className="mt-3 font-bold">
                {title}
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                Shop with confidence
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-8 bg-gray-900 text-white">
        <div className="mx-auto max-w-7xl px-4 py-12">
          <div className="grid gap-8 md:grid-cols-4">

            <div>
              <h2 className="text-xl font-bold">
                AM Whole Sale UK
              </h2>

              <p className="mt-3 text-sm text-gray-400">
                Quality products at competitive prices.
              </p>
            </div>

            <div>
              <h3 className="font-bold">
                Customer Service
              </h3>

              <p className="mt-3 text-sm text-gray-400">
                Contact Us
              </p>

              <p className="mt-2 text-sm text-gray-400">
                Shipping Information
              </p>

              <p className="mt-2 text-sm text-gray-400">
                Returns & Refunds
              </p>
            </div>

            <div>
              <h3 className="font-bold">
                About
              </h3>

              <p className="mt-3 text-sm text-gray-400">
                About Us
              </p>

              <p className="mt-2 text-sm text-gray-400">
                Privacy Policy
              </p>

              <p className="mt-2 text-sm text-gray-400">
                Terms & Conditions
              </p>
            </div>

            <div>
              <h3 className="font-bold">
                Shop
              </h3>

              <Link
                href="/products"
                className="mt-3 block text-sm text-gray-400 hover:text-white"
              >
                All Products
              </Link>

              <Link
                href="/products"
                className="mt-2 block text-sm text-gray-400 hover:text-white"
              >
                Flash Deals
              </Link>

              <Link
                href="/products"
                className="mt-2 block text-sm text-gray-400 hover:text-white"
              >
                New Arrivals
              </Link>
            </div>

          </div>

          <div className="mt-10 border-t border-gray-700 pt-6 text-center text-sm text-gray-500">
            © 2026 AM Whole Sale UK. All rights reserved.
          </div>
        </div>
      </footer>
    </main>
  );
}