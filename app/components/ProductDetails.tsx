"use client";

import { useState } from "react";

type Product = {
  id: number;
  name: string;
  price: string;
  oldPrice: string | null;
  discount: number | null;
  image: string | null;
  description: string | null;
  stock: number;
  reviews: number;
};

type CartItem = {
  id: number;
  name: string;
  price: string;
  image: string | null;
  quantity: number;
};

export default function ProductDetails({
  product,
}: {
  product: Product;
}) {
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [cartError, setCartError] = useState("");

  const outOfStock = product.stock <= 0;

  const decreaseQuantity = () => {
    setQuantity((current) => Math.max(1, current - 1));
  };

  const increaseQuantity = () => {
    if (outOfStock) return;

    setQuantity((current) =>
      Math.min(product.stock, current + 1)
    );
  };

  const addToCart = () => {
    if (outOfStock) {
      setCartError("This product is currently out of stock.");
      return;
    }

    try {
      setCartError("");

      const savedCart = localStorage.getItem("cart");

      const cart: CartItem[] = savedCart
        ? JSON.parse(savedCart)
        : [];

      const existingProduct = cart.find(
        (item) => item.id === product.id
      );

      if (existingProduct) {
        const newQuantity = Math.min(
          product.stock,
          existingProduct.quantity + quantity
        );

        existingProduct.quantity = newQuantity;
      } else {
        cart.push({
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          quantity: Math.min(quantity, product.stock),
        });
      }

      localStorage.setItem("cart", JSON.stringify(cart));

      setAdded(true);

      setTimeout(() => {
        setAdded(false);
      }, 2000);
    } catch (error) {
      console.error("Cart error:", error);
      setCartError("Unable to add product to cart.");
    }
  };

  const buyNow = () => {
    if (outOfStock) return;

    addToCart();

    setTimeout(() => {
      window.location.href = "/cart";
    }, 300);
  };

  return (
    <>
      <div className="mx-auto max-w-7xl px-4 py-4">
        <p className="text-sm text-gray-500">
          Home / Products / {product.name}
        </p>
      </div>

      <section className="mx-auto max-w-7xl px-4 pb-10">
        <div className="grid gap-8 rounded-lg bg-white p-6 md:grid-cols-2 md:p-10">

          <div className="relative flex min-h-[450px] items-center justify-center rounded-lg bg-gray-100">
            {product.image ? (
              <img
                src={product.image}
                alt={product.name}
                className="max-h-[450px] w-full rounded-lg object-contain"
              />
            ) : (
              <span className="text-gray-400">
                Product Image
              </span>
            )}

            {product.discount ? (
              <span className="absolute left-4 top-4 rounded bg-red-500 px-3 py-2 text-sm font-bold text-white">
                {product.discount}% OFF
              </span>
            ) : null}

            {outOfStock && (
              <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-black/40">
                <span className="rounded-md bg-red-600 px-6 py-3 text-xl font-bold text-white">
                  OUT OF STOCK
                </span>
              </div>
            )}
          </div>

          <div className="flex flex-col justify-center">

            <p className="text-sm font-semibold uppercase tracking-wider text-orange-500">
              AM Whole Sale UK
            </p>

            <h1 className="mt-3 text-3xl font-bold md:text-4xl">
              {product.name}
            </h1>

            <div className="mt-4 text-yellow-500">
              ★★★★★

              <span className="ml-2 text-sm text-gray-500">
                ({product.reviews} reviews)
              </span>
            </div>

            <div className="mt-6">
              <span className="text-3xl font-bold text-red-600">
                £{product.price}
              </span>

              {product.oldPrice ? (
                <span className="ml-3 text-lg text-gray-400 line-through">
                  £{product.oldPrice}
                </span>
              ) : null}
            </div>

            <div className="mt-6">
              <h2 className="text-lg font-bold">
                Product Description
              </h2>

              <p className="mt-2 leading-7 text-gray-600">
                {product.description ||
                  "High-quality product available from AM Whole Sale UK. Order now and enjoy great value and reliable UK delivery."}
              </p>
            </div>

            <div className="mt-6">
              {outOfStock ? (
                <div className="rounded-md bg-red-100 px-4 py-3 font-bold text-red-700">
                  Out of Stock
                </div>
              ) : (
                <p className="font-semibold text-green-600">
                  ✓ In Stock ({product.stock} available)
                </p>
              )}
            </div>

            <div className="mt-6 flex items-center gap-4">
              <span className="font-semibold">
                Quantity
              </span>

              <div className="flex items-center overflow-hidden rounded-md border bg-white">

                <button
                  type="button"
                  onClick={decreaseQuantity}
                  disabled={
                    outOfStock ||
                    quantity <= 1
                  }
                  className="px-5 py-2 text-xl font-bold hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  −
                </button>

                <span className="min-w-[55px] border-x px-4 py-2 text-center font-semibold">
                  {quantity}
                </span>

                <button
                  type="button"
                  onClick={increaseQuantity}
                  disabled={
                    outOfStock ||
                    quantity >= product.stock
                  }
                  className="px-5 py-2 text-xl font-bold hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  +
                </button>

              </div>
            </div>

            {cartError && (
              <div className="mt-4 rounded-md bg-red-100 px-4 py-3 font-semibold text-red-700">
                {cartError}
              </div>
            )}

            <button
              type="button"
              onClick={addToCart}
              disabled={outOfStock}
              className="mt-8 rounded-md bg-orange-500 py-4 text-lg font-bold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:bg-gray-400"
            >
              {outOfStock
                ? "Out of Stock"
                : added
                  ? "✓ Added to Cart"
                  : "Add to Cart"}
            </button>

            <button
              type="button"
              onClick={() => {
                window.location.href = "/cart";
              }}
              className="mt-3 rounded-md border-2 border-gray-300 py-4 text-lg font-bold text-gray-700 transition hover:bg-gray-50"
            >
              View Cart
            </button>

            <button
              type="button"
              onClick={buyNow}
              disabled={outOfStock}
              className="mt-3 rounded-md border-2 border-orange-500 py-4 text-lg font-bold text-orange-500 transition hover:bg-orange-50 disabled:cursor-not-allowed disabled:border-gray-400 disabled:text-gray-400"
            >
              {outOfStock ? "Out of Stock" : "Buy Now"}
            </button>

            <div className="mt-8 grid grid-cols-3 gap-3 border-t pt-6 text-center">

              <div>
                <div className="text-2xl">
                  🚚
                </div>

                <p className="mt-1 text-xs text-gray-500">
                  Fast Delivery
                </p>
              </div>

              <div>
                <div className="text-2xl">
                  🔒
                </div>

                <p className="mt-1 text-xs text-gray-500">
                  Secure Payment
                </p>
              </div>

              <div>
                <div className="text-2xl">
                  ↩️
                </div>

                <p className="mt-1 text-xs text-gray-500">
                  Easy Returns
                </p>
              </div>

            </div>

          </div>
        </div>
      </section>
    </>
  );
}