"use client";

import { useEffect, useState } from "react";

type CartItem = {
  id: number;
  name: string;
  price: string;
  image: string | null;
  quantity: number;
};

export default function CartPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const savedCart = localStorage.getItem("cart");

      if (savedCart) {
        setCart(JSON.parse(savedCart));
      }
    } catch (error) {
      console.error("Error loading cart:", error);
      setCart([]);
    }

    setLoaded(true);
  }, []);

  const saveCart = (updatedCart: CartItem[]) => {
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const increaseQuantity = (id: number) => {
    const updatedCart = cart.map((item) => {
      if (item.id === id) {
        return {
          ...item,
          quantity: item.quantity + 1,
        };
      }

      return item;
    });

    saveCart(updatedCart);
  };

  const decreaseQuantity = (id: number) => {
    const updatedCart = cart
      .map((item) => {
        if (item.id === id) {
          return {
            ...item,
            quantity: item.quantity - 1,
          };
        }

        return item;
      })
      .filter((item) => item.quantity > 0);

    saveCart(updatedCart);
  };

  const removeItem = (id: number) => {
    const updatedCart = cart.filter(
      (item) => item.id !== id
    );

    saveCart(updatedCart);
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem("cart");
  };

  const goToCheckout = () => {
    window.location.href = "/checkout";
  };

  const total = cart.reduce((sum, item) => {
    return sum + Number(item.price) * item.quantity;
  }, 0);

  const totalItems = cart.reduce((sum, item) => {
    return sum + item.quantity;
  }, 0);

  if (!loaded) {
    return (
      <main className="min-h-screen bg-gray-100 p-6">
        <div className="mx-auto max-w-7xl">
          <p className="text-gray-500">
            Loading cart...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100 text-gray-900">

      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5">

          <button
            type="button"
            onClick={() => {
              window.location.href = "/";
            }}
            className="text-2xl font-bold text-orange-500"
          >
            AM Whole Sale UK
          </button>

          <button
            type="button"
            onClick={() => {
              window.location.href = "/products";
            }}
            className="font-semibold text-gray-700 hover:text-orange-500"
          >
            Continue Shopping
          </button>

        </div>
      </header>

      {/* Cart Section */}
      <section className="mx-auto max-w-7xl px-4 py-8">

        <div className="mb-6 flex items-center justify-between">

          <h1 className="text-3xl font-bold">
            Shopping Cart
          </h1>

          {cart.length > 0 && (
            <button
              type="button"
              onClick={clearCart}
              className="text-sm font-semibold text-red-500 hover:text-red-700"
            >
              Clear Cart
            </button>
          )}

        </div>

        {/* Empty Cart */}
        {cart.length === 0 ? (

          <div className="rounded-lg bg-white px-6 py-16 text-center shadow-sm">

            <div className="text-6xl">
              🛒
            </div>

            <h2 className="mt-5 text-2xl font-bold">
              Your cart is empty
            </h2>

            <p className="mt-2 text-gray-500">
              Add some products to your cart to continue.
            </p>

            <button
              type="button"
              onClick={() => {
                window.location.href = "/products";
              }}
              className="mt-6 rounded-md bg-orange-500 px-8 py-3 font-bold text-white hover:bg-orange-600"
            >
              Start Shopping
            </button>

          </div>

        ) : (

          <div className="grid gap-8 lg:grid-cols-3">

            {/* Cart Items */}
            <div className="space-y-4 lg:col-span-2">

              {cart.map((item) => (

                <div
                  key={item.id}
                  className="flex flex-col gap-5 rounded-lg bg-white p-5 shadow-sm sm:flex-row sm:items-center"
                >

                  {/* Product Image */}
                  <div className="flex h-32 w-32 shrink-0 items-center justify-center rounded-md bg-gray-100">

                    {item.image ? (

                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-full w-full rounded-md object-contain"
                      />

                    ) : (

                      <span className="text-sm text-gray-400">
                        No Image
                      </span>

                    )}

                  </div>

                  {/* Product Information */}
                  <div className="flex-1">

                    <h2 className="text-lg font-bold">
                      {item.name}
                    </h2>

                    <p className="mt-2 font-semibold text-orange-500">
                      £{Number(item.price).toFixed(2)}
                    </p>

                    {/* Quantity */}
                    <div className="mt-4 flex items-center">

                      <button
                        type="button"
                        onClick={() =>
                          decreaseQuantity(item.id)
                        }
                        className="rounded-l-md border px-4 py-2 text-lg font-bold hover:bg-gray-100"
                      >
                        −
                      </button>

                      <span className="border-y px-5 py-2 font-semibold">
                        {item.quantity}
                      </span>

                      <button
                        type="button"
                        onClick={() =>
                          increaseQuantity(item.id)
                        }
                        className="rounded-r-md border px-4 py-2 text-lg font-bold hover:bg-gray-100"
                      >
                        +
                      </button>

                    </div>

                  </div>

                  {/* Total + Remove */}
                  <div className="flex items-center justify-between gap-5 sm:block sm:text-right">

                    <p className="text-lg font-bold">
                      £
                      {(
                        Number(item.price) *
                        item.quantity
                      ).toFixed(2)}
                    </p>

                    <button
                      type="button"
                      onClick={() =>
                        removeItem(item.id)
                      }
                      className="mt-2 text-sm font-semibold text-red-500 hover:text-red-700"
                    >
                      Remove
                    </button>

                  </div>

                </div>

              ))}

            </div>

            {/* Order Summary */}
            <div className="h-fit rounded-lg bg-white p-6 shadow-sm">

              <h2 className="text-xl font-bold">
                Order Summary
              </h2>

              <div className="mt-6 space-y-4">

                <div className="flex justify-between text-gray-600">
                  <span>
                    Items
                  </span>

                  <span>
                    {totalItems}
                  </span>
                </div>

                <div className="flex justify-between text-gray-600">
                  <span>
                    Subtotal
                  </span>

                  <span>
                    £{total.toFixed(2)}
                  </span>
                </div>

                <div className="flex justify-between text-gray-600">
                  <span>
                    Delivery
                  </span>

                  <span>
                    Calculated at checkout
                  </span>
                </div>

                <div className="border-t pt-4">

                  <div className="flex justify-between text-xl font-bold">

                    <span>
                      Total
                    </span>

                    <span className="text-orange-500">
                      £{total.toFixed(2)}
                    </span>

                  </div>

                </div>

              </div>

              {/* Proceed to Checkout */}
              <button
                type="button"
                onClick={goToCheckout}
                className="mt-6 w-full rounded-md bg-orange-500 py-4 text-lg font-bold text-white hover:bg-orange-600"
              >
                Proceed to Checkout
              </button>

              {/* Continue Shopping */}
              <button
                type="button"
                onClick={() => {
                  window.location.href = "/products";
                }}
                className="mt-3 w-full rounded-md border-2 border-gray-300 py-3 font-semibold text-gray-700 hover:bg-gray-50"
              >
                Continue Shopping
              </button>

            </div>

          </div>

        )}

      </section>

      {/* Footer */}
      <footer className="mt-10 bg-gray-900 py-8 text-center text-white">

        <p className="text-sm text-gray-400">
          © 2026 AM Whole Sale UK. All rights reserved.
        </p>

      </footer>

    </main>
  );
}