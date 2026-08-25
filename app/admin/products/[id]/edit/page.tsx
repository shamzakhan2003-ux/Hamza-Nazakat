"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Product = {
  id: number;
  name: string;
  category: string;
  price: string | number;
  stock: number;
  image: string | null;
  description: string | null;
  reviews: number;
  featured: boolean;
};

export default function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [product, setProduct] = useState<Product | null>(null);

  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [image, setImage] = useState("");
  const [description, setDescription] = useState("");
  const [reviews, setReviews] = useState("0");
  const [featured, setFeatured] = useState(false);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [productId, setProductId] = useState("");

  useEffect(() => {
    async function loadProduct() {
      try {
        const { id } = await params;
        setProductId(id);

        const response = await fetch(`/api/products/${id}`);

        const data = await response.json();

        if (!response.ok) {
          setError(data.error || "Product not found.");
          setLoading(false);
          return;
        }

        const item = data.product as Product;

        setProduct(item);

        setName(item.name);
        setCategory(item.category);
        setPrice(String(item.price));
        setStock(String(item.stock));
        setImage(item.image || "");
        setDescription(item.description || "");
        setReviews(String(item.reviews));
        setFeatured(item.featured);

        setLoading(false);
      } catch (error) {
        console.error(error);
        setError("Failed to load product.");
        setLoading(false);
      }
    }

    loadProduct();
  }, [params]);

  async function updateProduct() {
    setError("");
    setSuccess("");

    if (!name.trim()) {
      setError("Product name is required.");
      return;
    }

    if (!category.trim()) {
      setError("Category is required.");
      return;
    }

    const priceNumber = Number(price);
    const stockNumber = Number(stock);
    const reviewsNumber = Number(reviews);

    if (!Number.isFinite(priceNumber) || priceNumber < 0) {
      setError("Please enter a valid price.");
      return;
    }

    if (!Number.isInteger(stockNumber) || stockNumber < 0) {
      setError("Please enter a valid stock quantity.");
      return;
    }

    if (!description.trim()) {
      setError("Description is required.");
      return;
    }

    if (!Number.isInteger(reviewsNumber) || reviewsNumber < 0) {
      setError("Please enter a valid reviews number.");
      return;
    }

    setSaving(true);

    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name.trim(),
          category: category.trim(),
          price: priceNumber,
          stock: stockNumber,
          image: image.trim(),
          description: description.trim(),
          reviews: reviewsNumber,
          featured,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to update product.");
        setSaving(false);
        return;
      }

      setProduct(data.product);
      setSuccess("Product updated successfully.");

      setTimeout(() => {
        window.location.href = "/admin/products";
      }, 1000);
    } catch (error) {
      console.error(error);
      setError("Something went wrong. Please try again.");
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-100">
        <p className="text-lg font-semibold">Loading product...</p>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="min-h-screen bg-gray-100 p-8">
        <div className="mx-auto max-w-3xl rounded-lg bg-white p-8 shadow">
          <p className="font-semibold text-red-600">
            {error || "Product not found."}
          </p>

          <Link
            href="/admin/products"
            className="mt-6 inline-block rounded-md bg-gray-900 px-5 py-3 font-semibold text-white"
          >
            Back to Products
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100 text-gray-900">
      <header className="bg-gray-900 text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5">
          <div>
            <h1 className="text-2xl font-bold">AM Whole Sale UK</h1>

            <p className="text-sm text-gray-400">
              Edit Product #{product.id}
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
          <h2 className="text-2xl font-bold">Edit Product</h2>

          <p className="mt-2 text-gray-500">
            Update the product information below.
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
                value={name}
                onChange={(e) => setName(e.target.value)}
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
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
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
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
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
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
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
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
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
                value={description}
                onChange={(e) => setDescription(e.target.value)}
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
                value={reviews}
                onChange={(e) => setReviews(e.target.value)}
                className="w-full rounded-md border px-4 py-3 outline-none focus:border-orange-500"
              />
            </div>

            <div className="flex items-center gap-3">
              <input
                id="featured"
                type="checkbox"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
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
                onClick={updateProduct}
                disabled={saving}
                className="rounded-md bg-orange-500 px-6 py-3 font-bold text-white hover:bg-orange-600 disabled:cursor-not-allowed disabled:bg-gray-400"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}