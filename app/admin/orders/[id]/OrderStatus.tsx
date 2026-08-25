"use client";

import { useState } from "react";

type OrderStatusProps = {
  orderId: number;
  currentStatus: string;
};

const statuses = [
  "Pending",
  "Confirmed",
  "Shipped",
  "Out for Delivery",
  "Delivered",
  "Cancelled",
];

export default function OrderStatus({
  orderId,
  currentStatus,
}: OrderStatusProps) {
  const [status, setStatus] = useState(currentStatus);
  const [loading, setLoading] = useState(false);

  async function updateStatus() {
    if (status === currentStatus) {
      alert("Please select a different status.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `/api/orders/${orderId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Failed to update status.");
        return;
      }

      alert("Order status and tracking history updated.");

      window.location.reload();
    } catch (error) {
      console.error("Status update error:", error);
      alert("Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="h-fit rounded-xl bg-white p-6 shadow-sm">
      <h3 className="text-xl font-bold">
        Order Status
      </h3>

      <p className="mt-3 text-sm text-gray-500">
        Current Status
      </p>

      <div className="mt-2 rounded-md bg-orange-100 px-4 py-3 text-center font-bold text-orange-600">
        {currentStatus}
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
          onChange={(event) =>
            setStatus(event.target.value)
          }
          disabled={loading}
          className="w-full rounded-md border px-4 py-3 outline-none focus:border-orange-500 disabled:bg-gray-100"
        >
          {statuses.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>

        <button
          type="button"
          onClick={updateStatus}
          disabled={
            loading || status === currentStatus
          }
          className="mt-4 w-full rounded-md bg-orange-500 py-3 font-bold text-white hover:bg-orange-600 disabled:cursor-not-allowed disabled:bg-gray-400"
        >
          {loading
            ? "Updating..."
            : status === currentStatus
            ? "No Changes"
            : "Update Status"}
        </button>
      </div>
    </div>
  );
}