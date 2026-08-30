import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "../lib/prisma";
import LogoutButton from "./LogoutButton";
import OrderTable from "./OrderTable";

export default async function AdminPage() {
  const cookieStore = await cookies();
  const adminSession = cookieStore.get("admin_session");

  if (adminSession?.value !== "authenticated") {
    redirect("/admin/login");
  }

  const orders = await prisma.order.findMany({
    include: {
      items: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const totalOrders = orders.length;

  const pendingOrders = orders.filter(
    (order) => order.status === "Pending"
  ).length;

  const confirmedOrders = orders.filter(
    (order) => order.status === "Confirmed"
  ).length;

  const shippedOrders = orders.filter(
    (order) => order.status === "Shipped"
  ).length;

  const deliveredOrders = orders.filter(
    (order) => order.status === "Delivered"
  ).length;

  const cancelledOrders = orders.filter(
    (order) => order.status === "Cancelled"
  ).length;

  const totalSales = orders
    .filter((order) => order.status !== "Cancelled")
    .reduce((sum, order) => sum + Number(order.total), 0);

  const serializedOrders = orders.map((order) => ({
    id: order.id,
    orderNumber: order.orderNumber,
    customerName: order.customerName,
    email: order.email,
    phone: order.phone,
    total: Number(order.total),
    status: order.status,
    createdAt: order.createdAt.toISOString(),
    itemsCount: order.items.length,
  }));

  return (
    <main className="min-h-screen bg-slate-100 text-slate-900">
      {/* HEADER */}
      <header className="sticky top-0 z-20 border-b border-slate-800 bg-slate-950 text-white shadow-lg">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <div>
            <h1 className="text-xl font-extrabold tracking-tight sm:text-2xl">
              AM Whole Sale Pakistan
            </h1>

            <p className="mt-0.5 text-xs font-medium text-slate-400 sm:text-sm">
              Admin Control Panel
            </p>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/"
              className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm font-semibold text-white transition hover:bg-slate-700 sm:px-4"
            >
              View Store
            </Link>

            <LogoutButton />
          </div>
        </div>
      </header>

      {/* MAIN */}
      <section className="mx-auto max-w-7xl px-4 py-7 sm:px-6 lg:px-8">
        {/* TITLE */}
        <div className="mb-7">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="mb-1 text-sm font-bold uppercase tracking-wider text-orange-600">
                Overview
              </p>

              <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
                Admin Dashboard
              </h2>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
                Manage your store, customer orders and sales from one place.
              </p>
            </div>

            <Link
              href="/admin/products"
              className="inline-flex w-fit items-center rounded-lg bg-orange-500 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-orange-600"
            >
              Manage Products
            </Link>
          </div>
        </div>

        {/* SUMMARY CARDS */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {/* TOTAL */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-500">
                Total Orders
              </p>

              <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-lg">
                #
              </span>
            </div>

            <p className="mt-4 text-3xl font-extrabold text-slate-900">
              {totalOrders}
            </p>

            <p className="mt-1 text-xs font-medium text-slate-400">
              All orders
            </p>
          </div>

          {/* PENDING */}
          <div className="rounded-2xl border border-yellow-200 bg-yellow-50 p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-yellow-700">
                Pending
              </p>

              <span className="text-lg">⏳</span>
            </div>

            <p className="mt-4 text-3xl font-extrabold text-yellow-800">
              {pendingOrders}
            </p>

            <p className="mt-1 text-xs font-medium text-yellow-600">
              Awaiting confirmation
            </p>
          </div>

          {/* CONFIRMED */}
          <div className="rounded-2xl border border-blue-200 bg-blue-50 p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-blue-700">
                Confirmed
              </p>

              <span className="text-lg">✓</span>
            </div>

            <p className="mt-4 text-3xl font-extrabold text-blue-800">
              {confirmedOrders}
            </p>

            <p className="mt-1 text-xs font-medium text-blue-600">
              Confirmed orders
            </p>
          </div>

          {/* SHIPPED */}
          <div className="rounded-2xl border border-purple-200 bg-purple-50 p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-purple-700">
                Shipped
              </p>

              <span className="text-lg">📦</span>
            </div>

            <p className="mt-4 text-3xl font-extrabold text-purple-800">
              {shippedOrders}
            </p>

            <p className="mt-1 text-xs font-medium text-purple-600">
              On the way
            </p>
          </div>

          {/* DELIVERED */}
          <div className="rounded-2xl border border-green-200 bg-green-50 p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-green-700">
                Delivered
              </p>

              <span className="text-lg">✓</span>
            </div>

            <p className="mt-4 text-3xl font-extrabold text-green-800">
              {deliveredOrders}
            </p>

            <p className="mt-1 text-xs font-medium text-green-600">
              Successfully delivered
            </p>
          </div>

          {/* CANCELLED */}
          <div className="rounded-2xl border border-red-200 bg-red-50 p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-red-700">
                Cancelled
              </p>

              <span className="text-lg">×</span>
            </div>

            <p className="mt-4 text-3xl font-extrabold text-red-800">
              {cancelledOrders}
            </p>

            <p className="mt-1 text-xs font-medium text-red-600">
              Cancelled orders
            </p>
          </div>
        </div>

        {/* SALES */}
        <div className="mt-5 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-5 p-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                Total Sales
              </p>

              <p className="mt-2 text-3xl font-extrabold tracking-tight text-green-600 sm:text-4xl">
                Rs. {totalSales.toFixed(2)}
              </p>

              <p className="mt-1 text-sm text-slate-500">
                Revenue from all non-cancelled orders
              </p>
            </div>

            <div className="flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 px-5 py-4">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-green-100 text-lg font-bold text-green-700">
                ✓
              </span>

              <div>
                <p className="text-sm font-bold text-green-800">
                  Sales Active
                </p>

                <p className="text-xs text-green-700">
                  Cancelled orders excluded
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ORDERS */}
        <div className="mt-7">
          <OrderTable orders={serializedOrders} />
        </div>
      </section>

      {/* FOOTER */}
      <footer className="mt-10 border-t border-slate-800 bg-slate-950 py-7 text-center">
        <p className="text-sm font-medium text-slate-400">
          © 2026 AM Whole Sale Pakistan. All rights reserved.
        </p>
      </footer>
    </main>
  );
}