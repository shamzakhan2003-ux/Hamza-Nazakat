"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Customer = {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  mobileVerified: boolean;
};

export default function Header() {
  const [search, setSearch] = useState("");
  const [cartCount, setCartCount] = useState(0);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loadingCustomer, setLoadingCustomer] = useState(true);

  // =========================
  // CART COUNT
  // =========================

  const updateCartCount = () => {
    try {
      const savedCart = localStorage.getItem("cart");

      if (!savedCart) {
        setCartCount(0);
        return;
      }

      const cart = JSON.parse(savedCart);

      if (!Array.isArray(cart)) {
        setCartCount(0);
        return;
      }

      const total = cart.reduce(
        (sum: number, item: { quantity?: number }) =>
          sum + Number(item.quantity || 0),
        0
      );

      setCartCount(total);
    } catch (error) {
      console.error("Cart count error:", error);
      setCartCount(0);
    }
  };

  // =========================
  // CUSTOMER
  // =========================

  const loadCustomer = async () => {
    try {
      const response = await fetch("/api/customer/me", {
        method: "GET",
        cache: "no-store",
      });

      if (!response.ok) {
        setCustomer(null);
        return;
      }

      const data = await response.json();

      setCustomer(data.customer || null);
    } catch (error) {
      console.error("Customer loading error:", error);
      setCustomer(null);
    } finally {
      setLoadingCustomer(false);
    }
  };

  useEffect(() => {
    updateCartCount();
    loadCustomer();

    const handleCartUpdated = () => {
      updateCartCount();
    };

    const handleStorage = () => {
      updateCartCount();
    };

    const handleCustomerUpdated = () => {
      loadCustomer();
    };

    window.addEventListener("cartUpdated", handleCartUpdated);
    window.addEventListener("storage", handleStorage);
    window.addEventListener(
      "customerUpdated",
      handleCustomerUpdated
    );

    return () => {
      window.removeEventListener(
        "cartUpdated",
        handleCartUpdated
      );

      window.removeEventListener(
        "storage",
        handleStorage
      );

      window.removeEventListener(
        "customerUpdated",
        handleCustomerUpdated
      );
    };
  }, []);

  // =========================
  // SEARCH
  // =========================

  const handleSearch = () => {
    const query = search.trim();

    if (!query) {
      window.location.href = "/products";
      return;
    }

    window.location.href = `/products?search=${encodeURIComponent(
      query
    )}`;
  };

  const handleSearchKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  // =========================
  // LOGOUT
  // =========================

  const handleLogout = async () => {
    try {
      await fetch("/api/customer/logout", {
        method: "POST",
      });

      setCustomer(null);

      window.dispatchEvent(
        new Event("customerUpdated")
      );

      window.location.href = "/";
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      {/* ========================= */}
      {/* TOP HEADER */}
      {/* ========================= */}

      <div className="border-b">
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-4 md:gap-5">
          {/* LOGO */}

          <Link
            href="/"
            className="min-w-fit text-xl font-extrabold tracking-tight md:text-2xl"
          >
            AM Whole Sale{" "}
            <span className="text-orange-500">
              UK
            </span>
          </Link>

          {/* SEARCH */}

          <div className="hidden flex-1 overflow-hidden rounded-md border-2 border-orange-500 sm:flex">
            <input
              type="text"
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              onKeyDown={handleSearchKeyDown}
              placeholder="Search products..."
              className="w-full px-4 py-3 text-sm outline-none"
            />

            <button
              type="button"
              onClick={handleSearch}
              className="bg-orange-500 px-6 text-white transition hover:bg-orange-600"
              aria-label="Search"
            >
              🔍
            </button>
          </div>

          {/* ACCOUNT */}

          <div className="hidden md:block">
            {loadingCustomer ? (
              <button
                type="button"
                className="min-w-fit text-left text-sm"
              >
                <span className="block text-xs text-gray-500">
                  Hello
                </span>

                <span className="font-semibold">
                  Account & Orders
                </span>
              </button>
            ) : customer ? (
              <div className="relative">
                <Link
                  href="/account"
                  className="block min-w-fit text-left text-sm"
                >
                  <span className="block text-xs text-gray-500">
                    Hello,{" "}
                    {customer.fullName.split(" ")[0]}
                  </span>

                  <span className="font-semibold hover:text-orange-500">
                    Account & Orders
                  </span>
                </Link>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="mt-1 text-xs text-gray-500 hover:text-red-500"
                >
                  Sign out
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="block min-w-fit text-sm"
              >
                <span className="block text-xs text-gray-500">
                  Hello, Sign in
                </span>

                <span className="font-semibold hover:text-orange-500">
                  Account & Orders
                </span>
              </Link>
            )}
          </div>

          {/* CART */}

          <Link
            href="/cart"
            className="relative min-w-fit text-xl"
          >
            🛒

            <span className="ml-1 text-sm font-semibold">
              Cart
            </span>

            {cartCount > 0 && (
              <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-orange-500 px-1 text-xs font-bold text-white">
                {cartCount > 99 ? "99+" : cartCount}
              </span>
            )}
          </Link>
        </div>

        {/* MOBILE SEARCH */}

        <div className="px-4 pb-4 sm:hidden">
          <div className="flex overflow-hidden rounded-md border-2 border-orange-500">
            <input
              type="text"
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              onKeyDown={handleSearchKeyDown}
              placeholder="Search products..."
              className="w-full px-3 py-2.5 text-sm outline-none"
            />

            <button
              type="button"
              onClick={handleSearch}
              className="bg-orange-500 px-4 text-white"
              aria-label="Search"
            >
              🔍
            </button>
          </div>
        </div>
      </div>

      {/* ========================= */}
      {/* NAVIGATION */}
      {/* ========================= */}

      <div className="bg-gray-900 text-white">
        <div className="mx-auto flex max-w-7xl items-center gap-5 overflow-x-auto px-4">
          {/* CATEGORIES */}

          <Link
            href="/categories"
            className="whitespace-nowrap py-3 font-semibold hover:text-orange-400"
          >
            ☰ Categories
          </Link>

          {/* HOME */}

          <Link
            href="/"
            className="whitespace-nowrap py-3 hover:text-orange-400"
          >
            Home
          </Link>

          {/* ALL PRODUCTS */}

          <Link
            href="/products"
            className="whitespace-nowrap py-3 hover:text-orange-400"
          >
            All Products
          </Link>

          {/* FLASH DEALS */}

          <Link
            href="/products?deals=true"
            className="whitespace-nowrap py-3 hover:text-orange-400"
          >
            🔥 Flash Deals
          </Link>

          {/* NEW ARRIVALS */}

          <Link
            href="/products?new=true"
            className="whitespace-nowrap py-3 hover:text-orange-400"
          >
            🆕 New Arrivals
          </Link>

          {/* CONTACT */}

          <Link
            href="/contact"
            className="whitespace-nowrap py-3 hover:text-orange-400"
          >
            Contact
          </Link>
        </div>
      </div>
    </header>
  );
}