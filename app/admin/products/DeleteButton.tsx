"use client";

import { useState } from "react";

type DeleteButtonProps = {
  productId: number;
  onDeleted?: () => void;
};

export default function DeleteButton({
  productId,
  onDeleted,
}: DeleteButtonProps) {
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeleting(true);

      const response = await fetch(`/api/products/${productId}`, {
        method: "DELETE",
      });

      const text = await response.text();

      let result: unknown = null;

      if (text.trim()) {
        try {
          result = JSON.parse(text);
        } catch {
          result = null;
        }
      }

      if (!response.ok) {
        const errorMessage =
          typeof result === "object" &&
          result !== null &&
          "error" in result &&
          typeof result.error === "string"
            ? result.error
            : "Failed to delete product.";

        throw new Error(errorMessage);
      }

      if (onDeleted) {
        onDeleted();
      }
    } catch (error) {
      console.error("Delete product error:", error);

      const message =
        error instanceof Error
          ? error.message
          : "Failed to delete product.";

      window.alert(message);
    } finally {
      setDeleting(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={deleting}
      className="rounded-md bg-red-100 px-3 py-2 text-sm font-bold text-red-700 transition hover:bg-red-200 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {deleting ? "Deleting..." : "Delete"}
    </button>
  );
}
