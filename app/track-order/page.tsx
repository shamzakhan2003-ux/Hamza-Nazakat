"use client";

import { FormEvent, useState } from "react";

type TrackingData = {
  orderNumber: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  courier: string | null;
  trackingNumber: string | null;
  trackingUrl: string | null;
  trackingHistory: {
    id: number;
    status: string;
    message: string | null;
    createdAt: string;
  }[];
};

const steps = [
  "Pending",
  "Confirmed",
  "Shipped",
  "Out for Delivery",
  "Delivered",
];

const statusLabels: Record<string, string> = {
  Pending: "Order Placed",
  Confirmed: "Confirmed",
  Shipped: "Shipped",
  "Out for Delivery": "Out for Delivery",
  Delivered: "Delivered",
};

export default function TrackOrderPage() {
  const [orderNumber, setOrderNumber] = useState("");
  const [order, setOrder] = useState<TrackingData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleTrack(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!orderNumber.trim()) {
      setError("Please enter your order number.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setOrder(null);

      const response = await fetch(
        `/api/track-order?orderNumber=${encodeURIComponent(
          orderNumber.trim()
        )}`
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Order not found.");
        return;
      }

      setOrder(data);
    } catch (error) {
      console.error(error);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const currentIndex = order
    ? steps.indexOf(order.status)
    : -1;

  return (
    <main className="min-h-screen bg-gray-100 text-gray-900">
      <header className="bg-gray-900 px-4 py-6 text-white">
        <div className="mx-auto max-w-5xl">
          <h1 className="text-2xl font-bold">
            AM Whole Sale UK
          </h1>

          <p className="mt-1 text-sm text-gray-400">
            Track Your Order
          </p>
        </div>
      </header>

      <section className="mx-auto max-w-5xl px-4 py-10">
        <div className="mx-auto max-w-2xl rounded-xl bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-bold">
            Track Your Order
          </h2>

          <p className="mt-2 text-gray-500">
            Enter your order number to see the latest delivery
            status.
          </p>

          <form
            onSubmit={handleTrack}
            className="mt-6 flex flex-col gap-3 sm:flex-row"
          >
            <input
              type="text"
              value={orderNumber}
              onChange={(event) =>
                setOrderNumber(event.target.value)
              }
              placeholder="Enter Order Number"
              className="flex-1 rounded-md border px-4 py-3 outline-none focus:border-orange-500"
            />

            <button
              type="submit"
              disabled={loading}
              className="rounded-md bg-orange-500 px-6 py-3 font-bold text-white hover:bg-orange-600 disabled:bg-gray-400"
            >
              {loading ? "Tracking..." : "Track Order"}
            </button>
          </form>

          {error && (
            <div className="mt-5 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
              {error}
            </div>
          )}
        </div>

        {order && (
          <div className="mt-8 space-y-6">
            <div className="rounded-xl bg-white p-6 shadow-sm">
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                  <p className="text-sm text-gray-500">
                    Order Number
                  </p>

                  <h2 className="mt-1 text-2xl font-extrabold">
                    {order.orderNumber}
                  </h2>
                </div>

                <div className="rounded-full bg-orange-100 px-4 py-2 text-center font-bold text-orange-600">
                  {statusLabels[order.status] || order.status}
                </div>
              </div>
            </div>

            <div className="rounded-xl bg-white p-6 shadow-sm">
              <h3 className="text-xl font-bold">
                Delivery Progress
              </h3>

              <div className="mt-8">
                {steps.map((step, index) => {
                  const completed =
                    currentIndex >= index;

                  const active =
                    currentIndex === index;

                  return (
                    <div
                      key={step}
                      className="relative flex gap-4 pb-8 last:pb-0"
                    >
                      {index !== steps.length - 1 && (
                        <div
                          className={`absolute left-[15px] top-8 h-full w-0.5 ${
                            currentIndex > index
                              ? "bg-green-500"
                              : "bg-gray-200"
                          }`}
                        />
                      )}

                      <div
                        className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                          completed
                            ? "bg-green-500 text-white"
                            : "bg-gray-200 text-gray-500"
                        }`}
                      >
                        {completed ? "✓" : index + 1}
                      </div>

                      <div>
                        <p
                          className={`font-bold ${
                            active
                              ? "text-orange-500"
                              : completed
                              ? "text-gray-900"
                              : "text-gray-400"
                          }`}
                        >
                          {statusLabels[step]}
                        </p>

                        {active && (
                          <p className="mt-1 text-sm text-gray-500">
                            Your order is currently at this stage.
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {(order.courier ||
              order.trackingNumber ||
              order.trackingUrl) && (
              <div className="rounded-xl bg-white p-6 shadow-sm">
                <h3 className="text-xl font-bold">
                  Courier Information
                </h3>

                <div className="mt-5 space-y-4">
                  {order.courier && (
                    <div>
                      <p className="text-sm text-gray-500">
                        Courier
                      </p>
                      <p className="mt-1 font-semibold">
                        {order.courier}
                      </p>
                    </div>
                  )}

                  {order.trackingNumber && (
                    <div>
                      <p className="text-sm text-gray-500">
                        Tracking Number
                      </p>
                      <p className="mt-1 font-semibold">
                        {order.trackingNumber}
                      </p>
                    </div>
                  )}

                  {order.trackingUrl && (
                    <a
                      href={order.trackingUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block rounded-md bg-gray-900 px-5 py-3 font-bold text-white hover:bg-gray-800"
                    >
                      Track on Courier Website
                    </a>
                  )}
                </div>
              </div>
            )}

            {order.trackingHistory.length > 0 && (
              <div className="rounded-xl bg-white p-6 shadow-sm">
                <h3 className="text-xl font-bold">
                  Tracking History
                </h3>

                <div className="mt-5 divide-y">
                  {order.trackingHistory.map((item) => (
                    <div
                      key={item.id}
                      className="py-4"
                    >
                      <div className="flex flex-col justify-between gap-2 sm:flex-row">
                        <div>
                          <p className="font-bold">
                            {statusLabels[item.status] ||
                              item.status}
                          </p>

                          {item.message && (
                            <p className="mt-1 text-sm text-gray-500">
                              {item.message}
                            </p>
                          )}
                        </div>

                        <p className="text-sm text-gray-400">
                          {new Date(
                            item.createdAt
                          ).toLocaleString("en-GB")}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </section>

      <footer className="mt-10 bg-gray-900 py-8 text-center text-white">
        <p className="text-sm text-gray-400">
          © 2026 AM Whole Sale UK. All rights reserved.
        </p>
      </footer>
    </main>
  );
}