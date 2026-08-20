"use client";

import { useState } from "react";

export default function Header() {
  const [search, setSearch] = useState("");

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      {/* Top Header */}
      <div className="border-b">
        <div className="mx-auto flex max-w-7xl items-center gap-5 px-4 py-4">
          {/* Logo */}
          <a
            href="/"
            className="min-w-fit text-2xl font-extrabold tracking-tight"
          >
            AM Whole Sale <span className="text-orange-500">UK</span>
          </a>

          {/* Search */}
          <div className="flex flex-1 overflow-hidden rounded-md border-2 border-orange-500">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products..."
              className="w-full px-4 py-3 text-sm outline-none"
            />

            <button className="bg-orange-500 px-6 text-white hover:bg-orange-600">
              🔍
            </button>
          </div>

          {/* Account */}
          <button className="hidden min-w-fit text-sm md:block">
            <span className="block text-xs text-gray-500">
              Hello, Sign in
            </span>
            <span className="font-semibold">
              Account & Orders
            </span>
          </button>

          {/* Cart */}
          <button className="relative min-w-fit text-xl">
            🛒
            <span className="ml-1 text-sm font-semibold">
              Cart
            </span>

            <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-orange-500 text-xs text-white">
              0
            </span>
          </button>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-gray-900 text-white">
        <div className="mx-auto flex max-w-7xl items-center gap-7 px-4">
          <button className="py-3 font-semibold hover:text-orange-400">
            ☰ Categories
          </button>

          <a href="/" className="py-3 hover:text-orange-400">
            Home
          </a>

          <a href="/products" className="py-3 hover:text-orange-400">
            All Products
          </a>

          <a href="/deals" className="py-3 hover:text-orange-400">
            🔥 Flash Deals
          </a>

          <a href="/new-arrivals" className="py-3 hover:text-orange-400">
            New Arrivals
          </a>

          <a href="/contact" className="py-3 hover:text-orange-400">
            Contact
          </a>
        </div>
      </div>
    </header>
  );
}