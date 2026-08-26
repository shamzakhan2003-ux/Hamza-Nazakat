"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type OrderItem = {
  id: number;
  name: string;
  quantity: number;
  price: string;
};

type Tracking = {
  id: number;
  status: string;
  message: string | null;
  createdAt: string;
};

type Order = {
  id: number;
  orderNumber: string | null;
  total: string;
  status: string;
  createdAt: string;
  courier: string | null;
  trackingNumber: string | null;
  trackingUrl: string | null;
  items: OrderItem[];
  trackingHistory: Tracking[];
};

type Customer = {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  mobileVerified: boolean;
};

export default function AccountPage() {
  const router = useRouter();

  const [customer, setCustomer] =
    useState<Customer | null>(null);

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    async function loadAccount() {
      try {
        const customerResponse = await fetch(
          "/api/customer/me",
          {
            cache: "no-store",
          }
        );

        const customerData =
          await customerResponse.json();

        if (
          !customerResponse.ok ||
          !customerData.loggedIn
        ) {
          router.push("/login");
          return;
        }

        setCustomer(customerData.customer);

        const ordersResponse = await fetch(
          "/api/customer/orders",
          {
            cache: "no-store",
          }
        );

        const ordersData =
          await ordersResponse.json();

        if (ordersResponse.ok) {
          setOrders(ordersData.orders || []);
        }
      } catch (error) {
        console.error(
          "Account loading error:",
          error
        );

        router.push("/login");
      } finally {
        setLoading(false);
      }
    }

    loadAccount();
  }, [router]);

  async function handleLogout() {
    try {
      setLoggingOut(true);

      const response = await fetch(
        "/api/customer/logout",
        {
          method: "POST",
        }
      );

      if (!response.ok) {
        throw new Error("Logout failed");
      }

      router.push("/");
      router.refresh();
    } catch (error) {
      console.error("Logout error:", error);
      alert("Unable to logout. Please try again.");
      setLoggingOut(false);
    }
  }

  function formatDate(date: string) {
    return new Date(date).toLocaleDateString(
      "en-GB",
      {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }
    );
  }

  function statusClass(status: string) {
    const normalized =
      status.toLowerCase();

    if (normalized === "delivered") {
      return "bg-green-100 text-green-700";
    }

    if (
      normalized === "cancelled" ||
      normalized === "canceled"
    ) {
      return "bg-red-100 text-red-700";
    }

    if (
      normalized === "shipped" ||
      normalized === "out for delivery"
    ) {
      return "bg-blue-100 text-blue-700";
    }

    if (normalized === "confirmed") {
      return "bg-orange-100 text-orange-700";
    }

    return "bg-gray-100 text-gray-700";
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-100 p-8">
        <div className="mx-auto max-w-6xl">
          <p className="text-gray-600">
            Loading your account...
          </p>
        </div>
      </main>
    );
  }

  if (!customer) {
    return null;
  }

  return (
    <main className="min-h-screen bg-gray-100 text-gray-900">
      {/* Header */}
      <header className="border-b bg-white shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5">
          <button
            type="button"
            onClick={() => router.push("/")}
            className="text-2xl font-extrabold"
          >
            AM Whole Sale{" "}
            <span className="text-orange-500">
              UK
            </span>
          </button>

          <button
            type="button"
            onClick={handleLogout}
            disabled={loggingOut}
            className="rounded-md bg-gray-900 px-5 py-2 font-semibold text-white hover:bg-gray-800 disabled:bg-gray-400"
          >
            {loggingOut
              ? "Logging out..."
              : "Logout"}
          </button>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-4 py-8">
        {/* Profile */}
        <div className="rounded-xl bg-white p-6 shadow-sm">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
            <div>
              <p className="text-sm text-gray-500">
                Welcome back
              </p>

              <h1 className="mt-1 text-3xl font-bold">
                {customer.fullName}
              </h1>
            </div>

            {customer.mobileVerified && (
              <div className="w-fit rounded-full bg-green-100 px-4 py-2 text-sm font-semibold text-green-700">
                ✓ Mobile Verified
              </div>
            )}
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="rounded-lg bg-gray-50 p-4">
              <p className="text-sm text-gray-500">
                Email
              </p>

              <p className="mt-1 font-semibold">
                {customer.email}
              </p>
            </div>

            <div className="rounded-lg bg-gray-50 p-4">
              <p className="text-sm text-gray-500">
                Mobile
              </p>

              <p className="mt-1 font-semibold">
                {customer.phone}
              </p>
            </div>
          </div>
        </div>

        {/* Orders */}
        <div className="mt-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">
                My Orders
              </h2>

              <p className="mt-1 text-gray-500">
                {orders.length}{" "}
                {orders.length === 1
                  ? "order"
                  : "orders"}{" "}
                found
              </p>
            </div>
          </div>

          {orders.length === 0 ? (
            <div className="mt-5 rounded-xl bg-white p-10 text-center shadow-sm">
              <div className="text-5xl">
                🛒
              </div>

              <h3 className="mt-4 text-xl font-bold">
                No orders yet
              </h3>

              <p className="mt-2 text-gray-500">
                Start shopping and your orders
                will appear here.
              </p>

              <button
                type="button"
                onClick={() =>
                  router.push("/products")
                }
                className="mt-6 rounded-md bg-orange-500 px-6 py-3 font-bold text-white hover:bg-orange-600"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            <div className="mt-5 space-y-5">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="rounded-xl bg-white p-5 shadow-sm"
                >
                  <div className="flex flex-col justify-between gap-4 border-b pb-4 sm:flex-row sm:items-center">
                    <div>
                      <p className="text-sm text-gray-500">
                        Order Number
                      </p>

                      <p className="font-bold">
                        {order.orderNumber ||
                          `Order #${order.id}`}
                      </p>

                      <p className="mt-1 text-sm text-gray-500">
                        {formatDate(
                          order.createdAt
                        )}
                      </p>
                    </div>

                    <div className="sm:text-right">
                      <p className="text-lg font-bold">
                        £
                        {Number(
                          order.total
                        ).toFixed(2)}
                      </p>

                      <span
                        className={`mt-2 inline-block rounded-full px-3 py-1 text-xs font-bold ${statusClass(
                          order.status
                        )}`}
                      >
                        {order.status}
                      </span>
                    </div>
                  </div>

                  <div className="py-4">
                    {order.items.map(
                      (item) => (
                        <div
                          key={item.id}
                          className="flex justify-between gap-4 py-2"
                        >
                          <div>
                            <p className="font-semibold">
                              {item.name}
                            </p>

                            <p className="text-sm text-gray-500">
                              Qty:{" "}
                              {item.quantity}
                            </p>
                          </div>

                          <p className="font-semibold">
                            £
                            {(
                              Number(
                                item.price
                              ) *
                              item.quantity
                            ).toFixed(2)}
                          </p>
                        </div>
                      )
                    )}
                  </div>

                  {order.trackingNumber && (
                    <div className="rounded-lg bg-gray-50 p-4">
                      <p className="text-sm font-semibold">
                        Tracking
                      </p>

                      <p className="mt-1 text-sm">
                        {order.courier ||
                          "Courier"}{" "}
                        —{" "}
                        {order.trackingNumber}
                      </p>

                      {order.trackingUrl && (
                        <a
                          href={
                            order.trackingUrl
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-2 inline-block text-sm font-semibold text-orange-500 hover:underline"
                        >
                          Track Shipment →
                        </a>
                      )}
                    </div>
                  )}

                  <div className="mt-4">
                    <button
                      type="button"
                      onClick={() =>
                        router.push(
                          `/track-order?order=${encodeURIComponent(
                            order.orderNumber ||
                              String(order.id)
                          )}`
                        )
                      }
                      className="rounded-md border border-gray-300 px-5 py-2 text-sm font-semibold hover:border-orange-500 hover:text-orange-500"
                    >
                      View Tracking
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <footer className="mt-10 bg-gray-900 py-8 text-center text-sm text-gray-400">
        © 2026 AM Whole Sale UK. All rights reserved.
      </footer>
    </main>
  );
}