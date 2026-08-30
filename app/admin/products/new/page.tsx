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

type CloudinaryInfo = {
  secure_url?: string;
};

export default function NewProductPage() {
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState<ImageField | null>(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [images, setImages] = useState<Record<ImageField, string>>({
    image: "",
    image2: "",
    image3: "",
    image4: "",
    descriptionImage: "",
  });

  const [flashDeal, setFlashDeal] = useState(false);
  const [newArrival, setNewArrival] = useState(false);

  const [priceValue, setPriceValue] = useState("");
  const [oldPriceValue, setOldPriceValue] = useState("");
  const [discount, setDiscount] = useState("");

  const [categories, setCategories] = useState<string[]>([]);
  const [categoryMode, setCategoryMode] = useState<"select" | "manual">(
    "select"
  );
  const [categoryValue, setCategoryValue] = useState("");

  useEffect(() => {
    async function loadCategories() {
      try {
        const response = await fetch("/api/products", {
          method: "GET",
          cache: "no-store",
        });

        if (!response.ok) {
          return;
        }

        const result = await response.json();

        const products: { category?: string }[] = Array.isArray(result)
          ? result
          : Array.isArray(result.products)
            ? result.products
            : [];

        const uniqueCategories: string[] = Array.from(
          new Set<string>(
            products
              .map((product) =>
                String(product.category || "").trim()
              )
              .filter(Boolean)
          )
        ).sort((a, b) => a.localeCompare(b));

        setCategories(uniqueCategories);
      } catch (categoryError) {
        console.error("Load categories error:", categoryError);
      }
    }

    loadCategories();
  }, []);

  function setImage(field: ImageField, url: string) {
    setImages((previous) => ({
      ...previous,
      [field]: url,
    }));
  }

  function removeImage(field: ImageField) {
    setImages((previous) => ({
      ...previous,
      [field]: "",
    }));
  }

  function calculateDiscount(oldPrice: string, currentPrice: string) {
    const oldPriceNumber = Number(oldPrice);
    const currentPriceNumber = Number(currentPrice);

    if (
      oldPriceNumber > 0 &&
      currentPriceNumber >= 0 &&
      currentPriceNumber < oldPriceNumber
    ) {
      const calculatedDiscount = Math.round(
        ((oldPriceNumber - currentPriceNumber) / oldPriceNumber) * 100
      );

      setDiscount(String(calculatedDiscount));
    } else {
      setDiscount("");
    }
  }

  function autoSelectCategory(value: string) {
    const name = value.toLowerCase();

    let suggestedCategory = "";

    if (
      /toy|toys|aeroplane|airplane|doll|puzzle|game|lego|car toy|robot|kids/.test(
        name
      )
    ) {
      suggestedCategory = "Toys";
    } else if (
      /iphone|phone|mobile|tablet|laptop|computer|camera|charger|usb|watch/.test(
        name
      )
    ) {
      suggestedCategory = "Electronics";
    } else if (
      /speaker|headphone|earphone|earbuds|bluetooth|soundbar|audio/.test(
        name
      )
    ) {
      suggestedCategory = "Audio";
    } else if (
      /football|basketball|cricket|bat|ball|sports|fitness|gym/.test(name)
    ) {
      suggestedCategory = "Sports";
    } else if (
      /beauty|makeup|cosmetic|lipstick|cream|perfume|skincare/.test(name)
    ) {
      suggestedCategory = "Beauty";
    } else if (
      /chair|table|kitchen|home|garden|lamp|light|decor/.test(name)
    ) {
      suggestedCategory = "Home & Garden";
    }

    if (!suggestedCategory) {
      return;
    }

    const existingCategory = categories.find(
      (category) =>
        category.toLowerCase() === suggestedCategory.toLowerCase()
    );

    if (existingCategory) {
      setCategoryMode("select");
      setCategoryValue(existingCategory);
    } else {
      setCategoryMode("manual");
      setCategoryValue(suggestedCategory);
    }
  }

  async function addProduct() {
    setLoading(true);
    setError("");
    setSuccess("");

    const name = (
      document.getElementById("name") as HTMLInputElement
    ).value.trim();

    const category = categoryValue.trim();

    const price = Number(priceValue);

    const oldPrice = oldPriceValue
      ? Number(oldPriceValue)
      : null;

    const stock = Number(
      (document.getElementById("stock") as HTMLInputElement).value
    );

    const description = (
      document.getElementById("description") as HTMLTextAreaElement
    ).value.trim();

    const reviews = Number(
      (document.getElementById("reviews") as HTMLInputElement).value || 0
    );

    const featured = (
      document.getElementById("featured") as HTMLInputElement
    ).checked;

    const discountNumber =
      flashDeal && discount
        ? Number(discount)
        : null;

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

    if (
      oldPrice !== null &&
      (!Number.isFinite(oldPrice) || oldPrice < 0)
    ) {
      setError("Please enter a valid old price.");
      setLoading(false);
      return;
    }

    if (
      oldPrice !== null &&
      oldPrice > 0 &&
      price > oldPrice
    ) {
      setError("Sale price cannot be higher than the old price.");
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

    if (!images.image) {
      setError("Main Image is required.");
      setLoading(false);
      return;
    }

    if (!Number.isInteger(reviews) || reviews < 0) {
      setError("Please enter a valid reviews number.");
      setLoading(false);
      return;
    }

    if (flashDeal) {
      if (oldPrice === null || !discountNumber) {
        setError(
          "Flash Deal requires a valid Old Price and Sale Price."
        );
        setLoading(false);
        return;
      }

      if (
        !Number.isInteger(discountNumber) ||
        discountNumber < 1 ||
        discountNumber > 100
      ) {
        setError("Discount must be between 1% and 100%.");
        setLoading(false);
        return;
      }
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
          oldPrice,
          stock,
          description,
          reviews,
          featured,

          flashDeal,
          newArrival,

          discount: flashDeal ? discountNumber : null,

          image: images.image,
          image2: images.image2 || null,
          image3: images.image3 || null,
          image4: images.image4 || null,
          descriptionImage: images.descriptionImage || null,
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
    } catch (requestError) {
      console.error(requestError);

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
              AM Whole Sale Pakistan
            </h1>

            <p className="text-sm text-gray-400">
              Add New Product
            </p>
          </div>

          <Link
            href="/admin/products"
            className="rounded-md bg-gray-700 px-5 py-2 font-semibold transition hover:bg-gray-600"
          >
            Back to Products
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-4xl px-4 py-8">
        <div className="rounded-xl bg-white p-6 shadow-sm md:p-8">
          <h2 className="text-2xl font-bold">
            Add Product
          </h2>

          <p className="mt-2 text-gray-500">
            Enter the details of your new product.
          </p>

          {error && (
            <div className="mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 font-semibold text-red-700">
              {error}
            </div>
          )}

          {success && (
            <div className="mt-6 rounded-lg border border-green-200 bg-green-50 px-4 py-3 font-semibold text-green-700">
              {success}
            </div>
          )}

          <div className="mt-8 space-y-7">
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
                onChange={(event) =>
                  autoSelectCategory(event.target.value)
                }
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
              />
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between">
                <label
                  htmlFor="category"
                  className="block font-semibold"
                >
                  Category
                </label>

                <button
                  type="button"
                  onClick={() => {
                    if (categoryMode === "select") {
                      setCategoryMode("manual");
                      setCategoryValue("");
                    } else {
                      setCategoryMode("select");
                      setCategoryValue("");
                    }
                  }}
                  className="text-sm font-bold text-orange-600 hover:text-orange-700"
                >
                  {categoryMode === "select"
                    ? "+ Add New Category"
                    : "← Select Existing Category"}
                </button>
              </div>

              {categoryMode === "select" ? (
                <select
                  id="category"
                  value={categoryValue}
                  onChange={(event) =>
                    setCategoryValue(event.target.value)
                  }
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                >
                  <option value="">
                    {categories.length > 0
                      ? "Select category"
                      : "No categories found"}
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
              ) : (
                <input
                  id="category"
                  type="text"
                  value={categoryValue}
                  onChange={(event) =>
                    setCategoryValue(event.target.value)
                  }
                  placeholder="Enter new category e.g. Car Accessories"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                />
              )}

              <p className="mt-2 text-sm text-gray-500">
                {categoryMode === "select"
                  ? "Select an existing category or add a new one."
                  : "Enter any new category name. It will automatically appear on the Home Page after saving the product."}
              </p>

              {categoryValue && (
                <div className="mt-3 rounded-lg border border-orange-200 bg-orange-50 px-4 py-3">
                  <span className="text-sm font-semibold text-gray-600">
                    Selected Category:
                  </span>

                  <span className="ml-2 font-bold text-orange-700">
                    {categoryValue}
                  </span>
                </div>
              )}
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label
                  htmlFor="price"
                  className="mb-2 block font-semibold"
                >
                  Sale Price (Rs.)
                </label>

                <input
                  id="price"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  value={priceValue}
                  onChange={(event) => {
                    const newPrice = event.target.value;

                    setPriceValue(newPrice);

                    calculateDiscount(
                      oldPriceValue,
                      newPrice
                    );
                  }}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                />
              </div>

              <div>
                <label
                  htmlFor="oldPrice"
                  className="mb-2 block font-semibold"
                >
                  Old Price (Rs.)
                  <span className="ml-2 text-sm font-normal text-gray-400">
                    Optional
                  </span>
                </label>

                <input
                  id="oldPrice"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="Example: 122000"
                  value={oldPriceValue}
                  onChange={(event) => {
                    const newOldPrice =
                      event.target.value;

                    setOldPriceValue(newOldPrice);

                    calculateDiscount(
                      newOldPrice,
                      priceValue
                    );
                  }}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                />

                {discount && (
                  <p className="mt-2 font-semibold text-green-600">
                    Automatic Discount: {discount}% OFF
                  </p>
                )}
              </div>
            </div>

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
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
              />
            </div>

            <div className="rounded-xl border border-gray-200 bg-gray-50 p-5">
              <h3 className="text-lg font-bold">
                Product Status
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                Choose where this product should appear in the store.
              </p>

              <div className="mt-5 space-y-4">
                <div className="rounded-lg border border-orange-200 bg-white p-5">
                  <div className="flex items-center gap-3">
                    <input
                      id="flashDeal"
                      type="checkbox"
                      checked={flashDeal}
                      onChange={(event) =>
                        setFlashDeal(event.target.checked)
                      }
                      className="h-5 w-5 accent-orange-500"
                    />

                    <label
                      htmlFor="flashDeal"
                      className="font-bold"
                    >
                      🔥 Flash Deal
                    </label>
                  </div>

                  <p className="mt-2 text-sm text-gray-500">
                    Turn this ON to create a special promotional
                    deal for this product.
                  </p>

                  {flashDeal && (
                    <div className="mt-5">
                      <div className="rounded-lg border border-orange-200 bg-orange-50 p-5">
                        <p className="text-sm font-semibold text-gray-600">
                          Promotion Discount
                        </p>

                        <div className="mt-2 flex items-center gap-3">
                          <span className="text-3xl font-extrabold text-orange-600">
                            {discount || "0"}%
                          </span>

                          <span className="font-bold text-gray-600">
                            OFF
                          </span>
                        </div>

                        <p className="mt-2 text-xs text-gray-500">
                          Automatically calculated from Old Price
                          and Sale Price.
                        </p>
                      </div>

                      {discount && (
                        <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-4">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-semibold text-gray-600">
                              Flash Deal
                            </span>

                            <span className="rounded-full bg-red-600 px-3 py-1 text-xs font-extrabold text-white">
                              {discount}% OFF
                            </span>
                          </div>

                          <div className="mt-3 flex items-end gap-3">
                            <span className="text-sm font-semibold text-gray-400 line-through">
                              Rs. {oldPriceValue || "0"}
                            </span>

                            <span className="text-2xl font-black text-red-600">
                              Rs. {priceValue || "0"}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="rounded-lg border border-gray-200 bg-white p-4">
                  <div className="flex items-center gap-3">
                    <input
                      id="newArrival"
                      type="checkbox"
                      checked={newArrival}
                      onChange={(event) =>
                        setNewArrival(event.target.checked)
                      }
                      className="h-5 w-5 accent-orange-500"
                    />

                    <label
                      htmlFor="newArrival"
                      className="font-semibold"
                    >
                      🆕 New Arrival
                    </label>
                  </div>

                  <p className="mt-2 text-sm text-gray-500">
                    Turn this ON if this product should appear in
                    New Arrivals.
                  </p>
                </div>

                <div className="rounded-lg border border-gray-200 bg-white p-4">
                  <div className="flex items-center gap-3">
                    <input
                      id="featured"
                      type="checkbox"
                      className="h-5 w-5 accent-orange-500"
                    />

                    <label
                      htmlFor="featured"
                      className="font-semibold"
                    >
                      ⭐ Featured Product
                    </label>
                  </div>

                  <p className="mt-2 text-sm text-gray-500">
                    Turn this ON if you want to feature this product
                    on the store.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="mb-4 text-lg font-bold">
                Product Images
              </h3>

              <div className="grid gap-6 md:grid-cols-2">
                {imageFields.map((field) => (
                  <div
                    key={field.key}
                    className="rounded-lg border border-gray-200 bg-white p-4"
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
                        resourceType: "image",

                        clientAllowedFormats: [
                          "jpg",
                          "jpeg",
                          "png",
                          "webp",
                          "gif",
                        ],

                        maxFileSize: 5 * 1024 * 1024,

                        multiple: false,

                        folder:
                          "am-wholesale-pakistan/products",

                        sources: [
                          "local",
                          "camera",
                          "url",
                          "google_drive",
                          "dropbox",
                        ],
                      }}
                      onOpen={() => {
                        setError("");
                        setUploading(field.key);
                      }}
                      onSuccess={(result) => {
                        const info =
                          result.info as
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
                            "Image uploaded but Cloudinary did not return the image URL."
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
                          "Cloudinary upload failed. Please check your Cloud Name and Upload Preset."
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
                            loading ||
                            uploading !== null
                          }
                          className="w-full rounded-lg border-2 border-dashed border-gray-300 px-4 py-6 text-sm font-semibold text-gray-700 transition hover:border-orange-500 hover:bg-orange-50 hover:text-orange-600 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {uploading === field.key
                            ? "Opening Upload..."
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
                          className="h-40 w-full rounded-lg border bg-gray-50 object-contain"
                        />

                        <button
                          type="button"
                          onClick={() =>
                            removeImage(field.key)
                          }
                          disabled={
                            loading ||
                            uploading !== null
                          }
                          className="mt-3 rounded-md bg-red-100 px-4 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-200 disabled:opacity-50"
                        >
                          Remove Image
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <p className="mt-3 text-sm text-gray-500">
                Maximum size: 5MB per image.
                JPG, PNG, WEBP and GIF are supported.
              </p>

              <p className="mt-2 text-sm text-gray-400">
                Upload options: Computer, Camera, URL,
                Google Drive and Dropbox.
              </p>
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
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
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
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
              />
            </div>

            <div className="flex flex-col gap-3 border-t pt-6 sm:flex-row">
              <Link
                href="/admin/products"
                className="rounded-lg bg-gray-200 px-6 py-3 text-center font-semibold transition hover:bg-gray-300"
              >
                Cancel
              </Link>

              <button
                type="button"
                onClick={addProduct}
                disabled={
                  loading ||
                  uploading !== null
                }
                className="rounded-lg bg-orange-500 px-6 py-3 font-bold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:bg-gray-400"
              >
                {uploading
                  ? "Uploading Image..."
                  : loading
                    ? "Adding Product..."
                    : "Add Product"}
              </button>
            </div>
          </div>
        </div>
      </section>

      <footer className="mt-10 bg-gray-900 py-8 text-center text-white">
        <p className="text-sm text-gray-400">
          © 2026 AM Whole Sale Pakistan. All rights reserved.
        </p>
      </footer>
    </main>
  );
}