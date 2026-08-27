"use client";

import Link from "next/link";
import { CldUploadWidget } from "next-cloudinary";
import { useEffect, useState } from "react";

type ImageField =
  | "image"
  | "image2"
  | "image3"
  | "image4"
  | "descriptionImage";

type Product = {
  id: number;
  name: string;
  category: string;
  price: string | number;
  oldPrice: string | number | null;
  discount: number | null;
  stock: number;
  image: string | null;
  image2: string | null;
  image3: string | null;
  image4: string | null;
  descriptionImage: string | null;
  description: string | null;
  reviews: number;
  featured: boolean;
  flashDeal: boolean;
  newArrival: boolean;
};

type CloudinaryInfo = {
  secure_url?: string;
};

const imageFields: {
  key: ImageField;
  label: string;
  required?: boolean;
}[] = [
  { key: "image", label: "Main Image", required: true },
  { key: "image2", label: "Image 2" },
  { key: "image3", label: "Image 3" },
  { key: "image4", label: "Image 4" },
  { key: "descriptionImage", label: "Description Image" },
];

export default function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [product, setProduct] = useState<Product | null>(null);

  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [oldPrice, setOldPrice] = useState("");
  const [stock, setStock] = useState("");
  const [description, setDescription] = useState("");
  const [reviews, setReviews] = useState("0");

  const [images, setImages] = useState<Record<ImageField, string>>({
    image: "",
    image2: "",
    image3: "",
    image4: "",
    descriptionImage: "",
  });

  const [featured, setFeatured] = useState(false);
  const [flashDeal, setFlashDeal] = useState(false);
  const [newArrival, setNewArrival] = useState(false);
  const [discount, setDiscount] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState<ImageField | null>(null);
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
        setOldPrice(
          item.oldPrice !== null && item.oldPrice !== undefined
            ? String(item.oldPrice)
            : ""
        );
        setStock(String(item.stock));
        setDescription(item.description || "");
        setReviews(String(item.reviews));

        setImages({
          image: item.image || "",
          image2: item.image2 || "",
          image3: item.image3 || "",
          image4: item.image4 || "",
          descriptionImage: item.descriptionImage || "",
        });

        setFeatured(item.featured);
        setFlashDeal(item.flashDeal);
        setNewArrival(item.newArrival);
        setDiscount(
          item.discount !== null && item.discount !== undefined
            ? String(item.discount)
            : ""
        );

        setLoading(false);
      } catch (error) {
        console.error(error);
        setError("Failed to load product.");
        setLoading(false);
      }
    }

    loadProduct();
  }, [params]);

  function setImage(field: ImageField, url: string) {
    setImages((prev) => ({
      ...prev,
      [field]: url,
    }));
  }

  function removeImage(field: ImageField) {
    setImages((prev) => ({
      ...prev,
      [field]: "",
    }));
  }

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

    const oldPriceNumber =
      oldPrice.trim() === "" ? null : Number(oldPrice);

    const stockNumber = Number(stock);
    const reviewsNumber = Number(reviews);

    const discountNumber =
      discount.trim() === "" ? null : Number(discount);

    if (!Number.isFinite(priceNumber) || priceNumber < 0) {
      setError("Please enter a valid price.");
      return;
    }

    if (
      oldPriceNumber !== null &&
      (!Number.isFinite(oldPriceNumber) || oldPriceNumber < 0)
    ) {
      setError("Please enter a valid old price.");
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

    if (!images.image) {
      setError("Main Image is required.");
      return;
    }

    if (!Number.isInteger(reviewsNumber) || reviewsNumber < 0) {
      setError("Please enter a valid reviews number.");
      return;
    }

    if (
      discountNumber !== null &&
      (!Number.isInteger(discountNumber) ||
        discountNumber < 1 ||
        discountNumber > 100)
    ) {
      setError("Discount must be between 1% and 100%.");
      return;
    }

    if (flashDeal && discountNumber === null) {
      setError("Please enter a discount percentage for the Flash Deal.");
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
          oldPrice: oldPriceNumber,
          stock: stockNumber,
          description: description.trim(),
          reviews: reviewsNumber,
          featured,
          flashDeal,
          newArrival,
          discount: discountNumber,
          image: images.image,
          image2: images.image2 || null,
          image3: images.image3 || null,
          image4: images.image4 || null,
          descriptionImage: images.descriptionImage || null,
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

            {/* PRODUCT NAME */}
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

            {/* CATEGORY + PRICE */}
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

            {/* OLD PRICE */}
            <div>
              <label
                htmlFor="oldPrice"
                className="mb-2 block font-semibold"
              >
                Old Price (£)
                <span className="ml-2 text-sm font-normal text-gray-400">
                  Optional
                </span>
              </label>

              <input
                id="oldPrice"
                type="number"
                step="0.01"
                min="0"
                value={oldPrice}
                onChange={(e) => setOldPrice(e.target.value)}
                placeholder="Example: 199.99"
                className="w-full rounded-md border px-4 py-3 outline-none focus:border-orange-500"
              />
            </div>

            {/* STOCK */}
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

            {/* PRODUCT STATUS */}
            <div className="rounded-lg border bg-gray-50 p-5">
              <h3 className="text-lg font-bold">
                Product Status
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                Choose where this product should appear in the store.
              </p>

              <div className="mt-5 space-y-4">

                {/* FLASH DEAL */}
                <div className="rounded-md border bg-white p-4">
                  <div className="flex items-center gap-3">
                    <input
                      id="flashDeal"
                      type="checkbox"
                      checked={flashDeal}
                      onChange={(e) =>
                        setFlashDeal(e.target.checked)
                      }
                      className="h-5 w-5"
                    />

                    <label
                      htmlFor="flashDeal"
                      className="font-semibold"
                    >
                      🔥 Flash Deal
                    </label>
                  </div>

                  <p className="mt-2 text-sm text-gray-500">
                    Turn this ON if this product should appear in Flash Deals.
                  </p>

                  {flashDeal && (
                    <div className="mt-4">
                      <label
                        htmlFor="discount"
                        className="mb-2 block font-semibold"
                      >
                        Discount Percentage
                      </label>

                      <div className="flex max-w-xs overflow-hidden rounded-md border bg-white">
                        <input
                          id="discount"
                          type="number"
                          min="1"
                          max="100"
                          value={discount}
                          onChange={(e) =>
                            setDiscount(e.target.value)
                          }
                          placeholder="Example: 40"
                          className="w-full px-4 py-3 outline-none"
                        />

                        <span className="flex items-center bg-gray-100 px-4 font-bold">
                          %
                        </span>
                      </div>

                      <p className="mt-2 text-xs text-gray-500">
                        Example: 20 = 20% OFF, 40 = 40% OFF
                      </p>
                    </div>
                  )}
                </div>

                {/* NEW ARRIVAL */}
                <div className="rounded-md border bg-white p-4">
                  <div className="flex items-center gap-3">
                    <input
                      id="newArrival"
                      type="checkbox"
                      checked={newArrival}
                      onChange={(e) =>
                        setNewArrival(e.target.checked)
                      }
                      className="h-5 w-5"
                    />

                    <label
                      htmlFor="newArrival"
                      className="font-semibold"
                    >
                      🆕 New Arrival
                    </label>
                  </div>

                  <p className="mt-2 text-sm text-gray-500">
                    Turn this ON if this product should appear in New Arrivals.
                  </p>
                </div>

                {/* FEATURED */}
                <div className="rounded-md border bg-white p-4">
                  <div className="flex items-center gap-3">
                    <input
                      id="featured"
                      type="checkbox"
                      checked={featured}
                      onChange={(e) =>
                        setFeatured(e.target.checked)
                      }
                      className="h-5 w-5"
                    />

                    <label
                      htmlFor="featured"
                      className="font-semibold"
                    >
                      ⭐ Featured Product
                    </label>
                  </div>

                  <p className="mt-2 text-sm text-gray-500">
                    Turn this ON if you want to feature this product on the store.
                  </p>
                </div>

              </div>
            </div>

            {/* IMAGES */}
            <div>
              <h3 className="mb-4 text-lg font-bold">
                Product Images
              </h3>

              <div className="grid gap-6 md:grid-cols-2">
                {imageFields.map((field) => (
                  <div
                    key={field.key}
                    className="rounded-lg border p-4"
                  >
                    <label className="mb-3 block font-semibold">
                      {field.label}

                      {field.required && (
                        <span className="ml-1 text-red-500">
                          *
                        </span>
                      )}
                    </label>

                    <CldUploadWidget
                      uploadPreset="am_wholesale"
                      options={{
                        clientAllowedFormats: [
                          "jpg",
                          "jpeg",
                          "png",
                          "webp",
                          "gif",
                        ],
                        maxFileSize: 5242880,
                        folder: "am-wholesale-uk/products",
                        multiple: false,
                      }}
                      onOpen={() => {
                        setError("");
                        setUploading(field.key);
                      }}
                      onSuccess={(result) => {
                        const info = result.info as
                          | CloudinaryInfo
                          | string
                          | undefined;

                        if (
                          typeof info === "object" &&
                          info !== null &&
                          typeof info.secure_url === "string"
                        ) {
                          setImage(
                            field.key,
                            info.secure_url
                          );

                          setError("");
                        } else {
                          setError(
                            "Cloudinary uploaded the image but no image URL was returned."
                          );
                        }

                        setUploading(null);
                      }}
                      onError={(uploadError) => {
                        console.error(
                          "Cloudinary upload error:",
                          uploadError
                        );

                        setError(
                          "Cloudinary upload failed. Check Cloud Name and Upload Preset."
                        );

                        setUploading(null);
                      }}
                      onClose={() => {
                        setUploading(null);
                      }}
                    >
                      {({ open }) => (
                        <button
                          type="button"
                          onClick={() => open()}
                          disabled={
                            saving ||
                            uploading !== null
                          }
                          className="w-full rounded-md border-2 border-dashed border-gray-300 px-4 py-6 text-sm font-semibold text-gray-700 transition hover:border-orange-500 hover:text-orange-600 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {uploading === field.key
                            ? "Uploading..."
                            : images[field.key]
                            ? "Choose Another Image"
                            : "Choose Image"}
                        </button>
                      )}
                    </CldUploadWidget>

                    {images[field.key] && (
                      <div className="mt-4">
                        <img
                          src={images[field.key]}
                          alt={field.label}
                          className="h-40 w-full rounded-md border object-contain"
                        />

                        <button
                          type="button"
                          onClick={() =>
                            removeImage(field.key)
                          }
                          disabled={
                            saving ||
                            uploading !== null
                          }
                          className="mt-3 rounded-md bg-red-100 px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-200 disabled:opacity-50"
                        >
                          Remove Image
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <p className="mt-3 text-sm text-gray-500">
                Maximum size: 5MB per image. JPG, PNG, WEBP and GIF are supported.
              </p>
            </div>

            {/* DESCRIPTION */}
            <div>
              <label
                htmlFor="description"
                className="mb-2 block font-semibold"
              >
                Description
              </label>

              <textarea
                id="description"
                rows={6}
                value={description}
                onChange={(e) =>
                  setDescription(e.target.value)
                }
                className="w-full rounded-md border px-4 py-3 outline-none focus:border-orange-500"
              />
            </div>

            {/* REVIEWS */}
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
                onChange={(e) =>
                  setReviews(e.target.value)
                }
                className="w-full rounded-md border px-4 py-3 outline-none focus:border-orange-500"
              />
            </div>

            {/* BUTTONS */}
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
                disabled={
                  saving ||
                  uploading !== null
                }
                className="rounded-md bg-orange-500 px-6 py-3 font-bold text-white hover:bg-orange-600 disabled:cursor-not-allowed disabled:bg-gray-400"
              >
                {uploading
                  ? "Uploading Image..."
                  : saving
                  ? "Saving..."
                  : "Save Changes"}
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
