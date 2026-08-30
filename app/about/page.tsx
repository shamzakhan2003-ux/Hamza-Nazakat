import Link from "next/link";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <section className="bg-gray-900 px-4 py-16 text-white">
        <div className="mx-auto max-w-5xl text-center">
          <p className="mb-3 font-semibold text-orange-400">
            AM Whole Sale Pakistan
          </p>

          <h1 className="text-4xl font-extrabold md:text-5xl">
            About Us
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-lg text-gray-300">
            Quality products, competitive prices, and a simple shopping
            experience for customers across Pakistan.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-12">
        <div className="grid gap-8 md:grid-cols-2">
          <div className="rounded-xl bg-white p-7 shadow-sm">
            <h2 className="mb-4 text-2xl font-bold text-gray-900">
              Who We Are
            </h2>

            <p className="leading-7 text-gray-600">
              AM Whole Sale Pakistan is an online shopping store focused on
              providing a variety of useful products at competitive prices.
              Our goal is to make online shopping simple, convenient, and
              reliable for customers in Pakistan.
            </p>
          </div>

          <div className="rounded-xl bg-white p-7 shadow-sm">
            <h2 className="mb-4 text-2xl font-bold text-gray-900">
              What We Sell
            </h2>

            <p className="leading-7 text-gray-600">
              Our store offers products across categories such as
              electronics, mobile phone and accessories, toys, home
              essentials, and other everyday products.
            </p>
          </div>
        </div>

        <div className="mt-8 rounded-xl bg-white p-7 shadow-sm">
          <h2 className="mb-4 text-2xl font-bold text-gray-900">
            Our Commitment
          </h2>

          <div className="grid gap-6 md:grid-cols-3">
            <div>
              <div className="mb-3 text-3xl">✓</div>
              <h3 className="font-bold">Quality Products</h3>
              <p className="mt-2 text-sm leading-6 text-gray-600">
                We aim to offer products that provide good value and meet
                customer expectations.
              </p>
            </div>

            <div>
              <div className="mb-3 text-3xl">✓</div>
              <h3 className="font-bold">Competitive Prices</h3>
              <p className="mt-2 text-sm leading-6 text-gray-600">
                We work to keep our prices competitive so customers can shop
                with confidence.
              </p>
            </div>

            <div>
              <div className="mb-3 text-3xl">✓</div>
              <h3 className="font-bold">Customer Support</h3>
              <p className="mt-2 text-sm leading-6 text-gray-600">
                Our customers can contact us for help with products, orders,
                delivery, returns, and other questions.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 rounded-xl bg-orange-50 p-7 text-center">
          <h2 className="text-2xl font-bold text-gray-900">
            Have a Question?
          </h2>

          <p className="mt-2 text-gray-600">
            Our support team is here to help.
          </p>

          <Link
            href="/contact"
            className="mt-5 inline-block rounded-md bg-orange-500 px-6 py-3 font-semibold text-white transition hover:bg-orange-600"
          >
            Contact Us
          </Link>
        </div>
      </section>
    </main>
  );
}