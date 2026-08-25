"use client";

import { useState } from "react";

type DeliveryTrackingProps = {
  orderId: number;
  currentCourier: string | null;
  currentTrackingNumber: string | null;
  currentTrackingUrl: string | null;
};

const couriers = [
  "TCS",
  "Leopards Courier",
  "M&P Courier",
  "Pakistan Post",
  "BlueEX",
  "Trax",
  "Rider",
  "Call Courier",
  "PostEx",
  "Other",
];

export default function DeliveryTracking({
  orderId,
  currentCourier,
  currentTrackingNumber,
  currentTrackingUrl,
}: DeliveryTrackingProps) {
  const [courier, setCourier] = useState(
    currentCourier || ""
  );

  const [trackingNumber, setTrackingNumber] =
    useState(currentTrackingNumber || "");

  const [trackingUrl, setTrackingUrl] =
    useState(currentTrackingUrl || "");

  const [loading, setLoading] = useState(false);

  async function saveTracking() {
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
            courier,
            trackingNumber,
            trackingUrl,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(
          data.error ||
            "Failed to save tracking details."
        );
        return;
      }

      alert(
        "Delivery tracking details saved successfully."
      );

      window.location.reload();
    } catch (error) {
      console.error(
        "Tracking update error:",
        error
      );

      alert("Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-xl bg-white p-6 shadow-sm">

      <h3 className="text-xl font-bold">
        Delivery Tracking
      </h3>

      <p className="mt-1 text-sm text-gray-500">
        Add courier and tracking information for
        this order.
      </p>

      {/* COURIER */}
      <div className="mt-6">

        <label
          htmlFor="courier"
          className="mb-2 block text-sm font-semibold"
        >
          Courier
        </label>

        <select
          id="courier"
          value={courier}
          onChange={(event) =>
            setCourier(event.target.value)
          }
          className="w-full rounded-md border border-gray-300 bg-white px-4 py-3 outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
        >
          <option value="">
            Select Courier
          </option>

          {couriers.map((name) => (
            <option
              key={name}
              value={name}
            >
              {name}
            </option>
          ))}
        </select>

      </div>

      {/* TRACKING NUMBER */}
      <div className="mt-5">

        <label
          htmlFor="tracking-number"
          className="mb-2 block text-sm font-semibold"
        >
          Tracking Number
        </label>

        <input
          id="tracking-number"
          type="text"
          value={trackingNumber}
          onChange={(event) =>
            setTrackingNumber(
              event.target.value
            )
          }
          placeholder="e.g. 123456789"
          className="w-full rounded-md border border-gray-300 px-4 py-3 outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
        />

      </div>

      {/* TRACKING URL */}
      <div className="mt-5">

        <label
          htmlFor="tracking-url"
          className="mb-2 block text-sm font-semibold"
        >
          Tracking URL
        </label>

        <input
          id="tracking-url"
          type="url"
          value={trackingUrl}
          onChange={(event) =>
            setTrackingUrl(
              event.target.value
            )
          }
          placeholder="https://..."
          className="w-full rounded-md border border-gray-300 px-4 py-3 outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
        />

      </div>

      {/* CURRENT DETAILS */}
      {(courier || trackingNumber) && (
        <div className="mt-5 rounded-lg bg-gray-50 p-4">

          <p className="text-sm font-semibold text-gray-700">
            Current Delivery Details
          </p>

          {courier && (
            <p className="mt-2 text-sm text-gray-600">
              <span className="font-semibold">
                Courier:
              </span>{" "}
              {courier}
            </p>
          )}

          {trackingNumber && (
            <p className="mt-1 text-sm text-gray-600">
              <span className="font-semibold">
                Tracking:
              </span>{" "}
              {trackingNumber}
            </p>
          )}

        </div>
      )}

      {/* SAVE BUTTON */}
      <button
        type="button"
        onClick={saveTracking}
        disabled={loading}
        className="mt-6 w-full rounded-md bg-orange-500 py-3 font-bold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:bg-gray-400"
      >
        {loading
          ? "Saving..."
          : "Save Tracking Details"}
      </button>

    </div>
  );
}