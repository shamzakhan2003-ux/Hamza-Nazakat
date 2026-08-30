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

  function formatPrice(
    price: number | string | null
  ) {
    const numericPrice = Number(price);

    if (!Number.isFinite(numericPrice)) {
      return "Rs. 0.00";
    }

    return `Rs. ${numericPrice.toFixed(2)}`;
  }

  return (
    <main className="min-h-screen bg-slate-100 text-slate-900">

      {/* HEADER */}

      <header className="border-b border-slate-800 bg-slate-950 text-white shadow-lg">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-4 py-5 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">

          <div>
            <div className="flex items-center gap-3">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-500 text-xl font-black shadow-lg">
                AM
              </div>

              <div>
                <h1 className="text-xl font-extrabold tracking-tight sm:text-2xl">
                  AM Whole Sale Pakistan
                </h1>

                <p className="mt-0.5 text-xs font-medium text-slate-400 sm:text-sm">
                  Product Management
                </p>
              </div>

            </div>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">

            <Link
              href="/admin"
              className="inline-flex items-center justify-center rounded-lg border border-slate-700 bg-slate-800 px-5 py-2.5 text-sm font-bold text-white transition hover:border-slate-600 hover:bg-slate-700"
            >
              Dashboard
            </Link>

            <Link
              href="/admin/products/new"
              className="inline-flex items-center justify-center rounded-lg bg-orange-500 px-5 py-2.5 text-sm font-extrabold text-white shadow-md transition hover:bg-orange-600 hover:shadow-lg"
            >
              <span className="mr-2 text-lg leading-none">
                +
              </span>
              Add New Product
            </Link>

          </div>
        </div>
      </header>

      {/* MAIN */}

      <section className="mx-auto max-w-7xl px-4 py-7 sm:px-6 lg:px-8 lg:py-9">

        {/* PAGE TITLE */}

        <div className="mb-7 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">

          <div>

            <div className="mb-2 inline-flex rounded-full bg-orange-100 px-3 py-1 text-xs font-extrabold uppercase tracking-wider text-orange-700">
              Store Management
            </div>

            <h2 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
              Products
            </h2>

            <p className="mt-2 text-sm text-slate-500 sm:text-base">
              Manage, edit and monitor all products in your store.
            </p>

          </div>

          <button
            type="button"
            onClick={loadProducts}
            disabled={loading}
            className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white px-5 py-2.5 text-sm font-bold text-slate-700 shadow-sm transition hover:border-orange-300 hover:bg-orange-50 hover:text-orange-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? (
              <>
                <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-orange-500" />
                Refreshing...
              </>
            ) : (
              <>
                <span className="mr-2 text-base">
                  ↻
                </span>
                Refresh Products
              </>
            )}
          </button>

        </div>

        {/* ERROR */}

        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-semibold text-red-700 shadow-sm">
            {error}
          </div>
        )}

        {/* FILTER PANEL */}

        <div className="mb-7 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

          <div className="border-b border-slate-100 bg-slate-50/70 px-5 py-5 sm:px-6">

            <div>

              <h3 className="text-lg font-extrabold text-slate-900">
                Search & Filter
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Find products by name, category or status.
              </p>

            </div>

          </div>

          <div className="p-5 sm:p-6">

            <div className="grid gap-5 lg:grid-cols-3">

              {/* SEARCH */}

              <div>

                <label
                  htmlFor="productSearch"
                  className="mb-2 block text-xs font-extrabold uppercase tracking-wide text-slate-600"
                >
                  Search Products
                </label>

                <div className="relative">

                  <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                    🔎
                  </span>

                  <input
                    id="productSearch"
                    type="text"
                    value={search}
                    onChange={(event) =>
                      setSearch(event.target.value)
                    }
                    placeholder="Search product name..."
                    className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm font-medium text-slate-800 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-orange-500 focus:ring-4 focus:ring-orange-100"
                  />

                </div>

              </div>

              {/* CATEGORY */}

              <div>

                <label
                  htmlFor="categoryFilter"
                  className="mb-2 block text-xs font-extrabold uppercase tracking-wide text-slate-600"
                >
                  Category
                </label>

                <select
                  id="categoryFilter"
                  value={categoryFilter}
                  onChange={(event) =>
                    setCategoryFilter(event.target.value)
                  }
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 outline-none transition hover:border-slate-300 focus:border-orange-500 focus:ring-4 focus:ring-orange-100"
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
                  className="mb-2 block text-xs font-extrabold uppercase tracking-wide text-slate-600"
                >
                  Status
                </label>

                <select
                  id="statusFilter"
                  value={statusFilter}
                  onChange={(event) =>
                    setStatusFilter(event.target.value)
                  }
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 outline-none transition hover:border-slate-300 focus:border-orange-500 focus:ring-4 focus:ring-orange-100"
                >

                  <option value="all">
                    All Products
                  </option>

                  <option value="flashDeal">
                    Flash Deals
                  </option>

                  <option value="newArrival">
                    New Arrivals
                  </option>

                  <option value="featured">
                    Featured
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

            {/* SUMMARY */}

            <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-5">

              <span className="rounded-full bg-slate-900 px-4 py-2 text-xs font-extrabold text-white">
                Showing {filteredProducts.length} of{" "}
                {products.length} products
              </span>

              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="rounded-full bg-orange-100 px-4 py-2 text-xs font-bold text-orange-700 transition hover:bg-orange-200"
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
                  className="rounded-full bg-orange-100 px-4 py-2 text-xs font-bold text-orange-700 transition hover:bg-orange-200"
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
                  className="rounded-full bg-orange-100 px-4 py-2 text-xs font-bold text-orange-700 transition hover:bg-orange-200"
                >
                  Clear Status
                </button>
              )}

            </div>

          </div>
        </div>

        {/* PRODUCTS CONTAINER */}

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-md">

          {/* TABLE HEADER */}

          <div className="flex flex-col gap-2 border-b border-slate-200 bg-white px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">

            <div>

              <h3 className="text-lg font-extrabold text-slate-900">
                Product Inventory
              </h3>

              <p className="mt-1 text-xs text-slate-500 sm:text-sm">
                Complete list of products currently available in your store.
              </p>

            </div>

            <div className="rounded-lg bg-slate-100 px-3 py-2 text-xs font-bold text-slate-600">
              {filteredProducts.length} Products
            </div>

          </div>

          {/* DESKTOP TABLE */}

          <div className="hidden overflow-x-auto lg:block">

            <table className="w-full min-w-[1150px]">

              <thead className="bg-slate-950 text-left text-xs uppercase tracking-wide text-slate-300">

                <tr>

                  <th className="px-6 py-4 font-extrabold">
                    Product
                  </th>

                  <th className="px-5 py-4 font-extrabold">
                    Category
                  </th>

                  <th className="px-5 py-4 font-extrabold">
                    Price
                  </th>

                  <th className="px-5 py-4 font-extrabold">
                    Stock
                  </th>

                  <th className="px-5 py-4 font-extrabold">
                    Status
                  </th>

                  <th className="px-6 py-4 font-extrabold">
                    Actions
                  </th>

                </tr>

              </thead>

              <tbody className="divide-y divide-slate-100">

                {loading ? (
                  <tr>

                    <td
                      colSpan={6}
                      className="px-6 py-16 text-center"
                    >

                      <div className="flex flex-col items-center">

                        <span className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-orange-500" />

                        <p className="mt-4 text-sm font-semibold text-slate-500">
                          Loading products...
                        </p>

                      </div>

                    </td>

                  </tr>
                ) : filteredProducts.length === 0 ? (
                  <tr>

                    <td
                      colSpan={6}
                      className="px-6 py-16 text-center"
                    >

                      <div className="text-4xl">
                        📦
                      </div>

                      <p className="mt-4 text-lg font-extrabold text-slate-800">
                        No products found
                      </p>

                      <p className="mt-1 text-sm text-slate-500">
                        Try changing your search or filters.
                      </p>

                    </td>

                  </tr>
                ) : (
                  filteredProducts.map((product) => (
                    <tr
                      key={product.id}
                      className="group transition hover:bg-orange-50/40"
                    >

                      {/* PRODUCT */}

                      <td className="px-6 py-5">

                        <div className="flex items-center gap-4">

                          <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-slate-50 shadow-sm">

                            {product.image ? (
                              <img
                                src={product.image}
                                alt={product.name}
                                className="h-full w-full object-contain p-1 transition duration-300 group-hover:scale-105"
                              />
                            ) : (
                              <div className="flex h-full items-center justify-center text-xs font-semibold text-slate-400">
                                No Image
                              </div>
                            )}

                            {product.flashDeal && (
                              <span className="absolute left-1 top-1 rounded-md bg-red-600 px-1.5 py-0.5 text-[9px] font-black text-white shadow">
                                DEAL
                              </span>
                            )}

                          </div>

                          <div className="min-w-0">

                            <p className="truncate text-sm font-extrabold text-slate-900">
                              {product.name}
                            </p>

                            <p className="mt-1 text-xs font-medium text-slate-400">
                              Product ID: #{product.id}
                            </p>

                            <div className="mt-2 flex flex-wrap gap-1.5">

                              {product.flashDeal && (
                                <span className="rounded-md bg-red-50 px-2 py-1 text-[10px] font-extrabold text-red-700">
                                  Flash Deal
                                </span>
                              )}

                              {product.newArrival && (
                                <span className="rounded-md bg-blue-50 px-2 py-1 text-[10px] font-extrabold text-blue-700">
                                  New
                                </span>
                              )}

                              {product.featured && (
                                <span className="rounded-md bg-amber-50 px-2 py-1 text-[10px] font-extrabold text-amber-700">
                                  Featured
                                </span>
                              )}

                            </div>

                          </div>

                        </div>

                      </td>

                      {/* CATEGORY */}

                      <td className="px-5 py-5">

                        <span className="inline-flex max-w-[190px] rounded-lg bg-slate-100 px-3 py-2 text-xs font-bold text-slate-700">
                          {product.category}
                        </span>

                      </td>

                      {/* PRICE */}

                      <td className="px-5 py-5">

                        <div>

                          <div className="flex items-center gap-2">

                            <span className="text-base font-black text-orange-600">
                              {formatPrice(product.price)}
                            </span>

                            {product.flashDeal &&
                              product.discount !== null &&
                              product.discount > 0 && (
                                <span className="rounded-md bg-red-100 px-2 py-1 text-[10px] font-black text-red-700">
                                  -{product.discount}%
                                </span>
                              )}

                          </div>

                          {product.oldPrice !== null && (
                            <div className="mt-1 text-xs font-medium text-slate-400 line-through">
                              {formatPrice(product.oldPrice)}
                            </div>
                          )}

                        </div>

                      </td>

                      {/* STOCK */}

                      <td className="px-5 py-5">

                        {product.stock === 0 ? (
                          <div>

                            <span className="inline-flex rounded-full bg-red-100 px-3 py-1.5 text-xs font-extrabold text-red-700">
                              Out of Stock
                            </span>

                          </div>
                        ) : product.stock <= 5 ? (
                          <div>

                            <span className="inline-flex rounded-full bg-amber-100 px-3 py-1.5 text-xs font-extrabold text-amber-700">
                              Low Stock
                            </span>

                            <p className="mt-2 text-xs font-semibold text-slate-500">
                              {product.stock} left
                            </p>

                          </div>
                        ) : (
                          <div>

                            <span className="inline-flex rounded-full bg-emerald-100 px-3 py-1.5 text-xs font-extrabold text-emerald-700">
                              In Stock
                            </span>

                            <p className="mt-2 text-xs font-semibold text-slate-500">
                              {product.stock} units
                            </p>

                          </div>
                        )}

                      </td>

                      {/* STATUS */}

                      <td className="px-5 py-5">

                        <div className="flex max-w-[180px] flex-wrap gap-1.5">

                          {product.flashDeal && (
                            <span className="rounded-md bg-red-50 px-2 py-1 text-[10px] font-bold text-red-700">
                              Flash Deal
                            </span>
                          )}

                          {product.newArrival && (
                            <span className="rounded-md bg-blue-50 px-2 py-1 text-[10px] font-bold text-blue-700">
                              New Arrival
                            </span>
                          )}

                          {product.featured && (
                            <span className="rounded-md bg-amber-50 px-2 py-1 text-[10px] font-bold text-amber-700">
                              Featured
                            </span>
                          )}

                          {!product.flashDeal &&
                            !product.newArrival &&
                            !product.featured && (
                              <span className="rounded-md bg-slate-100 px-2 py-1 text-[10px] font-bold text-slate-500">
                                Standard
                              </span>
                            )}

                        </div>

                      </td>

                      {/* ACTIONS */}

                      <td className="px-6 py-5">

                        <div className="flex items-center gap-2">

                          <Link
                            href={`/admin/products/${product.id}/edit`}
                            className="inline-flex items-center justify-center rounded-lg bg-blue-50 px-3.5 py-2 text-xs font-extrabold text-blue-700 transition hover:bg-blue-100"
                          >
                            Edit
                          </Link>

                          <DeleteButton
                            productId={product.id}
                            onDeleted={() =>
                              window.location.reload()
                            }
                          />

                        </div>

                      </td>

                    </tr>
                  ))
                )}

              </tbody>

            </table>

          </div>

          {/* MOBILE / TABLET CARDS */}

          <div className="space-y-4 bg-slate-50 p-4 lg:hidden">

            {loading ? (
              <div className="rounded-xl bg-white py-16 text-center shadow-sm">

                <span className="mx-auto block h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-orange-500" />

                <p className="mt-4 text-sm font-semibold text-slate-500">
                  Loading products...
                </p>

              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="rounded-xl bg-white py-16 text-center shadow-sm">

                <div className="text-4xl">
                  📦
                </div>

                <p className="mt-4 text-lg font-extrabold text-slate-800">
                  No products found
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  Try changing your search or filters.
                </p>

              </div>
            ) : (
              filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
                >

                  {/* CARD TOP */}

                  <div className="p-4">

                    <div className="flex gap-4">

                      <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-slate-50">

                        {product.image ? (
                          <img
                            src={product.image}
                            alt={product.name}
                            className="h-full w-full object-contain p-1"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-xs font-semibold text-slate-400">
                            No Image
                          </div>
                        )}

                        {product.flashDeal && (
                          <span className="absolute left-1 top-1 rounded-md bg-red-600 px-1.5 py-0.5 text-[9px] font-black text-white">
                            DEAL
                          </span>
                        )}

                      </div>

                      <div className="min-w-0 flex-1">

                        <h3 className="truncate text-base font-extrabold text-slate-900">
                          {product.name}
                        </h3>

                        <p className="mt-1 text-xs font-medium text-slate-400">
                          Product ID: #{product.id}
                        </p>

                        <p className="mt-2 text-xs font-bold text-slate-500">
                          {product.category}
                        </p>

                        <div className="mt-2 flex flex-wrap gap-1">

                          {product.flashDeal && (
                            <span className="rounded-md bg-red-50 px-2 py-1 text-[9px] font-extrabold text-red-700">
                              Flash Deal
                            </span>
                          )}

                          {product.newArrival && (
                            <span className="rounded-md bg-blue-50 px-2 py-1 text-[9px] font-extrabold text-blue-700">
                              New
                            </span>
                          )}

                          {product.featured && (
                            <span className="rounded-md bg-amber-50 px-2 py-1 text-[9px] font-extrabold text-amber-700">
                              Featured
                            </span>
                          )}

                        </div>

                      </div>

                    </div>

                    {/* DETAILS */}

                    <div className="mt-4 grid grid-cols-2 gap-3">

                      <div className="rounded-xl bg-slate-50 p-3">

                        <p className="text-[10px] font-extrabold uppercase tracking-wide text-slate-400">
                          Price
                        </p>

                        <div className="mt-1 flex items-center gap-2">

                          <p className="text-base font-black text-orange-600">
                            {formatPrice(product.price)}
                          </p>

                          {product.flashDeal &&
                            product.discount !== null &&
                            product.discount > 0 && (
                              <span className="text-[10px] font-black text-red-600">
                                -{product.discount}%
                              </span>
                            )}

                        </div>

                        {product.oldPrice !== null && (
                          <p className="text-xs text-slate-400 line-through">
                            {formatPrice(product.oldPrice)}
                          </p>
                        )}

                      </div>

                      <div className="rounded-xl bg-slate-50 p-3">

                        <p className="text-[10px] font-extrabold uppercase tracking-wide text-slate-400">
                          Stock
                        </p>

                        <p className="mt-1 text-base font-black text-slate-900">
                          {product.stock}
                        </p>

                        <p
                          className={`text-[10px] font-bold ${
                            product.stock === 0
                              ? "text-red-600"
                              : product.stock <= 5
                              ? "text-amber-600"
                              : "text-emerald-600"
                          }`}
                        >
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
                        className="flex-1 rounded-lg bg-blue-50 px-4 py-2.5 text-center text-xs font-extrabold text-blue-700 transition hover:bg-blue-100"
                      >
                        Edit Product
                      </Link>

                      <DeleteButton
                        productId={product.id}
                        onDeleted={() =>
                          window.location.reload()
                        }
                      />

                    </div>

                  </div>

                </div>
              ))
            )}

          </div>

        </div>
      </section>

      {/* FOOTER */}

      <footer className="mt-8 border-t border-slate-800 bg-slate-950 py-7 text-center">

        <p className="text-xs font-medium text-slate-500">
          © 2026 AM Whole Sale Pakistan. All rights reserved.
        </p>

      </footer>

    </main>
  );
}