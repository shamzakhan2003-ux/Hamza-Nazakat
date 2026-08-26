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
  {
    key: "descriptionImage",
    label: "Description Image",
  },
];

type CloudinaryInfo = {
  secure_url?: string;
};

export default function NewProductPage() {
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] =
    useState<ImageField | null>(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [images, setImages] =
    useState<Record<ImageField, string>>({
      image: "",
      image2: "",
      image3: "",
      image4: "",
      descriptionImage: "",
    });

  function setImage(
    field: ImageField,
    url: string
  ) {
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

  async function addProduct() {
    setLoading(true);
    setError("");
    setSuccess("");

    const name = (
      document.getElementById(
        "name"
      ) as HTMLInputElement
    ).value.trim();

    const category = (
      document.getElementById(
        "category"
      ) as HTMLInputElement
    ).value.trim();

    const price = Number(
      (
        document.getElementById(
          "price"
        ) as HTMLInputElement
      ).value
    );

    const stock = Number(
      (
        document.getElementById(
          "stock"
        ) as HTMLInputElement
      ).value
    );

    const description = (
      document.getElementById(
        "description"
      ) as HTMLTextAreaElement
    ).value.trim();

    const reviews = Number(
      (
        document.getElementById(
          "reviews"
        ) as HTMLInputElement
      ).value || 0
    );

    const featured = (
      document.getElementById(
        "featured"
      ) as HTMLInputElement
    ).checked;

    // =========================
    // VALIDATION
    // =========================

    if (!name) {
      setError(
        "Product name is required."
      );
      setLoading(false);
      return;
    }

    if (!category) {
      setError(
        "Category is required."
      );
      setLoading(false);
      return;
    }

    if (
      !Number.isFinite(price) ||
      price < 0
    ) {
      setError(
        "Please enter a valid price."
      );
      setLoading(false);
      return;
    }

    if (
      !Number.isInteger(stock) ||
      stock < 0
    ) {
      setError(
        "Please enter a valid stock quantity."
      );
      setLoading(false);
      return;
    }

    if (!description) {
      setError(
        "Description is required."
      );
      setLoading(false);
      return;
    }

    if (!images.image) {
      setError(
        "Main Image is required."
      );
      setLoading(false);
      return;
    }

    if (
      !Number.isInteger(reviews) ||
      reviews < 0
    ) {
      setError(
        "Please enter a valid reviews number."
      );
      setLoading(false);
      return;
    }

    // =========================
    // CREATE PRODUCT
    // =========================

    try {
      const response = await fetch(
        "/api/products",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            name,
            category,
            price,
            stock,
            description,
            reviews,
            featured,

            image: images.image,
            image2:
              images.image2 || null,
            image3:
              images.image3 || null,
            image4:
              images.image4 || null,
            descriptionImage:
              images.descriptionImage ||
              null,
          }),
        }
      );

      const result =
        await response.json();

      if (!response.ok) {
        setError(
          result.error ||
            "Failed to create product."
        );
        setLoading(false);
        return;
      }

      setSuccess(
        "Product added successfully."
      );

      setTimeout(() => {
        window.location.href =
          "/admin/products";
      }, 1000);
    } catch (requestError) {
      console.error(
        requestError
      );

      setError(
        "Something went wrong. Please try again."
      );

      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-gray-100 text-gray-900">

      {/* =========================
          HEADER
      ========================= */}

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

      {/* =========================
          MAIN
      ========================= */}

      <section className="mx-auto max-w-4xl px-4 py-8">

        <div className="rounded-lg bg-white p-6 shadow-sm">

          <h2 className="text-2xl font-bold">
            Add Product
          </h2>

          <p className="mt-2 text-gray-500">
            Enter the details of your new product.
          </p>

          {/* ERROR */}

          {error && (
            <div className="mt-6 rounded-md bg-red-100 px-4 py-3 font-semibold text-red-700">
              {error}
            </div>
          )}

          {/* SUCCESS */}

          {success && (
            <div className="mt-6 rounded-md bg-green-100 px-4 py-3 font-semibold text-green-700">
              {success}
            </div>
          )}

          <div className="mt-8 space-y-6">

            {/* =========================
                PRODUCT NAME
            ========================= */}

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

            {/* =========================
                CATEGORY + PRICE
            ========================= */}

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

            {/* =========================
                STOCK
            ========================= */}

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

            {/* =========================
                PRODUCT IMAGES
            ========================= */}

            <div>

              <h3 className="mb-4 text-lg font-bold">
                Product Images
              </h3>

              <div className="grid gap-6 md:grid-cols-2">

                {imageFields.map(
                  (field) => (
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

                      {/* CLOUDINARY UPLOAD WIDGET */}

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
                          setUploading(
                            field.key
                          );
                        }}

                        onSuccess={(result) => {
                          const info =
                            result.info as
                              | CloudinaryInfo
                              | string
                              | undefined;

                          if (
                            typeof info ===
                              "object" &&
                            info !== null &&
                            typeof info.secure_url ===
                              "string"
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
                            onClick={() =>
                              open()
                            }
                            disabled={
                              loading ||
                              uploading !==
                                null
                            }
                            className="w-full rounded-md border-2 border-dashed border-gray-300 px-4 py-6 text-sm font-semibold text-gray-700 transition hover:border-orange-500 hover:text-orange-600 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {uploading ===
                            field.key
                              ? "Opening Upload..."
                              : images[
                                    field.key
                                  ]
                                ? "Choose Another Image"
                                : "Choose Image"}
                          </button>
                        )}
                      </CldUploadWidget>

                      {/* IMAGE PREVIEW */}

                      {images[field.key] && (
                        <div className="mt-4">

                          <img
                            src={
                              images[
                                field.key
                              ]
                            }
                            alt={
                              field.label
                            }
                            className="h-40 w-full rounded-md border object-contain"
                          />

                          <button
                            type="button"
                            onClick={() =>
                              removeImage(
                                field.key
                              )
                            }
                            disabled={
                              loading ||
                              uploading !==
                                null
                            }
                            className="mt-3 rounded-md bg-red-100 px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-200 disabled:opacity-50"
                          >
                            Remove Image
                          </button>

                        </div>
                      )}

                    </div>
                  )
                )}

              </div>

              <p className="mt-3 text-sm text-gray-500">
                Maximum size: 5MB per image.
                JPG, PNG, WEBP and GIF are
                supported.
              </p>

              <p className="mt-2 text-sm text-gray-400">
                Upload options: Computer,
                Camera, URL, Google Drive and
                Dropbox.
              </p>

            </div>

            {/* =========================
                DESCRIPTION
            ========================= */}

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

            {/* =========================
                REVIEWS
            ========================= */}

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

            {/* =========================
                FEATURED
            ========================= */}

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

            {/* =========================
                BUTTONS
            ========================= */}

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

      {/* =========================
          FOOTER
      ========================= */}

      <footer className="mt-10 bg-gray-900 py-8 text-center text-white">

        <p className="text-sm text-gray-400">
          © 2026 AM Whole Sale UK
        </p>

      </footer>

    </main>
  );
}