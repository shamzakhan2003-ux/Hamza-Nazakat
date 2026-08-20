import Header from "../../components/Header";
import { prisma } from "../../lib/prisma";
import { notFound } from "next/navigation";

type ProductPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function ProductPage({
  params,
}: ProductPageProps) {
  const { id } = await params;

  const productId = Number(id);

  if (Number.isNaN(productId)) {
    notFound();
  }

  const product = await prisma.product.findUnique({
    where: {
      id: productId,
    },
  });

  if (!product) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-gray-100 text-gray-900">
      <Header />

      {/* Breadcrumb */}
      <div className="mx-auto max-w-7xl px-4 py-4">
        <p className="text-sm text-gray-500">
          Home / Products / {product.name}
        </p>
      </div>

      {/* Product Details */}
      <section className="mx-auto max-w-7xl px-4 pb-10">
        <div className="grid gap-8 rounded-lg bg-white p-6 md:grid-cols-2 md:p-10">

          {/* Product Image */}
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
          </div>

          {/* Product Information */}
          <div className="flex flex-col justify-center">

            <p className="text-sm font-semibold uppercase tracking-wider text-orange-500">
              AM Whole Sale UK
            </p>

            <h1 className="mt-3 text-3xl font-bold md:text-4xl">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="mt-4 text-yellow-500">
              ★★★★★
              <span className="ml-2 text-sm text-gray-500">
                ({product.reviews} reviews)
              </span>
            </div>

            {/* Price */}
            <div className="mt-6">
              <span className="text-3xl font-bold text-red-600">
                £{product.price.toString()}
              </span>

              {product.oldPrice ? (
                <span className="ml-3 text-lg text-gray-400 line-through">
                  £{product.oldPrice.toString()}
                </span>
              ) : null}
            </div>

            {/* Description */}
            <div className="mt-6">
              <h2 className="text-lg font-bold">
                Product Description
              </h2>

              <p className="mt-2 leading-7 text-gray-600">
                {product.description ||
                  "High-quality product available from AM Whole Sale UK. Order now and enjoy great value and reliable UK delivery."}
              </p>
            </div>

            {/* Stock */}
            <div className="mt-6">
              {product.stock > 0 ? (
                <p className="font-semibold text-green-600">
                  ✓ In Stock ({product.stock} available)
                </p>
              ) : (
                <p className="font-semibold text-red-600">
                  ✕ Out of Stock
                </p>
              )}
            </div>

            {/* Quantity */}
            <div className="mt-6 flex items-center gap-4">
              <span className="font-semibold">
                Quantity
              </span>

              <div className="flex items-center rounded-md border bg-white">
                <button className="px-4 py-2 text-lg hover:bg-gray-100">
                  −
                </button>

                <span className="border-x px-5 py-2">
                  1
                </span>

                <button className="px-4 py-2 text-lg hover:bg-gray-100">
                  +
                </button>
              </div>
            </div>

            {/* Add to Cart */}
            <button
              disabled={product.stock <= 0}
              className="mt-8 rounded-md bg-orange-500 py-4 text-lg font-bold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:bg-gray-400"
            >
              Add to Cart
            </button>

            {/* Buy Now */}
            <button
              disabled={product.stock <= 0}
              className="mt-3 rounded-md border-2 border-orange-500 py-4 text-lg font-bold text-orange-500 transition hover:bg-orange-50 disabled:cursor-not-allowed disabled:border-gray-400 disabled:text-gray-400"
            >
              Buy Now
            </button>

            {/* Benefits */}
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

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="mx-auto max-w-7xl px-4 py-10 text-center">
          <p className="text-sm text-gray-400">
            © 2026 AM Whole Sale UK. All rights reserved.
          </p>
        </div>
      </footer>
    </main>
  );
}