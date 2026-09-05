"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type Order = {
  id: number;
  orderNumber: string | null;
  customerName: string;
  email: string;
  phone: string;
  total: number;
  status: string;
  createdAt: string;
  itemsCount: number;
};

type OrderTableProps = {
  orders: Order[];
};

const statusStyles: Record<string, string> = {
  Pending:
    "border-yellow-200 bg-yellow-50 text-yellow-700",
  Confirmed:
    "border-blue-200 bg-blue-50 text-blue-700",
  Shipped:
    "border-purple-200 bg-purple-50 text-purple-700",
  Delivered:
    "border-green-200 bg-green-50 text-green-700",
  Cancelled:
    "border-red-200 bg-red-50 text-red-700",
};

const filterStyles: Record<string, string> = {
  All: "bg-slate-900 text-white",
  Pending:
    "bg-yellow-50 text-yellow-700 hover:bg-yellow-100",
  Confirmed:
    "bg-blue-50 text-blue-700 hover:bg-blue-100",
  Shipped:
    "bg-purple-50 text-purple-700 hover:bg-purple-100",
  Delivered:
    "bg-green-50 text-green-700 hover:bg-green-100",
  Cancelled:
    "bg-red-50 text-red-700 hover:bg-red-100",
};

const filters = [
  "All",
  "Pending",
  "Confirmed",
  "Shipped",
  "Delivered",
  "Cancelled",
];

function formatPrice(value: number) {
  const amount = Number(value);

  if (!Number.isFinite(amount)) {
    return "£0.00";
  }

  return `£${amount.toFixed(2)}`;
}

