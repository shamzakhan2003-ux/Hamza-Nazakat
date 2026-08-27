"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type CartItem = {
  id: number;
  name: string;
  price: string;
  image: string | null;
  quantity: number;
};

type Customer = {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  mobileVerified: boolean;
};

export default function CheckoutPage() {
  const router = useRouter();

  const [cart, setCart] = useState<CartItem[]>([]);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  const [checkingCustomer, setCheckingCustomer] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);

  const [form, setForm] = useState({
    customerName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postcode: "",
  });

  useEffect(() => {
    const loadCheckout = async () => {
      try {
        // Load cart first. Never remove it here.
        const savedCart = localStorage.getItem("cart");

        if (savedCart) {
          const parsedCart = JSON.parse(savedCart);

          if (Array.isArray(parsedCart)) {
            setCart(parsedCart);
          }
        }

        // Check logged-in customer
        const response = await fetch("/api/customer/me", {
          method: "GET",
          cache: "no-store",
        });

        if (!response.ok) {
          router.replace(
            "/login?redirect=/checkout"
          );
          return;
        }

        const data = await response.json();

        if (!data.loggedIn || !data.customer) {
          router.replace(
            "/login?redirect=/checkout"
          );
          return;
        }

        const loggedInCustomer: Customer =
          data.customer;

        // Mobile verification is compulsory
        if (!loggedInCustomer.mobileVerified) {
          alert(
            "Please verify your mobile number before checkout."
          );

          router.replace(
            `/signup?verify=1&phone=${encodeURIComponent(
              loggedInCustomer.phone
            )}&redirect=/checkout`
          );

          return;
        }

        setCustomer(loggedInCustomer);

        setForm({
          customerName:
            loggedInCustomer.fullName || "",
          email: loggedInCustomer.email || "",
          phone: loggedInCustomer.phone || "",
          address: "",
          city: "",
          postcode: "",
        });
      } catch (error) {
        console.error(
          "Checkout loading error:",
          error
        );

        router.replace(
          "/login?redirect=/checkout"
        );
      } finally {
        setLoading(false);
        setCheckingCustomer(false);
      }
    };

    loadCheckout();
  }, [router]);

  const total = cart.reduce((sum, item) => {
    return (
      sum +
      Number(item.price) * Number(item.quantity)
    );
  }, 0);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  };

  const placeOrder = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!customer) {
      alert(
        "Please sign in before placing an order."
      );

      router.push(
        "/login?redirect=/checkout"
      );

      return;
    }

    if (!customer.mobileVerified) {
      alert(
        "Please verify your mobile number before placing an order."
      );

      return;
    }

    if (cart.length === 0) {
      alert("Your cart is empty.");
      return;
    }

    try {
      setPlacingOrder(true);

      const response = await fetch(
        "/api/orders",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            customerName: form.customerName,
            email: form.email,
            phone: form.phone,
            address: form.address,
            city: form.city,
            postcode: form.postcode,
            items: cart,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(
          data.error ||
            "Failed to place order."
        );
        return;
      }

      // Cart is removed ONLY after successful order creation.
      localStorage.removeItem("cart");

      window.dispatchEvent(
        new Event("cartUpdated")
      );

      alert(
        `Order placed successfully!\n\nOrder Number: ${data.order.orderNumber}`
      );

      router.push("/");
      router.refresh();
    } catch (error) {
      console.error(
        "Order error:",
        error
      );

      alert(
        "Something went wrong. Please try again."
      );
    } finally {
      setPlacingOrder(false);
    }
  };

  if (loading || checkingCustomer) {
    return (
      <main className="min-h-screen bg-gray-100 p-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-lg font-semibold">
            Checking your account...
          </p>
        </div>
      </main>
    );
  }

  if (!customer) {
    return null;
  }

  if (cart.length === 0) {
    return (
      <main className="min-h-screen bg-gray-100 text-gray-900">
        <div className="mx-auto max-w-3xl px-4 py-16 text-center">
          <div className="text-6xl">🛒</div>

          <h1 className="mt-5 text-3xl font-bold">
            Your cart is empty
          </h1>

          <p className="mt-3 text-gray-500">
            Please add products before checkout.
          </p>

          <button
            type="button"
            onClick={() =>
              router.push("/products")
            }
            className="mt-6 rounded-md bg-orange-500 px-8 py-3 font-bold text-white hover:bg-orange-600"
          >
            Continue Shopping
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100 text-gray-900">
      <header className="bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 py-5">
          <button
            type="button"
            onClick={() => router.push("/")}
            className="text-2xl font-bold text-orange-500"
          >
            AM Whole Sale UK
          </button>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-4 py-8">
        <h1 className="mb-8 text-3xl font-bold">
          Checkout
        </h1>

        <div className="grid gap-8 lg:grid-cols-3">
          <form
            onSubmit={placeOrder}
            className="rounded-lg bg-white p-6 shadow-sm lg:col-span-2"
          >
            <h2 className="text-xl font-bold">
              Delivery Information
            </h2>

            <div className="mt-6 grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block font-semibold">
                  Full Name
                </label>

                <input
                  required
                  name="customerName"
                  value={form.customerName}
                  onChange={handleChange}
                  className="w-full rounded-md border px-4 py-3 outline-none focus:border-orange-500"
                  placeholder="Your full name"
                />
              </div>

              <div>
                <label className="mb-2 block font-semibold">
                  Email
                </label>

                <input
                  required
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full rounded-md border px-4 py-3 outline-none focus:border-orange-500"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label className="mb-2 block font-semibold">
                  Phone
                </label>

                <input
                  required
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  className="w-full rounded-md border px-4 py-3 outline-none focus:border-orange-500"
                  placeholder="Phone number"
                />
              </div>

              <div>
                <label className="mb-2 block font-semibold">
                  City
                </label>

                <input
                  required
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  className="w-full rounded-md border px-4 py-3 outline-none focus:border-orange-500"
                  placeholder="City"
                />
              </div>

              <div className="md:col-span-2">
                <label className="mb-2 block font-semibold">
                  Address
                </label>

                <input
                  required
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  className="w-full rounded-md border px-4 py-3 outline-none focus:border-orange-500"
                  placeholder="Full delivery address"
                />
              </div>

              <div>
                <label className="mb-2 block font-semibold">
                  Postcode
                </label>

                <input
                  required
                  name="postcode"
                  value={form.postcode}
                  onChange={handleChange}
                  className="w-full rounded-md border px-4 py-3 outline-none focus:border-orange-500"
                  placeholder="Postcode"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={placingOrder}
              className="mt-8 w-full rounded-md bg-orange-500 py-4 text-lg font-bold text-white hover:bg-orange-600 disabled:cursor-not-allowed disabled:bg-gray-400"
            >
              {placingOrder
                ? "Placing Order..."
                : "Place Order"}
            </button>
          </form>

          <div className="h-fit rounded-lg bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold">
              Order Summary
            </h2>

            <div className="mt-6 space-y-4">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between gap-4 border-b pb-4"
                >
                  <div>
                    <p className="font-semibold">
                      {item.name}
                    </p>

                    <p className="text-sm text-gray-500">
                      Qty: {item.quantity}
                    </p>

                    <p className="text-sm text-gray-500">
                      £
                      {Number(item.price).toFixed(
                        2
                      )}{" "}
                      each
                    </p>
                  </div>

                  <p className="font-semibold">
                    £
                    {(
                      Number(item.price) *
                      item.quantity
                    ).toFixed(2)}
                  </p>
                </div>
              ))}

              <div className="flex justify-between border-t pt-4 text-xl font-bold">
                <span>Total</span>

                <span className="text-orange-500">
                  £{total.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
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