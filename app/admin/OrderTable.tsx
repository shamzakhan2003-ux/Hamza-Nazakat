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
  Pending: "bg-yellow-100 text-yellow-700",
  Confirmed: "bg-blue-100 text-blue-700",
  Shipped: "bg-purple-100 text-purple-700",
  Delivered: "bg-green-100 text-green-700",
  Cancelled: "bg-red-100 text-red-700",
};

const filters = [
  "All",
  "Pending",
  "Confirmed",
  "Shipped",
  "Delivered",
  "Cancelled",
];

export default function OrderTable({
  orders,
}: OrderTableProps) {
  const [activeFilter, setActiveFilter] = useState("All");
  const [search, setSearch] = useState("");

  const filterCounts = {
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
  };

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

  return (
    <div className="rounded-xl bg-white shadow-sm">

      {/* Header */}
      <div className="border-b px-6 py-5">
        <div className="flex flex-col gap-5">

          <div>
            <h2 className="text-xl font-bold">
              All Orders
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Search and manage customer orders
            </p>
          </div>

          {/* Search */}
          <div className="relative">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search order, customer, email or phone..."
              className="w-full rounded-lg border border-gray-300 px-4 py-3 pr-10 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
            />

            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xl text-gray-400 hover:text-gray-700"
                aria-label="Clear search"
              >
                ×
              </button>
            )}
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2">
            {filters.map((filter) => {
              const active = activeFilter === filter;

              return (
                <button
                  key={filter}
                  type="button"
                  onClick={() => setActiveFilter(filter)}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                    active
                      ? "bg-gray-900 text-white"
                      : filter === "Pending"
                      ? "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
                      : filter === "Confirmed"
                      ? "bg-blue-100 text-blue-700 hover:bg-blue-200"
                      : filter === "Shipped"
                      ? "bg-purple-100 text-purple-700 hover:bg-purple-200"
                      : filter === "Delivered"
                      ? "bg-green-100 text-green-700 hover:bg-green-200"
                      : filter === "Cancelled"
                      ? "bg-red-100 text-red-700 hover:bg-red-200"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {filter}{" "}
                  {
                    filterCounts[
                      filter as keyof typeof filterCounts
                    ]
                  }
                </button>
              );
            })}
          </div>

        </div>
      </div>

      {/* Result Count */}
      <div className="border-b bg-gray-50 px-6 py-3">
        <p className="text-sm text-gray-500">
          Showing{" "}
          <span className="font-bold text-gray-900">
            {filteredOrders.length}
          </span>{" "}
          of{" "}
          <span className="font-bold text-gray-900">
            {orders.length}
          </span>{" "}
          orders
        </p>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1000px] text-left">

          <thead>
            <tr className="border-b bg-gray-50 text-sm text-gray-500">

              <th className="px-6 py-4">
                Order Number
              </th>

              <th className="px-6 py-4">
                Customer
              </th>

              <th className="px-6 py-4">
                Items
              </th>

              <th className="px-6 py-4">
                Total
              </th>

              <th className="px-6 py-4">
                Status
              </th>

              <th className="px-6 py-4">
                Date
              </th>

              <th className="px-6 py-4">
                Action
              </th>

            </tr>
          </thead>

          <tbody>

            {filteredOrders.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="px-6 py-16 text-center"
                >
                  <div className="text-4xl">
                    🔍
                  </div>

                  <p className="mt-4 text-lg font-semibold">
                    No orders found
                  </p>

                  <p className="mt-1 text-sm text-gray-500">
                    Try changing your search or filter.
                  </p>

                  {(search || activeFilter !== "All") && (
                    <button
                      type="button"
                      onClick={() => {
                        setSearch("");
                        setActiveFilter("All");
                      }}
                      className="mt-5 rounded-md bg-gray-900 px-5 py-2 text-sm font-semibold text-white hover:bg-gray-700"
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
                  className="border-b last:border-b-0 hover:bg-gray-50"
                >

                  {/* Order */}
                  <td className="px-6 py-5">
                    <p className="font-bold text-gray-900">
                      {order.orderNumber || `Order #${order.id}`}
                    </p>

                    <p className="mt-1 text-xs text-gray-400">
                      ID #{order.id}
                    </p>
                  </td>

                  {/* Customer */}
                  <td className="px-6 py-5">
                    <p className="font-semibold">
                      {order.customerName}
                    </p>

                    <p className="mt-1 text-sm text-gray-500">
                      {order.email}
                    </p>

                    <p className="mt-1 text-sm text-gray-500">
                      {order.phone}
                    </p>
                  </td>

                  {/* Items */}
                  <td className="px-6 py-5">
                    <p className="font-semibold">
                      {order.itemsCount}
                    </p>

                    <p className="text-xs text-gray-500">
                      product(s)
                    </p>
                  </td>

                  {/* Total */}
                  <td className="px-6 py-5">
                    <p className="font-bold">
                      £{order.total.toFixed(2)}
                    </p>
                  </td>

                  {/* Status */}
                  <td className="px-6 py-5">
                    <span
                      className={`inline-flex rounded-full px-3 py-1.5 text-xs font-bold ${
                        statusStyles[order.status] ||
                        "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>

                  {/* Date */}
                  <td className="px-6 py-5">
                    <p className="font-medium">
                      {new Date(
                        order.createdAt
                      ).toLocaleDateString("en-GB")}
                    </p>

                    <p className="mt-1 text-xs text-gray-400">
                      {new Date(
                        order.createdAt
                      ).toLocaleTimeString("en-GB", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </td>

                  {/* Action */}
                  <td className="px-6 py-5">
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="inline-flex rounded-md bg-gray-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-gray-700"
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

    </div>
  );
}