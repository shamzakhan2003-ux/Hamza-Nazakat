import Link from "next/link";
import { prisma } from "../../../lib/prisma";
import DeleteButton from "./DeleteButton";

export default async function ProductsPage() {
  const products = await prisma.product.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <main className="min-h-screen bg-gray-100 text-gray-900">
      <header className="bg-gray-900 text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5">
          <div>
            <h1 className="text-2xl font-bold">
              AM Whole Sale UK
            </h1>

            <p className="text-sm text-gray-400">
              Product Management
            </p>
          </div>

          <div className="flex gap-3">
            <Link
              href="/admin"
              className="rounded-md bg-gray-700 px-5 py-2 font-semibold hover:bg-gray-600"
            >
              Dashboard
            </Link>

            <Link
              href="/admin/products/new"
              className="rounded-md bg-orange-500 px-5 py-2 font-semibold hover:bg-orange-600"
            >
              Add Product
            </Link>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-4 py-8">
        <div className="mb-6">
          <h2 className="text-3xl font-bold">
            Products
          </h2>

          <p className="mt-2 text-gray-500">
            Manage all products in your store.
          </p>
        </div>

        <div className="overflow-hidden rounded-lg bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b bg-gray-50 text-sm text-gray-500">
                  <th className="px-4 py-4">
                    Product
                  </th>

                  <th className="px-4 py-4">
                    Category
                  </th>

                  <th className="px-4 py-4">
                    Price
                  </th>

                  <th className="px-4 py-4">
                    Stock
                  </th>

                  <th className="px-4 py-4">
                    Featured
                  </th>

                  <th className="px-4 py-4">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {products.map((product) => (
                  <tr
                    key={product.id}
                    className="border-b last:border-b-0"
                  >
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-4">
                        <div className="h-16 w-16 overflow-hidden rounded-md bg-gray-100">
                          {product.image ? (
                            <img
                              src={product.image}
                              alt={product.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center text-xs text-gray-400">
                              No Image
                            </div>
                          )}
                        </div>

                        <div>
                          <p className="font-semibold">
                            {product.name}
                          </p>

                          <p className="text-sm text-gray-500">
                            ID: #{product.id}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-4">
                      {product.category}
                    </td>

                    <td className="px-4 py-4 font-semibold">
                      {"\u00A3"}
                      {Number(product.price).toFixed(2)}
                    </td>

                    <td className="px-4 py-4">
                      <span
                        className={
                          product.stock > 0
                            ? "font-semibold text-green-600"
                            : "font-semibold text-red-600"
                        }
                      >
                        {product.stock}
                      </span>
                    </td>

                    <td className="px-4 py-4">
                      {product.featured ? (
                        <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-700">
                          Yes
                        </span>
                      ) : (
                        <span className="rounded-full bg-gray-100 px-3 py-1 text-sm font-semibold text-gray-600">
                          No
                        </span>
                      )}
                    </td>

                    <td className="px-4 py-4">
                      <div className="flex gap-2">
                        <Link
                          href={`/admin/products/${product.id}/edit`}
                          className="rounded-md bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-700"
                        >
                          Edit
                        </Link>

                        <DeleteButton
                          productId={product.id}
                        />
                      </div>
                    </td>
                  </tr>
                ))}

                {products.length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-4 py-12 text-center text-gray-500"
                    >
                      No products found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <footer className="mt-10 bg-gray-900 py-8 text-center text-white">
        <p className="text-sm text-gray-400">
          {"\u00A9"} 2026 AM Whole Sale UK
        </p>
      </footer>
    </main>
  );
}