"use client";

import Link from "next/link";
import { useState } from "react";

export default function NewProductPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function addProduct() {
    setLoading(true);
    setError("");
    setSuccess("");

    const name = (
      document.getElementById("name") as HTMLInputElement
    ).value.trim();

    const category = (
      document.getElementById("category") as HTMLInputElement
    ).value.trim();

    const price = Number(
      (document.getElementById("price") as HTMLInputElement).value
    );

    const stock = Number(
      (document.getElementById("stock") as HTMLInputElement).value
    );

    const image = (
      document.getElementById("image") as HTMLInputElement
    ).value.trim();

    const description = (
      document.getElementById("description") as HTMLTextAreaElement
    ).value.trim();

    const reviews = Number(
      (document.getElementById("reviews") as HTMLInputElement).value || 0
    );

    const featured = (
      document.getElementById("featured") as HTMLInputElement
    ).checked;

    if (!name) {
      setError("Product name is required.");
      setLoading(false);
      return;
    }

    if (!category) {
      setError("Category is required.");
      setLoading(false);
      return;
    }

    if (!Number.isFinite(price) || price < 0) {
      setError("Please enter a valid price.");
      setLoading(false);
      return;
    }

    if (!Number.isInteger(stock) || stock < 0) {
      setError("Please enter a valid stock quantity.");
      setLoading(false);
      return;
    }

    if (!description) {
      setError("Description is required.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          category,
          price,
          stock,
          image,
          description,
          reviews,
          featured,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.error || "Failed to create product.");
        setLoading(false);
        return;
      }

      setSuccess("Product added successfully.");

      setTimeout(() => {
        window.location.href = "/admin/products";
      }, 1000);
    } catch (error) {
      console.error(error);
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-gray-100 text-gray-900">
      <header className="bg-gray-900 text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5">
          <div>
            <h1 className="text-2xl font-bold">
              AM Whole Sale UK
            </h1>

            <p className="text-sm text-gray-400">
              Add New Product
            </p>
          </div>

          <Link
            href="/admin/products"
            className="rounded-md bg-gray-700 px-5 py-2 font-semibold hover:bg-gray-600"
          >
            Back to Products
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-4xl px-4 py-8">
        <div className="rounded-lg bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-bold">
            Add Product
          </h2>

          <p className="mt-2 text-gray-500">
            Enter the details of your new product.
          </p>

          {error && (
            <div className="mt-6 rounded-md bg-red-100 px-4 py-3 font-semibold text-red-700">
              {error}
            </div>
          )}

          {success && (
            <div className="mt-6 rounded-md bg-green-100 px-4 py-3 font-semibold text-green-700">
              {success}
            </div>
          )}

          <div className="mt-8 space-y-6">
            <div>
              <label
                htmlFor="name"
                className="mb-2 block font-semibold"
              >
                Product Name
              </label>

              <input
                id="name"
                type="text"
                placeholder="Enter product name"
                className="w-full rounded-md border px-4 py-3 outline-none focus:border-orange-500"
              />
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label
                  htmlFor="category"
                  className="mb-2 block font-semibold"
                >
                  Category
                </label>

                <input
                  id="category"
                  type="text"
                  placeholder="Enter category"
                  className="w-full rounded-md border px-4 py-3 outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label
                  htmlFor="price"
                  className="mb-2 block font-semibold"
                >
                  Price (£)
                </label>

                <input
                  id="price"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  className="w-full rounded-md border px-4 py-3 outline-none focus:border-orange-500"
                />
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label
                  htmlFor="stock"
                  className="mb-2 block font-semibold"
                >
                  Stock
                </label>

                <input
                  id="stock"
                  type="number"
                  min="0"
                  placeholder="0"
                  className="w-full rounded-md border px-4 py-3 outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label
                  htmlFor="image"
                  className="mb-2 block font-semibold"
                >
                  Image URL
                </label>

                <input
                  id="image"
                  type="text"
                  placeholder="https://example.com/image.jpg"
                  className="w-full rounded-md border px-4 py-3 outline-none focus:border-orange-500"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="description"
                className="mb-2 block font-semibold"
              >
                Description
              </label>

              <textarea
                id="description"
                rows={5}
                placeholder="Enter product description"
                className="w-full rounded-md border px-4 py-3 outline-none focus:border-orange-500"
              />
            </div>

            <div>
              <label
                htmlFor="reviews"
                className="mb-2 block font-semibold"
              >
                Reviews
              </label>

              <input
                id="reviews"
                type="number"
                min="0"
                defaultValue="0"
                className="w-full rounded-md border px-4 py-3 outline-none focus:border-orange-500"
              />
            </div>

            <div className="flex items-center gap-3">
              <input
                id="featured"
                type="checkbox"
                className="h-5 w-5"
              />

              <label
                htmlFor="featured"
                className="font-semibold"
              >
                Featured Product
              </label>
            </div>

            <div className="flex gap-3 pt-4">
              <Link
                href="/admin/products"
                className="rounded-md bg-gray-200 px-6 py-3 font-semibold hover:bg-gray-300"
              >
                Cancel
              </Link>

              <button
                type="button"
                onClick={addProduct}
                disabled={loading}
                className="rounded-md bg-orange-500 px-6 py-3 font-bold text-white hover:bg-orange-600 disabled:cursor-not-allowed disabled:bg-gray-400"
              >
                {loading ? "Adding Product..." : "Add Product"}
              </button>
            </div>
          </div>
        </div>
      </section>

      <footer className="mt-10 bg-gray-900 py-8 text-center text-white">
        <p className="text-sm text-gray-400">
          © 2026 AM Whole Sale UK
        </p>
      </footer>
    </main>
  );
}