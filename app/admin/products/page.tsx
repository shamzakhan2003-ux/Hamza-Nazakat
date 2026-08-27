"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import DeleteButton from "./DeleteButton";

type Product = {
  id: number;
  name: string;
  category: string;
  price: number | string;
  oldPrice: number | string | null;
  stock: number;
  image: string | null;
  flashDeal: boolean;
  newArrival: boolean;
  featured: boolean;
  discount: number | null;
};

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  async function loadProducts() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/products", {
        method: "GET",
        cache: "no-store",
      });

      const text = await response.text();

      let result: unknown = null;

      if (text.trim()) {
        try {
          result = JSON.parse(text);
        } catch (jsonError) {
          console.error("Invalid JSON response:", jsonError);
        }
      }

      if (!response.ok) {
        const errorMessage =
          typeof result === "object" &&
          result !== null &&
          "error" in result &&
          typeof result.error === "string"
            ? result.error
            : `Failed to load products. Server returned ${response.status}.`;

        setError(errorMessage);
        setProducts([]);
        return;
      }

      let productList: Product[] = [];

      if (Array.isArray(result)) {
        productList = result as Product[];
      } else if (
        typeof result === "object" &&
        result !== null &&
        "products" in result &&
        Array.isArray(result.products)
      ) {
        productList = result.products as Product[];
      }

      setProducts(productList);
    } catch (err) {
      console.error("Load products error:", err);
      setError("Something went wrong while loading products.");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProducts();
  }, []);

  const categories = useMemo(() => {
    const uniqueCategories = Array.from(
      new Set(
        products
          .map((product) => product.category)
          .filter(Boolean)
      )
    );

    return uniqueCategories.sort((a, b) =>
      a.localeCompare(b)
    );
  }, [products]);

  const filteredProducts = useMemo(() => {
    const searchText = search.trim().toLowerCase();

    return products.filter((product) => {
      const productName = String(product.name || "").toLowerCase();
      const productCategory = String(
        product.category || ""
      ).toLowerCase();

      const matchesSearch =
        !searchText ||
        productName.includes(searchText) ||
        productCategory.includes(searchText);

      const matchesCategory =
        categoryFilter === "all" ||
        product.category === categoryFilter;

      let matchesStatus = true;

      if (statusFilter === "flashDeal") {
        matchesStatus = product.flashDeal === true;
      }

      if (statusFilter === "newArrival") {
        matchesStatus = product.newArrival === true;
      }

      if (statusFilter === "featured") {
        matchesStatus = product.featured === true;
      }

      if (statusFilter === "outOfStock") {
        matchesStatus = product.stock === 0;
      }

      if (statusFilter === "inStock") {
        matchesStatus = product.stock > 0;
      }

      return (
        matchesSearch &&
        matchesCategory &&
        matchesStatus
      );
    });
  }, [
    products,
    search,
    categoryFilter,
    statusFilter,
  ]);

  function formatPrice(price: number | string | null) {
    const numericPrice = Number(price);

    if (!Number.isFinite(numericPrice)) {
      return "Â£0.00";
    }

    return `Â£${numericPrice.toFixed(2)}`;
  }

  function getDiscountedPrice(
    price: number | string,
    discount: number | null
  ) {
    const numericPrice = Number(price);

    if (
      !Number.isFinite(numericPrice) ||
      discount === null ||
      !Number.isFinite(discount) ||
      discount <= 0
    ) {
      return numericPrice;
    }

    return numericPrice - (numericPrice * discount) / 100;
  }

  return (
    <main className="min-h-screen bg-gray-100 text-gray-900">
      {/* HEADER */}

      <header className="bg-gray-900 text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-5">
          <div>
            <h1 className="text-2xl font-bold">
              AM Whole Sale UK
            </h1>

            <p className="text-sm text-gray-400">
              Product Management
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/admin"
              className="rounded-md bg-gray-700 px-5 py-2 font-semibold transition hover:bg-gray-600"
            >
              Admin Dashboard
            </Link>

            <Link
              href="/admin/products/new"
              className="rounded-md bg-orange-500 px-5 py-2 font-bold text-white transition hover:bg-orange-600"
            >
              + Add New Product
            </Link>
          </div>
        </div>
      </header>

      {/* MAIN */}

      <section className="mx-auto max-w-7xl px-4 py-8">
        {/* TITLE */}

        <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h2 className="text-3xl font-bold">
              Products
            </h2>

            <p className="mt-1 text-gray-500">
              Manage all products in your store.
            </p>
          </div>

          <button
            type="button"
            onClick={loadProducts}
            disabled={loading}
            className="rounded-md border bg-white px-5 py-2 font-semibold shadow-sm transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Refreshing..." : "Refresh Products"}
          </button>
        </div>

        {/* ERROR */}

        {error && (
          <div className="mb-6 rounded-md bg-red-100 px-4 py-3 font-semibold text-red-700">
            {error}
          </div>
        )}

        {/* FILTERS */}

        <div className="mb-6 rounded-lg border bg-white p-5 shadow-sm">
          <div className="mb-4">
            <h3 className="text-lg font-bold">
              Search & Filter
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              Find products by name, category or status.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {/* SEARCH */}

            <div>
              <label
                htmlFor="productSearch"
                className="mb-2 block text-sm font-semibold"
              >
                Search Products
              </label>

              <input
                id="productSearch"
                type="text"
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search product name..."
                className="w-full rounded-md border px-4 py-3 outline-none transition focus:border-orange-500"
              />
            </div>

            {/* CATEGORY */}

            <div>
              <label
                htmlFor="categoryFilter"
                className="mb-2 block text-sm font-semibold"
              >
                Category
              </label>

              <select
                id="categoryFilter"
                value={categoryFilter}
                onChange={(event) =>
                  setCategoryFilter(event.target.value)
                }
                className="w-full rounded-md border bg-white px-4 py-3 outline-none transition focus:border-orange-500"
              >
                <option value="all">
                  All Categories
                </option>

                {categories.map((category) => (
                  <option
                    key={category}
                    value={category}
                  >
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* STATUS */}

            <div>
              <label
                htmlFor="statusFilter"
                className="mb-2 block text-sm font-semibold"
              >
                Status
              </label>

              <select
                id="statusFilter"
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(event.target.value)
                }
                className="w-full rounded-md border bg-white px-4 py-3 outline-none transition focus:border-orange-500"
              >
                <option value="all">
                  All Products
                </option>

                <option value="flashDeal">
                  ðŸ”¥ Flash Deals
                </option>

                <option value="newArrival">
                  ðŸ†• New Arrivals
                </option>

                <option value="featured">
                  â­ Featured
                </option>

                <option value="inStock">
                  In Stock
                </option>

                <option value="outOfStock">
                  Out of Stock
                </option>
              </select>
            </div>
          </div>

          {/* FILTER SUMMARY */}

          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm">
            <span className="rounded-full bg-gray-100 px-3 py-1 font-semibold text-gray-700">
              Showing {filteredProducts.length} of{" "}
              {products.length} products
            </span>

            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="rounded-full bg-orange-100 px-3 py-1 font-semibold text-orange-700 hover:bg-orange-200"
              >
                Clear Search
              </button>
            )}

            {categoryFilter !== "all" && (
              <button
                type="button"
                onClick={() =>
                  setCategoryFilter("all")
                }
                className="rounded-full bg-orange-100 px-3 py-1 font-semibold text-orange-700 hover:bg-orange-200"
              >
                Clear Category
              </button>
            )}

            {statusFilter !== "all" && (
              <button
                type="button"
                onClick={() =>
                  setStatusFilter("all")
                }
                className="rounded-full bg-orange-100 px-3 py-1 font-semibold text-orange-700 hover:bg-orange-200"
              >
                Clear Status
              </button>
            )}
          </div>
        </div>

        {/* PRODUCTS */}

        <div className="rounded-lg border bg-white shadow-sm">
          {/* DESKTOP TABLE */}

          <div className="hidden overflow-x-auto md:block">
            <table className="w-full min-w-[1100px]">
              <thead className="bg-gray-900 text-left text-sm text-white">
                <tr>
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
                    Status
                  </th>

                  <th className="px-4 py-4">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y">
                {loading ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-4 py-12 text-center text-gray-500"
                    >
                      Loading products...
                    </td>
                  </tr>
                ) : filteredProducts.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-4 py-12 text-center"
                    >
                      <div className="text-lg font-bold text-gray-700">
                        No products found
                      </div>

                      <p className="mt-1 text-sm text-gray-500">
                        Try changing your search or filters.
                      </p>
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map((product) => {
                    const discountedPrice =
                      getDiscountedPrice(
                        product.price,
                        product.discount
                      );

                    return (
                      <tr
                        key={product.id}
                        className="transition hover:bg-gray-50"
                      >
                        {/* PRODUCT */}

                        <td className="px-4 py-4">
                          <div className="flex items-center gap-4">
                            <div className="h-20 w-20 shrink-0 overflow-hidden rounded-md border bg-gray-50">
                              {product.image ? (
                                <img
                                  src={product.image}
                                  alt={product.name}
                                  className="h-full w-full object-contain"
                                />
                              ) : (
                                <div className="flex h-full items-center justify-center text-xs text-gray-400">
                                  No Image
                                </div>
                              )}
                            </div>

                            <div className="min-w-0">
                              <p className="font-bold text-gray-900">
                                {product.name}
                              </p>

                              <p className="mt-1 text-xs text-gray-400">
                                ID: {product.id}
                              </p>

                              <div className="mt-2 flex flex-wrap gap-1">
                                {product.flashDeal && (
                                  <span className="rounded-full bg-red-100 px-2 py-1 text-xs font-bold text-red-700">
                                    ðŸ”¥ Flash Deal
                                  </span>
                                )}

                                {product.newArrival && (
                                  <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-bold text-blue-700">
                                    ðŸ†• New
                                  </span>
                                )}

                                {product.featured && (
                                  <span className="rounded-full bg-yellow-100 px-2 py-1 text-xs font-bold text-yellow-700">
                                    â­ Featured
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* CATEGORY */}

                        <td className="px-4 py-4">
                          <span className="rounded-md bg-gray-100 px-3 py-1 text-sm font-semibold">
                            {product.category}
                          </span>
                        </td>

                        {/* PRICE */}

                        <td className="px-4 py-4">
                          {product.discount !== null &&
                          product.discount > 0 ? (
                            <>
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-orange-600">
                                  {formatPrice(
                                    discountedPrice
                                  )}
                                </span>

                                <span className="rounded-full bg-red-100 px-2 py-1 text-xs font-bold text-red-700">
                                  -{product.discount}%
                                </span>
                              </div>

                              <div className="mt-1 text-sm text-gray-400 line-through">
                                {formatPrice(
                                  product.oldPrice ??
                                    product.price
                                )}
                              </div>
                            </>
                          ) : (
                            <>
                              <div className="font-bold text-gray-900">
                                {formatPrice(
                                  product.price
                                )}
                              </div>

                              {product.oldPrice !==
                                null && (
                                <div className="mt-1 text-sm text-gray-400 line-through">
                                  {formatPrice(
                                    product.oldPrice
                                  )}
                                </div>
                              )}
                            </>
                          )}
                        </td>

                        {/* STOCK */}

                        <td className="px-4 py-4">
                          {product.stock === 0 ? (
                            <span className="rounded-full bg-red-100 px-3 py-1 text-sm font-bold text-red-700">
                              Out of Stock
                            </span>
                          ) : product.stock <= 5 ? (
                            <div>
                              <span className="rounded-full bg-yellow-100 px-3 py-1 text-sm font-bold text-yellow-700">
                                Low Stock
                              </span>

                              <p className="mt-2 text-xs text-gray-500">
                                {product.stock} left
                              </p>
                            </div>
                          ) : (
                            <div>
                              <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-bold text-green-700">
                                In Stock
                              </span>

                              <p className="mt-2 text-xs text-gray-500">
                                {product.stock} units
                              </p>
                            </div>
                          )}
                        </td>

                        {/* STATUS */}

                        <td className="px-4 py-4">
                          <div className="flex max-w-[180px] flex-wrap gap-2">
                            {product.flashDeal && (
                              <span className="rounded-md bg-red-50 px-2 py-1 text-xs font-semibold text-red-700">
                                Flash Deal
                              </span>
                            )}

                            {product.newArrival && (
                              <span className="rounded-md bg-blue-50 px-2 py-1 text-xs font-semibold text-blue-700">
                                New Arrival
                              </span>
                            )}

                            {product.featured && (
                              <span className="rounded-md bg-yellow-50 px-2 py-1 text-xs font-semibold text-yellow-700">
                                Featured
                              </span>
                            )}

                            {!product.flashDeal &&
                              !product.newArrival &&
                              !product.featured && (
                                <span className="text-sm text-gray-400">
                                  Standard
                                </span>
                              )}
                          </div>
                        </td>

                        {/* ACTIONS */}

                        <td className="px-4 py-4">
                          <div className="flex flex-wrap gap-2">
                            <Link
                              href={`/admin/products/${product.id}/edit`}
                              className="rounded-md bg-blue-100 px-3 py-2 text-sm font-bold text-blue-700 transition hover:bg-blue-200"
                            >
                              Edit
                            </Link>

                            <DeleteButton productId={product.id} onDeleted={() => window.location.reload()} />
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* MOBILE CARDS */}

          <div className="space-y-4 p-4 md:hidden">
            {loading ? (
              <div className="py-12 text-center text-gray-500">
                Loading products...
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="py-12 text-center">
                <div className="font-bold text-gray-700">
                  No products found
                </div>

                <p className="mt-1 text-sm text-gray-500">
                  Try changing your search or filters.
                </p>
              </div>
            ) : (
              filteredProducts.map((product) => {
                const discountedPrice =
                  getDiscountedPrice(
                    product.price,
                    product.discount
                  );

                return (
                  <div
                    key={product.id}
                    className="rounded-lg border p-4"
                  >
                    <div className="flex gap-4">
                      {/* IMAGE */}

                      <div className="h-24 w-24 shrink-0 overflow-hidden rounded-md border bg-gray-50">
                        {product.image ? (
                          <img
                            src={product.image}
                            alt={product.name}
                            className="h-full w-full object-contain"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-xs text-gray-400">
                            No Image
                          </div>
                        )}
                      </div>

                      {/* BASIC INFO */}

                      <div className="min-w-0 flex-1">
                        <h3 className="font-bold">
                          {product.name}
                        </h3>

                        <p className="mt-1 text-sm text-gray-500">
                          {product.category}
                        </p>

                        <div className="mt-2 flex flex-wrap gap-1">
                          {product.flashDeal && (
                            <span className="rounded-full bg-red-100 px-2 py-1 text-xs font-bold text-red-700">
                              ðŸ”¥ Flash Deal
                            </span>
                          )}

                          {product.newArrival && (
                            <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-bold text-blue-700">
                              ðŸ†• New
                            </span>
                          )}

                          {product.featured && (
                            <span className="rounded-full bg-yellow-100 px-2 py-1 text-xs font-bold text-yellow-700">
                              â­ Featured
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* DETAILS */}

                    <div className="mt-4 grid grid-cols-2 gap-3">
                      <div className="rounded-md bg-gray-50 p-3">
                        <p className="text-xs font-semibold text-gray-500">
                          Price
                        </p>

                        {product.discount !== null &&
                        product.discount > 0 ? (
                          <>
                            <p className="mt-1 font-bold text-orange-600">
                              {formatPrice(
                                discountedPrice
                              )}
                            </p>

                            <p className="text-xs text-gray-400 line-through">
                              {formatPrice(
                                product.oldPrice ??
                                  product.price
                              )}
                            </p>
                          </>
                        ) : (
                          <>
                            <p className="mt-1 font-bold">
                              {formatPrice(
                                product.price
                              )}
                            </p>

                            {product.oldPrice !==
                              null && (
                              <p className="text-xs text-gray-400 line-through">
                                {formatPrice(
                                  product.oldPrice
                                )}
                              </p>
                            )}
                          </>
                        )}
                      </div>

                      <div className="rounded-md bg-gray-50 p-3">
                        <p className="text-xs font-semibold text-gray-500">
                          Stock
                        </p>

                        <p className="mt-1 font-bold">
                          {product.stock}
                        </p>

                        <p className="text-xs text-gray-500">
                          {product.stock === 0
                            ? "Out of stock"
                            : product.stock <= 5
                            ? "Low stock"
                            : "Available"}
                        </p>
                      </div>
                    </div>

                    {/* ACTIONS */}

                    <div className="mt-4 flex gap-2">
                      <Link
                        href={`/admin/products/${product.id}/edit`}
                        className="flex-1 rounded-md bg-blue-100 px-4 py-2 text-center text-sm font-bold text-blue-700 transition hover:bg-blue-200"
                      >
                        Edit Product
                      </Link>

                      <DeleteButton productId={product.id} onDeleted={() => window.location.reload()} />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </section>

      {/* FOOTER */}

      <footer className="mt-10 bg-gray-900 py-8 text-center text-white">
        <p className="text-sm text-gray-400">
          Â© 2026 AM Whole Sale UK
        </p>
      </footer>
    </main>
  );
}




