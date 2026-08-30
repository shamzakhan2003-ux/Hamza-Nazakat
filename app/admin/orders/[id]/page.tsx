import Link from "next/link";
import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { prisma } from "../../../lib/prisma";
import OrderStatus from "./OrderStatus";
import DeliveryTracking from "./DeliveryTracking";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

const statusStyles: Record<string, string> = {
  Pending:
    "bg-yellow-100 text-yellow-700 border-yellow-200",

  Confirmed:
    "bg-blue-100 text-blue-700 border-blue-200",

  Shipped:
    "bg-purple-100 text-purple-700 border-purple-200",

  "Out for Delivery":
    "bg-orange-100 text-orange-700 border-orange-200",

  Delivered:
    "bg-green-100 text-green-700 border-green-200",

  Cancelled:
    "bg-red-100 text-red-700 border-red-200",
};

export default async function OrderDetailsPage({
  params,
}: PageProps) {
  // =========================
  // ADMIN AUTHENTICATION
  // =========================

  const cookieStore = await cookies();

  const adminSession =
    cookieStore.get("admin_session");

  if (adminSession?.value !== "authenticated") {
    redirect("/admin/login");
  }

  // =========================
  // ORDER ID
  // =========================

  const { id } = await params;

  const orderId = Number(id);

  if (!Number.isInteger(orderId)) {
    notFound();
  }

  // =========================
  // GET ORDER
  // =========================

  const order = await prisma.order.findUnique({
    where: {
      id: orderId,
    },
    include: {
      items: true,
    },
  });

  if (!order) {
    notFound();
  }

  // =========================
  // STATUS STYLE
  // =========================

  const statusClass =
    statusStyles[order.status] ||
    "bg-gray-100 text-gray-700 border-gray-200";

  // =========================
  // SUBTOTAL
  // =========================

  const subtotal = order.items.reduce(
    (sum, item) =>
      sum + Number(item.price) * item.quantity,
    0
  );

  return (
    <main className="min-h-screen bg-gray-100 text-gray-900">

      {/* =========================
          HEADER
      ========================= */}

      <header className="bg-gray-900 text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5">

          <div>
            <h1 className="text-2xl font-bold">
              AM Whole Sale Pakistan
            </h1>

            <p className="text-sm text-gray-400">
              Order Management
            </p>
          </div>

          <Link
            href="/admin"
            className="rounded-md bg-orange-500 px-5 py-2 font-semibold transition hover:bg-orange-600"
          >
            Back to Orders
          </Link>

        </div>
      </header>

      {/* =========================
          MAIN
      ========================= */}

      <section className="mx-auto max-w-7xl px-4 py-8">

        {/* =========================
            ORDER HEADER
        ========================= */}

        <div className="mb-8 rounded-xl bg-white p-6 shadow-sm">

          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">

            <div>

              <p className="text-sm font-medium text-gray-500">
                Order Number
              </p>

              <div className="mt-1 flex flex-wrap items-center gap-3">

                <h2 className="text-3xl font-extrabold tracking-tight">
                  {order.orderNumber}
                </h2>

                <span
                  className={`rounded-full border px-3 py-1 text-sm font-bold ${statusClass}`}
                >
                  {order.status}
                </span>

              </div>

              <p className="mt-2 text-sm text-gray-500">
                Internal Order ID: #{order.id}
              </p>

            </div>

            <div className="text-left md:text-right">

              <p className="text-sm text-gray-500">
                Order Date
              </p>

              <p className="mt-1 font-semibold">
                {new Date(
                  order.createdAt
                ).toLocaleDateString("en-GB")}
              </p>

              <p className="mt-1 text-sm text-gray-500">
                {new Date(
                  order.createdAt
                ).toLocaleTimeString("en-GB", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>

            </div>

          </div>

        </div>

        {/* =========================
            TWO COLUMN LAYOUT
        ========================= */}

        <div className="grid gap-8 lg:grid-cols-3">

          {/* =========================
              LEFT COLUMN
          ========================= */}

          <div className="space-y-8 lg:col-span-2">

            {/* =========================
                CUSTOMER INFORMATION
            ========================= */}

            <div className="rounded-xl bg-white p-6 shadow-sm">

              <div className="border-b pb-4">

                <h3 className="text-xl font-bold">
                  Customer Information
                </h3>

                <p className="mt-1 text-sm text-gray-500">
                  Customer details for this order
                </p>

              </div>

              <div className="mt-6 grid gap-6 md:grid-cols-2">

                <div>
                  <p className="text-sm text-gray-500">
                    Full Name
                  </p>

                  <p className="mt-1 font-semibold">
                    {order.customerName}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">
                    Email
                  </p>

                  <p className="mt-1 break-all font-semibold">
                    {order.email}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">
                    Phone
                  </p>

                  <p className="mt-1 font-semibold">
                    {order.phone}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">
                    City
                  </p>

                  <p className="mt-1 font-semibold">
                    {order.city}
                  </p>
                </div>

                <div className="md:col-span-2">

                  <p className="text-sm text-gray-500">
                    Delivery Address
                  </p>

                  <div className="mt-2 rounded-lg bg-gray-50 p-4">

                    <p className="font-semibold">
                      {order.address}
                    </p>

                    <p className="mt-1 text-sm text-gray-600">
                      {order.city}, {order.postcode}
                    </p>

                  </div>

                </div>

                <div>
                  <p className="text-sm text-gray-500">
                    Postal Code
                  </p>

                  <p className="mt-1 font-semibold">
                    {order.postcode}
                  </p>
                </div>

              </div>

            </div>

            {/* =========================
                ORDERED PRODUCTS
            ========================= */}

            <div className="rounded-xl bg-white shadow-sm">

              <div className="border-b px-6 py-5">

                <h3 className="text-xl font-bold">
                  Ordered Products
                </h3>

                <p className="mt-1 text-sm text-gray-500">
                  {order.items.length} product
                  {order.items.length !== 1
                    ? "s"
                    : ""}{" "}
                  in this order
                </p>

              </div>

              <div className="divide-y">

                {order.items.map((item) => {

                  const itemTotal =
                    Number(item.price) *
                    item.quantity;

                  return (
                    <div
                      key={item.id}
                      className="flex flex-col gap-4 px-6 py-5 sm:flex-row sm:items-center sm:justify-between"
                    >

                      <div className="min-w-0">

                        <p className="font-bold">
                          {item.name}
                        </p>

                        <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-sm text-gray-500">

                          <span>
                            Product ID:{" "}
                            {item.productId}
                          </span>

                          <span>
                            Price: Rs. 
                            {Number(
                              item.price
                            ).toFixed(2)}
                          </span>

                          <span>
                            Quantity:{" "}
                            {item.quantity}
                          </span>

                        </div>

                      </div>

                      <div className="text-left sm:text-right">

                        <p className="text-lg font-bold">
                          Rs. 
                          {itemTotal.toFixed(
                            2
                          )}
                        </p>

                        <p className="text-xs text-gray-500">
                          Item Total
                        </p>

                      </div>

                    </div>
                  );
                })}

              </div>

              {/* =========================
                  TOTAL
              ========================= */}

              <div className="border-t bg-gray-50 px-6 py-6">

                <div className="ml-auto max-w-sm space-y-3">

                  <div className="flex justify-between text-sm">

                    <span className="text-gray-500">
                      Items Subtotal
                    </span>

                    <span className="font-semibold">
                      Rs. 
                      {subtotal.toFixed(2)}
                    </span>

                  </div>

                  <div className="flex justify-between border-t pt-3 text-xl font-extrabold">

                    <span>
                      Order Total
                    </span>

                    <span className="text-orange-500">
                      Rs. 
                      {Number(
                        order.total
                      ).toFixed(2)}
                    </span>

                  </div>

                </div>

              </div>

            </div>

          </div>

          {/* =========================
              RIGHT COLUMN
          ========================= */}

          <div className="space-y-8">

            {/* =========================
                ORDER STATUS
            ========================= */}

            <OrderStatus
              orderId={order.id}
              currentStatus={order.status}
            />

            {/* =========================
                DELIVERY TRACKING
            ========================= */}

            <DeliveryTracking
              orderId={order.id}
              currentCourier={
                order.courier
              }
              currentTrackingNumber={
                order.trackingNumber
              }
              currentTrackingUrl={
                order.trackingUrl
              }
            />

            {/* =========================
                ORDER SUMMARY
            ========================= */}

            <div className="rounded-xl bg-white p-6 shadow-sm">

              <h3 className="text-xl font-bold">
                Order Summary
              </h3>

              <div className="mt-6 space-y-5">

                <div className="flex justify-between gap-4">

                  <span className="text-sm text-gray-500">
                    Order Number
                  </span>

                  <span className="text-right text-sm font-bold">
                    {order.orderNumber}
                  </span>

                </div>

                <div className="flex justify-between gap-4">

                  <span className="text-sm text-gray-500">
                    Order ID
                  </span>

                  <span className="font-semibold">
                    #{order.id}
                  </span>

                </div>

                <div className="flex justify-between gap-4">

                  <span className="text-sm text-gray-500">
                    Products
                  </span>

                  <span className="font-semibold">
                    {order.items.length}
                  </span>

                </div>

                <div className="flex justify-between gap-4">

                  <span className="text-sm text-gray-500">
                    Status
                  </span>

                  <span
                    className={`rounded-full border px-3 py-1 text-xs font-bold ${statusClass}`}
                  >
                    {order.status}
                  </span>

                </div>

                <div className="flex justify-between gap-4 border-t pt-5">

                  <span className="font-bold">
                    Total
                  </span>

                  <span className="text-xl font-extrabold text-orange-500">
                    Rs. 
                    {Number(
                      order.total
                    ).toFixed(2)}
                  </span>

                </div>

              </div>

            </div>

            {/* =========================
                DELIVERY INFORMATION
            ========================= */}

            <div className="rounded-xl bg-white p-6 shadow-sm">

              <h3 className="text-xl font-bold">
                Delivery Information
              </h3>

              <div className="mt-5 rounded-lg bg-gray-50 p-4">

                <p className="font-bold">
                  {order.customerName}
                </p>

                <p className="mt-2 text-sm text-gray-600">
                  {order.address}
                </p>

                <p className="mt-1 text-sm text-gray-600">
                  {order.city}
                </p>

                <p className="mt-1 text-sm font-semibold text-gray-700">
                  {order.postcode}
                </p>

                <div className="mt-4 border-t pt-4">

                  <p className="text-sm text-gray-500">
                    Contact
                  </p>

                  <p className="mt-1 text-sm font-semibold">
                    {order.phone}
                  </p>

                  <p className="mt-1 break-all text-sm font-semibold">
                    {order.email}
                  </p>

                </div>

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* =========================
          FOOTER
      ========================= */}

      <footer className="mt-10 bg-gray-900 py-8 text-center text-white">

        <p className="text-sm text-gray-400">
          © 2026 AM Whole Sale Pakistan. All rights reserved.
        </p>

      </footer>

    </main>
  );
}