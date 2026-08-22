import Link from "next/link";
import { prisma } from "../lib/prisma";
import LogoutButton from "./LogoutButton";

export default async function AdminPage() {
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

  const totalSales = orders.reduce(
    (sum, order) => sum + Number(order.total),
    0
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
              Admin Dashboard
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="rounded-md bg-orange-500 px-5 py-2 font-semibold hover:bg-orange-600"
            >
              View Store
            </Link>

            <LogoutButton />
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-4 py-8">
        <h2 className="mb-6 text-3xl font-bold">
          Dashboard
        </h2>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-lg bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500">
              Total Orders
            </p>

            <p className="mt-2 text-3xl font-bold">
              {totalOrders}
            </p>
          </div>

          <div className="rounded-lg bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500">
              Pending Orders
            </p>

            <p className="mt-2 text-3xl font-bold text-orange-500">
              {pendingOrders}
            </p>
          </div>

          <div className="rounded-lg bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500">
              Total Sales
            </p>

            <p className="mt-2 text-3xl font-bold text-green-600">
              £{totalSales.toFixed(2)}
            </p>
          </div>
        </div>

        <div className="mt-10 rounded-lg bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold">
            Recent Orders
          </h2>

          <div className="mt-6 overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b text-sm text-gray-500">
                  <th className="px-4 py-3">
                    Order
                  </th>

                  <th className="px-4 py-3">
                    Customer
                  </th>

                  <th className="px-4 py-3">
                    Items
                  </th>

                  <th className="px-4 py-3">
                    Total
                  </th>

                  <th className="px-4 py-3">
                    Status
                  </th>

                  <th className="px-4 py-3">
                    Date
                  </th>

                  <th className="px-4 py-3">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {orders.map((order) => (
                  <tr
                    key={order.id}
                    className="border-b last:border-b-0"
                  >
                    <td className="px-4 py-4 font-bold">
                      #{order.id}
                    </td>

                    <td className="px-4 py-4">
                      <p className="font-semibold">
                        {order.customerName}
                      </p>

                      <p className="text-sm text-gray-500">
                        {order.email}
                      </p>
                    </td>

                    <td className="px-4 py-4">
                      {order.items.length}
                    </td>

                    <td className="px-4 py-4 font-semibold">
                      £{Number(order.total).toFixed(2)}
                    </td>

                    <td className="px-4 py-4">
                      <span className="rounded-full bg-orange-100 px-3 py-1 text-sm font-semibold text-orange-600">
                        {order.status}
                      </span>
                    </td>

                    <td className="px-4 py-4">
                      {new Date(
                        order.createdAt
                      ).toLocaleDateString("en-GB")}
                    </td>

                    <td className="px-4 py-4">
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="rounded-md bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-700"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <footer className="mt-10 bg-gray-900 py-8 text-center text-white">
        <p className="text-sm text-gray-400">
          © 2026 AM Whole Sale UK
        </p>
      </footer>
    </main>
  );
}