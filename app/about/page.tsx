import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About Us | Click&Pick UK",
  description:
    "Learn more about Click&Pick UK, an online shopping store offering quality products, competitive prices, and a simple shopping experience across the UK.",
  alternates: {
    canonical: "https://clickpick.uk/about",
  },
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: "https://clickpick.uk/about",
    siteName: "Click&Pick",
    title: "About Us | Click&Pick UK",
    description:
      "Learn more about Click&Pick UK and our commitment to quality products, competitive prices, and reliable online shopping.",
  },
  twitter: {
    card: "summary_large_image",
    title: "About Us | Click&Pick UK",
    description:
      "Learn more about Click&Pick UK, our products, prices, and commitment to customers across the UK.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export default function AboutPage() {
  const aboutPageSchema = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: "About Click&Pick UK",
    url: "https://clickpick.uk/about",
    description:
      "Learn more about Click&Pick, an online shopping store serving customers across the UK.",
    isPartOf: {
      "@type": "WebSite",
      name: "Click&Pick",
      url: "https://clickpick.uk",
    },
    about: {
      "@type": "Organization",
      name: "Click&Pick",
      url: "https://clickpick.uk",
    },
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <section
        className="bg-gray-900 px-4 py-16 text-white"
        aria-labelledby="about-page-title"
      >
        <div className="mx-auto max-w-5xl text-center">
          <p className="mb-3 font-semibold text-orange-400">
            Click&Pick
          </p>

          <h1
            id="about-page-title"
            className="text-4xl font-extrabold md:text-5xl"
          >
            About Us
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-lg text-gray-300">
            Quality products, competitive prices, and a simple shopping
            experience for customers across the UK.
          </p>
        </div>
      </section>

      <section
        className="mx-auto max-w-5xl px-4 py-12"
        aria-label="About Click&Pick"
      >
        <div className="grid gap-8 md:grid-cols-2">
          <section className="rounded-xl bg-white p-7 shadow-sm">
            <h2 className="mb-4 text-2xl font-bold text-gray-900">
              Who We Are
            </h2>

            <p className="leading-7 text-gray-600">
              Click&Pick is an online shopping store focused on
              providing a variety of useful products at competitive prices.
              Our goal is to make online shopping simple, convenient, and
              reliable for customers in the UK.
            </p>
          </section>

          <section className="rounded-xl bg-white p-7 shadow-sm">
            <h2 className="mb-4 text-2xl font-bold text-gray-900">
              What We Sell
            </h2>

            <p className="leading-7 text-gray-600">
              Our store offers products across categories such as
              electronics, mobile phone and accessories, toys, home
              essentials, and other everyday products.
            </p>
          </section>
        </div>

        <section className="mt-8 rounded-xl bg-white p-7 shadow-sm">
          <h2 className="mb-4 text-2xl font-bold text-gray-900">
            Our Commitment
          </h2>

          <div className="grid gap-6 md:grid-cols-3">
            <div>
              <div
                className="mb-3 text-3xl"
                aria-hidden="true"
              >
                ✓
              </div>

              <h3 className="font-bold">
                Quality Products
              </h3>

              <p className="mt-2 text-sm leading-6 text-gray-600">
                We aim to offer products that provide good value and meet
                customer expectations.
              </p>
            </div>

            <div>
              <div
                className="mb-3 text-3xl"
                aria-hidden="true"
              >
                ✓
              </div>

              <h3 className="font-bold">
                Competitive Prices
              </h3>

              <p className="mt-2 text-sm leading-6 text-gray-600">
                We work to keep our prices competitive so customers can shop
                with confidence.
              </p>
            </div>

            <div>
              <div
                className="mb-3 text-3xl"
                aria-hidden="true"
              >
                ✓
              </div>

              <h3 className="font-bold">
                Customer Support
              </h3>

              <p className="mt-2 text-sm leading-6 text-gray-600">
                Our customers can contact us for help with products, orders,
                delivery, returns, and other questions.
              </p>
            </div>
          </div>
        </section>

        <section
          className="mt-8 rounded-xl bg-orange-50 p-7 text-center"
          aria-labelledby="about-contact-title"
        >
          <h2
            id="about-contact-title"
            className="text-2xl font-bold text-gray-900"
          >
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
        </section>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(aboutPageSchema),
        }}
      />
    </main>
  );
}