import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "../lib/prisma";
import LogoutButton from "./LogoutButton";
import OrderTable from "./OrderTable";

export default async function AdminPage() {
  // Check admin session
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
    (order) =>
      order.status === "Delivered"
  ).length;

  const cancelledOrders = orders.filter(
    (order) =>
      order.status === "Cancelled"
  ).length;

  const totalSales = orders
    .filter(
      (order) =>
        order.status !== "Cancelled"
    )
    .reduce(
      (sum, order) =>
        sum + Number(order.total),
      0
    );

  const serializedOrders = orders.map(
    (order) => ({
      id: order.id,
      orderNumber: order.orderNumber,
      customerName: order.customerName,
      email: order.email,
      phone: order.phone,
      total: Number(order.total),
      status: order.status,
      createdAt:
        order.createdAt.toISOString(),
      itemsCount: order.items.length,
    })
  );

  return (
    <main className="min-h-screen bg-gray-100 text-gray-900">
      <header className="bg-gray-900 text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5">
          <div>
            <h1 className="text-2xl font-bold">
              AM Whole Sale UK
            </h1>

            <p className="text-sm text-gray-400">
              Order Management
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="rounded-md bg-orange-500 px-5 py-2 font-semibold transition hover:bg-orange-600"
            >
              View Store
            </Link>

            <LogoutButton />
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold">
            Order Management
          </h2>

          <p className="mt-2 text-gray-500">
            Manage customer orders, order status
            and sales.
          </p>
        </div>

        {/* SUMMARY CARDS */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">

          <div className="rounded-xl bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-gray-500">
              Total Orders
            </p>

            <p className="mt-2 text-3xl font-bold">
              {totalOrders}
            </p>
          </div>

          <div className="rounded-xl bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-gray-500">
              Pending
            </p>

            <p className="mt-2 text-3xl font-bold text-yellow-600">
              {pendingOrders}
            </p>
          </div>

          <div className="rounded-xl bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-gray-500">
              Confirmed
            </p>

            <p className="mt-2 text-3xl font-bold text-blue-600">
              {confirmedOrders}
            </p>
          </div>

          <div className="rounded-xl bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-gray-500">
              Shipped
            </p>

            <p className="mt-2 text-3xl font-bold text-purple-600">
              {shippedOrders}
            </p>
          </div>

          <div className="rounded-xl bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-gray-500">
              Delivered
            </p>

            <p className="mt-2 text-3xl font-bold text-green-600">
              {deliveredOrders}
            </p>
          </div>

          <div className="rounded-xl bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-gray-500">
              Cancelled
            </p>

            <p className="mt-2 text-3xl font-bold text-red-600">
              {cancelledOrders}
            </p>
          </div>

        </div>

        {/* SALES */}
        <div className="mt-6 rounded-xl bg-white p-6 shadow-sm">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

            <div>
              <p className="text-sm text-gray-500">
                Total Sales
              </p>

              <p className="mt-1 text-3xl font-bold text-green-600">
                £{totalSales.toFixed(2)}
              </p>
            </div>

            <div className="rounded-lg bg-green-50 px-5 py-3 text-sm font-semibold text-green-700">
              Cancelled orders excluded
            </div>

          </div>
        </div>

        {/* ORDERS */}
        <div className="mt-8">
          <OrderTable
            orders={serializedOrders}
          />
        </div>

      </section>

      <footer className="mt-10 bg-gray-900 py-8 text-center text-white">
        <p className="text-sm text-gray-400">
          © 2026 AM Whole Sale UK. All rights reserved.
        </p>
      </footer>
    </main>
  );
}