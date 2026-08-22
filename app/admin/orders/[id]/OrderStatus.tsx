"use client";

import { useState } from "react";

type OrderStatusProps = {
  orderId: number;
  currentStatus: string;
};

export default function OrderStatus({
  orderId,
  currentStatus,
}: OrderStatusProps) {
  const [status, setStatus] = useState(currentStatus);
  const [loading, setLoading] = useState(false);

  async function updateStatus() {
    try {
      setLoading(true);

      const response = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Failed to update status.");
        return;
      }

      alert("Order status updated successfully.");

      window.location.reload();
    } catch (error) {
      console.error("Status update error:", error);
      alert("Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="h-fit rounded-lg bg-white p-6 shadow-sm">

      <h3 className="text-xl font-bold">
        Order Status
      </h3>

      <p className="mt-3 text-sm text-gray-500">
        Current Status
      </p>

      <div className="mt-2 rounded-md bg-orange-100 px-4 py-3 text-center font-bold text-orange-600">
        {status}
      </div>

      <div className="mt-6">

        <label
          htmlFor="order-status"
          className="mb-2 block font-semibold"
        >
          Change Status
        </label>

        <select
          id="order-status"
          value={status}
          onChange={(event) => setStatus(event.target.value)}
          className="w-full rounded-md border px-4 py-3 outline-none focus:border-orange-500"
        >
          <option value="Pending">
            Pending
          </option>

          <option value="Confirmed">
            Confirmed
          </option>

          <option value="Shipped">
            Shipped
          </option>

          <option value="Delivered">
            Delivered
          </option>

          <option value="Cancelled">
            Cancelled
          </option>
        </select>

        <button
          type="button"
          onClick={updateStatus}
          disabled={loading}
          className="mt-4 w-full rounded-md bg-orange-500 py-3 font-bold text-white hover:bg-orange-600 disabled:cursor-not-allowed disabled:bg-gray-400"
        >
          {loading ? "Updating..." : "Update Status"}
        </button>

      </div>

    </div>
  );
}