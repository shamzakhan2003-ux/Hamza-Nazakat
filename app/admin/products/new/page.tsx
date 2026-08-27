"use client";

import Link from "next/link";
import { CldUploadWidget } from "next-cloudinary";
import { useState } from "react";

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

  function calculateDiscount(
    oldPrice: string,
    currentPrice: string
  ) {
    const oldPriceNumber = Number(oldPrice);
    const currentPriceNumber = Number(currentPrice);

    if (
      oldPriceNumber > 0 &&
      currentPriceNumber >= 0 &&
      currentPriceNumber < oldPriceNumber
    ) {
      const calculatedDiscount = Math.round(
        ((oldPriceNumber - currentPriceNumber) /
          oldPriceNumber) *
          100
      );

      setDiscount(String(calculatedDiscount));
    } else {
      setDiscount("");
    }
  }

  function autoSelectCategory(value: string) {
    const name = value.toLowerCase();

    let category = "Other";

    if (
      /toy|toys|aeroplane|airplane|doll|puzzle|game|lego|car toy|robot|kids/.test(name)
    ) {
      category = "Toys";
    } else if (
      /iphone|phone|mobile|tablet|laptop|computer|camera|charger|usb|watch/.test(name)
    ) {
      category = "Electronics";
    } else if (
      /speaker|headphone|earphone|earbuds|bluetooth|soundbar|audio/.test(name)
    ) {
      category = "Audio";
    } else if (
      /football|basketball|cricket|bat|ball|sports|fitness|gym/.test(name)
    ) {
      category = "Sports";
    } else if (
      /beauty|makeup|cosmetic|lipstick|cream|perfume|skincare/.test(name)
    ) {
      category = "Beauty";
    } else if (
      /chair|table|kitchen|home|garden|lamp|light|decor/.test(name)
    ) {
      category = "Home & Garden";
    }

    const categoryElement = document.getElementById(
      "category"
    ) as HTMLSelectElement | null;

    if (categoryElement) {
      categoryElement.value = category;
    }
  }
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

    const discountNumber = discount
      ? Number(discount)
      : null;

    // =========================
    // VALIDATION
    // =========================

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
      setError("Price cannot be higher than the old price.");
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

    if (
      discountNumber !== null &&
      (!Number.isInteger(discountNumber) ||
        discountNumber < 1 ||
        discountNumber > 100)
    ) {
      setError("Discount must be between 1% and 100%.");
      setLoading(false);
      return;
    }

    if (flashDeal && discountNumber === null) {
      setError(
        "Please enter a valid old price and sale price for the Flash Deal."
      );
      setLoading(false);
      return;
    }

    // =========================
    // CREATE PRODUCT
    // =========================

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
          discount: discountNumber,

          image: images.image,
          image2: images.image2 || null,
          image3: images.image3 || null,
          image4: images.image4 || null,
          descriptionImage:
            images.descriptionImage || null,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(
          result.error || "Failed to create product."
        );
        setLoading(false);
        return;
      }

      setSuccess("Product added successfully.");

      setTimeout(() => {
        window.location.href = "/admin/products";
      }, 1000);
    } catch (requestError) {
      console.error(requestError);

      setError(
        "Something went wrong. Please try again."
      );

      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-gray-100 text-gray-900">

      {/* HEADER */}

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

      {/* MAIN */}

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
                placeholder="Enter product name"
                onChange={(event) =>
                  autoSelectCategory(event.target.value)
                }
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

                <select
                  id="category"
                  defaultValue=""
                  className="w-full rounded-md border bg-white px-4 py-3 outline-none focus:border-orange-500"
                >
                  <option value="">Select category</option>
                  <option value="Toys">Toys</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Audio">Audio</option>
                  <option value="Home & Garden">Home & Garden</option>
                  <option value="Sports">Sports</option>
                  <option value="Beauty">Beauty</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="price"
                  className="mb-2 block font-semibold"
                >
                  Price (Â£)
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
                Old Price (Â£)

                <span className="ml-2 text-sm font-normal text-gray-400">
                  Optional
                </span>
              </label>

              <input
                id="oldPrice"
                type="number"
                step="0.01"
                min="0"
                placeholder="Example: 199.99"
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
                placeholder="0"
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
                      onChange={(event) =>
                        setFlashDeal(event.target.checked)
                      }
                      className="h-5 w-5"
                    />

                    <label
                      htmlFor="flashDeal"
                      className="font-semibold"
                    >
                      ðŸ”¥ Flash Deal
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
                          readOnly
                          placeholder="Auto calculated"
                          className="w-full bg-gray-100 px-4 py-3 outline-none"
                        />

                        <span className="flex items-center bg-gray-100 px-4 font-bold">
                          %
                        </span>

                      </div>

                      <p className="mt-2 text-xs text-gray-500">
                        Automatically calculated from Old Price and Price.
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
                      onChange={(event) =>
                        setNewArrival(event.target.checked)
                      }
                      className="h-5 w-5"
                    />

                    <label
                      htmlFor="newArrival"
                      className="font-semibold"
                    >
                      ðŸ†• New Arrival
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
                      className="h-5 w-5"
                    />

                    <label
                      htmlFor="featured"
                      className="font-semibold"
                    >
                      â­ Featured Product
                    </label>

                  </div>

                  <p className="mt-2 text-sm text-gray-500">
                    Turn this ON if you want to feature this product on the store.
                  </p>

                </div>

              </div>

            </div>

            {/* PRODUCT IMAGES */}

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
                        resourceType: "image",

                        clientAllowedFormats: [
                          "jpg",
                          "jpeg",
                          "png",
                          "webp",
                          "gif",
                        ],

                        maxFileSize:
                          5 * 1024 * 1024,

                        multiple: false,

                        folder:
                          "am-wholesale-uk/products",

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
                          className="w-full rounded-md border-2 border-dashed border-gray-300 px-4 py-6 text-sm font-semibold text-gray-700 transition hover:border-orange-500 hover:text-orange-600 disabled:cursor-not-allowed disabled:opacity-50"
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
                          className="h-40 w-full rounded-md border object-contain"
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
                Maximum size: 5MB per image.
                JPG, PNG, WEBP and GIF are supported.
              </p>

              <p className="mt-2 text-sm text-gray-400">
                Upload options: Computer, Camera, URL,
                Google Drive and Dropbox.
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
                rows={5}
                placeholder="Enter product description"
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
                defaultValue="0"
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
                onClick={addProduct}
                disabled={
                  loading ||
                  uploading !== null
                }
                className="rounded-md bg-orange-500 px-6 py-3 font-bold text-white hover:bg-orange-600 disabled:cursor-not-allowed disabled:bg-gray-400"
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

      {/* FOOTER */}

      <footer className="mt-10 bg-gray-900 py-8 text-center text-white">

        <p className="text-sm text-gray-400">
          Â© 2026 AM Whole Sale UK
        </p>

      </footer>

    </main>
  );
}


