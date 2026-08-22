import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "../../../lib/prisma";
import OrderStatus from "./OrderStatus";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function OrderDetailsPage({
  params,
}: PageProps) {
  const { id } = await params;

  const orderId = Number(id);

  if (Number.isNaN(orderId)) {
    notFound();
  }

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

  return (
    <main className="min-h-screen bg-gray-100 text-gray-900">
      <header className="bg-gray-900 text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5">
          <div>
            <h1 className="text-2xl font-bold">
              AM Whole Sale UK
            </h1>

            <p className="text-sm text-gray-400">
              Order Details
            </p>
          </div>

          <Link
            href="/admin"
            className="rounded-md bg-orange-500 px-5 py-2 font-semibold hover:bg-orange-600"
          >
            Back to Admin
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-4 py-8">
        <div className="mb-6">
          <h2 className="text-3xl font-bold">
            Order #{order.id}
          </h2>

          <p className="mt-2 text-gray-500">
            Placed on{" "}
            {new Date(order.createdAt).toLocaleDateString("en-GB")}
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="space-y-8 lg:col-span-2">
            <div className="rounded-lg bg-white p-6 shadow-sm">
              <h3 className="text-xl font-bold">
                Customer Information
              </h3>

              <div className="mt-5 grid gap-5 md:grid-cols-2">
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
                  <p className="mt-1 font-semibold">
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
                    Address
                  </p>
                  <p className="mt-1 font-semibold">
                    {order.address}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">
                    Postcode
                  </p>
                  <p className="mt-1 font-semibold">
                    {order.postcode}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-lg bg-white p-6 shadow-sm">
              <h3 className="text-xl font-bold">
                Ordered Products
              </h3>

              <div className="mt-5 space-y-4">
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between border-b pb-4"
                  >
                    <div>
                      <p className="font-semibold">
                        {item.name}
                      </p>

                      <p className="mt-1 text-sm text-gray-500">
                        Quantity: {item.quantity}
                      </p>
                    </div>

                    <p className="font-semibold">
                      £
                      {(Number(item.price) * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex justify-between border-t pt-5 text-xl font-bold">
                <span>Total</span>

                <span className="text-orange-500">
                  £{Number(order.total).toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          <OrderStatus
            orderId={order.id}
            currentStatus={order.status}
          />
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