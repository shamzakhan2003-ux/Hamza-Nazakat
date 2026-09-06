"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Customer = {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  mobileVerified: boolean;
  emailVerified: boolean;
  isActive: boolean;
  createdAt: string;
};

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadCustomers = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch("/api/admin/customers");

        if (!response.ok) {
          throw new Error("Failed to load customers.");
        }

        const data = await response.json();
        setCustomers(data.customers || []);
      } catch (err) {
        console.error(err);
        setError("Failed to load customers.");
      } finally {
        setLoading(false);
      }
    };

    loadCustomers();
  }, []);

  const searchText = search.toLowerCase().trim();

  const filteredCustomers = customers.filter((customer) => {
    return (
      customer.fullName.toLowerCase().includes(searchText) ||
      customer.email.toLowerCase().includes(searchText) ||
      customer.phone.toLowerCase().includes(searchText)
    );
  });

  return (
    <main className="min-h-screen bg-slate-100">
      <header className="border-b border-slate-200 bg-slate-900 text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <div>
            <h1 className="text-2xl font-bold">Click&Pick</h1>
            <p className="text-sm text-slate-300">
              Admin Panel
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/admin"
              className="rounded-lg bg-slate-700 px-4 py-2 text-sm font-medium hover:bg-slate-600"
            >
              Dashboard
            </Link>

            <Link
              href="/"
              className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-white hover:bg-orange-600"
            >
              View Store
            </Link>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h2 className="text-3xl font-bold text-slate-900">
              Customer Management
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Manage registered customers and their accounts.
            </p>
          </div>

          <div className="rounded-xl bg-white px-5 py-3 shadow-sm">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Total Customers
            </p>

            <p className="text-2xl font-bold text-slate-900">
              {customers.length}
            </p>
          </div>
        </div>

        <div className="mb-6 rounded-xl bg-white p-5 shadow-sm">
          <input
            type="text"
            placeholder="Search by name, email or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
          />
        </div>

        <div className="overflow-hidden rounded-xl bg-white shadow-sm">
          {loading ? (
            <div className="p-8 text-center text-slate-500">
              Loading customers...
            </div>
          ) : error ? (
            <div className="p-8 text-center text-red-600">
              {error}
            </div>
          ) : filteredCustomers.length === 0 ? (
            <div className="p-8 text-center text-slate-500">
              No customers found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50">
                  <tr className="border-b border-slate-200">
                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Customer
                    </th>

                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Phone
                    </th>

                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Email
                    </th>

                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Verification
                    </th>

                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Status
                    </th>

                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Joined
                    </th>

                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredCustomers.map((customer) => (
                    <tr
                      key={customer.id}
                      className="border-b border-slate-100 last:border-0 hover:bg-slate-50"
                    >
                      <td className="px-6 py-4">
                        <div className="font-semibold text-slate-900">
                          {customer.fullName}
                        </div>

                        <div className="text-xs text-slate-500">
                          ID: {customer.id}
                        </div>
                      </td>

                      <td className="px-6 py-4 text-sm text-slate-700">
                        {customer.phone}
                      </td>

                      <td className="px-6 py-4 text-sm text-slate-700">
                        {customer.email}
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1 text-xs">
                          <span
                            className={
                              customer.emailVerified
                                ? "font-medium text-green-600"
                                : "font-medium text-red-600"
                            }
                          >
                            Email:{" "}
                            {customer.emailVerified
                              ? "Verified"
                              : "Not Verified"}
                          </span>

                          <span
                            className={
                              customer.mobileVerified
                                ? "font-medium text-green-600"
                                : "font-medium text-red-600"
                            }
                          >
                            Mobile:{" "}
                            {customer.mobileVerified
                              ? "Verified"
                              : "Not Verified"}
                          </span>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={
                            customer.isActive
                              ? "rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700"
                              : "rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700"
                          }
                        >
                          {customer.isActive
                            ? "Active"
                            : "Disabled"}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-sm text-slate-600">
                        {new Date(
                          customer.createdAt
                        ).toLocaleDateString("en-GB")}
                      </td>

                      <td className="px-6 py-4">
                        <Link
                          href={`/admin/customers/${customer.id}`}
                          className="inline-flex rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-white hover:bg-orange-600"
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>

      <footer className="border-t border-slate-200 bg-white py-6 text-center text-sm text-slate-500">
        © 2026 Click&Pick. All rights reserved.
      </footer>
    </main>
  );
}