export default function OrderTable({
  orders,
}: OrderTableProps) {
  const [activeFilter, setActiveFilter] =
    useState("All");

  const [search, setSearch] = useState("");

  const filterCounts = useMemo(
    () => ({
      All: orders.length,

      Pending: orders.filter(
        (order) => order.status === "Pending"
      ).length,

      Confirmed: orders.filter(
        (order) => order.status === "Confirmed"
      ).length,

      Shipped: orders.filter(
        (order) => order.status === "Shipped"
      ).length,

      Delivered: orders.filter(
        (order) => order.status === "Delivered"
      ).length,

      Cancelled: orders.filter(
        (order) => order.status === "Cancelled"
      ).length,
    }),
    [orders]
  );

  const filteredOrders = useMemo(() => {
    const searchText = search.trim().toLowerCase();

    return orders.filter((order) => {
      const matchesStatus =
        activeFilter === "All" ||
        order.status === activeFilter;

      const matchesSearch =
        !searchText ||
        (order.orderNumber || "")
          .toLowerCase()
          .includes(searchText) ||
        order.customerName
          .toLowerCase()
          .includes(searchText) ||
        order.email
          .toLowerCase()
          .includes(searchText) ||
        order.phone
          .toLowerCase()
          .includes(searchText);

      return matchesStatus && matchesSearch;
    });
  }, [orders, activeFilter, search]);

  function clearFilters() {
    setSearch("");
    setActiveFilter("All");
  }

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      {/* HEADER */}
      <div className="border-b border-slate-200 px-5 py-6 sm:px-6">
        <div className="flex flex-col gap-5">
          <div>
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-100 text-lg">
                #
              </span>

              <div>
                <h2 className="text-xl font-extrabold text-slate-900 sm:text-2xl">
                  All Orders
                </h2>

                <p className="mt-0.5 text-sm text-slate-500">
                  Search and manage customer orders
                </p>
              </div>
            </div>
          </div>

          {/* SEARCH */}
          <div className="relative">
            <label
              htmlFor="orderSearch"
              className="mb-2 block text-sm font-bold text-slate-700"
            >
              Search Orders
            </label>

            <input
              id="orderSearch"
              type="text"
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Order number, customer, email or phone..."
              className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3.5 pr-12 text-sm font-medium text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-orange-500 focus:bg-white focus:ring-4 focus:ring-orange-100"
            />

            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="absolute right-3 bottom-2.5 flex h-9 w-9 items-center justify-center rounded-lg text-xl font-medium text-slate-400 transition hover:bg-slate-200 hover:text-slate-700"
                aria-label="Clear search"
              >
                ×
              </button>
            )}
          </div>

          {/* FILTERS */}
          <div>
            <p className="mb-2 text-sm font-bold text-slate-700">
              Order Status
            </p>

            <div className="flex flex-wrap gap-2">
              {filters.map((filter) => {
                const active =
                  activeFilter === filter;

                return (
                  <button
                    key={filter}
                    type="button"
                    onClick={() =>
                      setActiveFilter(filter)
                    }
                    className={`rounded-full border px-4 py-2 text-sm font-bold transition ${
                      active
                        ? filterStyles.All
                        : filterStyles[filter]
                    }`}
                  >
                    {filter}{" "}
                    <span
                      className={
                        active
                          ? "ml-1 opacity-80"
                          : "ml-1 opacity-70"
                      }
                    >
                      {filterCounts[
                        filter as keyof typeof filterCounts
                      ]}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* RESULT BAR */}
      <div className="flex flex-col gap-3 border-b border-slate-200 bg-slate-50 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p className="text-sm text-slate-500">
          Showing{" "}
          <span className="font-extrabold text-slate-900">
            {filteredOrders.length}
          </span>{" "}
          of{" "}
          <span className="font-extrabold text-slate-900">
            {orders.length}
          </span>{" "}
          orders
        </p>

        {(search || activeFilter !== "All") && (
          <button
            type="button"
            onClick={clearFilters}
            className="w-fit rounded-lg bg-white px-3 py-2 text-sm font-bold text-slate-700 shadow-sm ring-1 ring-slate-200 transition hover:bg-slate-100"
          >
            Clear Filters
          </button>
        )}
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1050px] text-left">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-100">
              <th className="px-6 py-4 text-xs font-extrabold uppercase tracking-wide text-slate-500">
                Order
              </th>

              <th className="px-6 py-4 text-xs font-extrabold uppercase tracking-wide text-slate-500">
                Customer
              </th>

              <th className="px-6 py-4 text-xs font-extrabold uppercase tracking-wide text-slate-500">
                Items
              </th>

              <th className="px-6 py-4 text-xs font-extrabold uppercase tracking-wide text-slate-500">
                Total
              </th>

              <th className="px-6 py-4 text-xs font-extrabold uppercase tracking-wide text-slate-500">
                Status
              </th>

              <th className="px-6 py-4 text-xs font-extrabold uppercase tracking-wide text-slate-500">
                Date
              </th>

              <th className="px-6 py-4 text-xs font-extrabold uppercase tracking-wide text-slate-500">
                Action
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {filteredOrders.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="px-6 py-16 text-center"
                >
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-2xl">
                    🔍
                  </div>

                  <p className="mt-4 text-lg font-extrabold text-slate-800">
                    No orders found
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    Try changing your search or filter.
                  </p>

                  {(search ||
                    activeFilter !== "All") && (
                    <button
                      type="button"
                      onClick={clearFilters}
                      className="mt-5 rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-slate-700"
                    >
                      Clear Filters
                    </button>
                  )}
                </td>
              </tr>
            ) : (
              filteredOrders.map((order) => (
                <tr
                  key={order.id}
                  className="transition hover:bg-slate-50"
                >
                  {/* ORDER */}
                  <td className="px-6 py-5">
                    <p className="font-extrabold text-slate-900">
                      {order.orderNumber ||
                        `Order #${order.id}`}
                    </p>

                    <p className="mt-1 text-xs font-medium text-slate-400">
                      ID #{order.id}
                    </p>
                  </td>

                  {/* CUSTOMER */}
                  <td className="px-6 py-5">
                    <p className="font-bold text-slate-900">
                      {order.customerName}
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                      {order.email}
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                      {order.phone}
                    </p>
                  </td>

                  {/* ITEMS */}
                  <td className="px-6 py-5">
                    <span className="inline-flex items-center rounded-lg bg-slate-100 px-3 py-2">
                      <span className="text-sm font-extrabold text-slate-900">
                        {order.itemsCount}
                      </span>

                      <span className="ml-1.5 text-xs font-medium text-slate-500">
                        product
                        {order.itemsCount === 1
                          ? ""
                          : "s"}
                      </span>
                    </span>
                  </td>

                  {/* TOTAL */}
                  <td className="px-6 py-5">
                    <p className="font-extrabold text-slate-900">
                      {formatPrice(order.total)}
                    </p>
                  </td>

                  {/* STATUS */}
                  <td className="px-6 py-5">
                    <span
                      className={`inline-flex rounded-full border px-3 py-1.5 text-xs font-extrabold ${
                        statusStyles[
                          order.status
                        ] ||
                        "border-slate-200 bg-slate-50 text-slate-600"
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>

                  {/* DATE */}
                  <td className="px-6 py-5">
                    <p className="font-bold text-slate-800">
                      {new Date(
                        order.createdAt
                      ).toLocaleDateString("en-GB")}
                    </p>

                    <p className="mt-1 text-xs font-medium text-slate-400">
                      {new Date(
                        order.createdAt
                      ).toLocaleTimeString("en-GB", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </td>

                  {/* ACTION */}
                  <td className="px-6 py-5">
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="inline-flex items-center rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-orange-500"
                    >
                      View Order
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* MOBILE ORDER LIST */}
      <div className="divide-y divide-slate-100 md:hidden">
        {filteredOrders.map((order) => (
          <div
            key={`mobile-${order.id}`}
            className="p-5"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-extrabold text-slate-900">
                  {order.orderNumber ||
                    `Order #${order.id}`}
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  ID #{order.id}
                </p>
              </div>

              <span
                className={`rounded-full border px-3 py-1.5 text-xs font-extrabold ${
                  statusStyles[order.status] ||
                  "border-slate-200 bg-slate-50 text-slate-600"
                }`}
              >
                {order.status}
              </span>
            </div>

            <div className="mt-4 rounded-xl bg-slate-50 p-4">
              <p className="font-bold text-slate-900">
                {order.customerName}
              </p>

              <p className="mt-1 break-all text-sm text-slate-500">
                {order.email}
              </p>

              <p className="mt-1 text-sm text-slate-500">
                {order.phone}
              </p>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-slate-200 p-3">
                <p className="text-xs font-bold uppercase text-slate-400">
                  Total
                </p>

                <p className="mt-1 font-extrabold text-slate-900">
                  {formatPrice(order.total)}
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 p-3">
                <p className="text-xs font-bold uppercase text-slate-400">
                  Items
                </p>

                <p className="mt-1 font-extrabold text-slate-900">
                  {order.itemsCount}
                </p>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-bold text-slate-400">
                  Date
                </p>

                <p className="mt-1 text-sm font-bold text-slate-700">
                  {new Date(
                    order.createdAt
                  ).toLocaleDateString("en-GB")}
                </p>
              </div>

              <Link
                href={`/admin/orders/${order.id}`}
                className="rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-orange-500"
              >
                View Order
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
