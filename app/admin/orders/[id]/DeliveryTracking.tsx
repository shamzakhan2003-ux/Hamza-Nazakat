"use client";

import { useState } from "react";

type DeliveryTrackingProps = {
  orderId: number;
  currentCourier: string | null;
  currentTrackingNumber: string | null;
  currentTrackingUrl: string | null;
};

const couriers = [
  "Royal Mail",
  "Evri",
  "DPD",
  "Yodel",
  "Parcelforce",
  "Amazon Logistics",
  "Other",
];

function getCourierTrackingUrl(
  courier: string,
  trackingNumber: string
) {
  const number = encodeURIComponent(
    trackingNumber.trim()
  );

  if (!number) {
    return "";
  }

  switch (courier) {
    case "Royal Mail":
      return "https://www.royalmail.com/track-your-item";

    case "Evri":
      return "https://www.evri.com/track-a-parcel";

    case "DPD":
      return "https://q2-tracking.dpd.co.uk/";

    case "Yodel":
      return "https://www.yodel.co.uk/home";

    case "Parcelforce":
      return "https://www.royalmail.com/track-your-item";



    default:
      return "";
  }
}

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

  function handleCourierChange(
    value: string
  ) {
    setCourier(value);

    if (trackingNumber) {
      const generatedUrl =
        getCourierTrackingUrl(
          value,
          trackingNumber
        );

      if (generatedUrl) {
        setTrackingUrl(generatedUrl);
      }
    }
  }

  function handleTrackingNumberChange(
    value: string
  ) {
    setTrackingNumber(value);

    if (courier) {
      const generatedUrl =
        getCourierTrackingUrl(
          courier,
          value
        );

      if (generatedUrl) {
        setTrackingUrl(generatedUrl);
      }
    }
  }

  async function saveTracking() {
    if (!courier) {
      alert("Please select a courier.");
      return;
    }

    if (!trackingNumber.trim()) {
      alert("Please enter a tracking number.");
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
            courier,
            trackingNumber:
              trackingNumber.trim(),
            trackingUrl:
              trackingUrl.trim() || null,
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

  const generatedUrl =
    getCourierTrackingUrl(
      courier,
      trackingNumber
    );

  return (
    <div className="rounded-xl bg-white p-6 shadow-sm">

      <h3 className="text-xl font-bold">
        Delivery Tracking
      </h3>

      <p className="mt-1 text-sm text-gray-500">
        Add courier and tracking information
        for this order.
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
            handleCourierChange(
              event.target.value
            )
          }
          disabled={loading}
          className="w-full rounded-md border border-gray-300 bg-white px-4 py-3 outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 disabled:bg-gray-100"
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
            handleTrackingNumberChange(
              event.target.value
            )
          }
          disabled={loading}
          placeholder="e.g. 123456789"
          className="w-full rounded-md border border-gray-300 px-4 py-3 outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 disabled:bg-gray-100"
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
          disabled={loading}
          placeholder="Automatically generated"
          className="w-full rounded-md border border-gray-300 px-4 py-3 outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 disabled:bg-gray-100"
        />

        {generatedUrl &&
          !trackingUrl && (
            <p className="mt-2 text-xs text-gray-500">
              Tracking link will be generated
              automatically.
            </p>
          )}

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

          {trackingUrl && (
            <a
              href={trackingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-block text-sm font-semibold text-orange-600 hover:text-orange-700 hover:underline"
            >
              Track on Courier Website ?
            </a>
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
