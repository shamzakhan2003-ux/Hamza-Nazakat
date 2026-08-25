"use client";

import { useState } from "react";

export default function DeleteButton({
  productId,
}: {
  productId: number;
}) {
  const [loading, setLoading] = useState(false);

  async function deleteProduct() {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmed) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Failed to delete product.");
        setLoading(false);
        return;
      }

      window.location.reload();
    } catch (error) {
      console.error(error);
      alert("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={deleteProduct}
      disabled={loading}
      className="rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-gray-400"
    >
      {loading ? "Deleting..." : "Delete"}
    </button>
  );
}