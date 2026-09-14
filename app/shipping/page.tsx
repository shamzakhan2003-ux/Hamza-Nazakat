import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shipping Information | Click&Pick UK",
  description:
    "Learn about Click&Pick UK shipping, delivery times, order dispatch, tracking information and UK-wide delivery coverage.",
  alternates: {
    canonical: "https://clickpick.uk/shipping",
  },
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: "https://clickpick.uk/shipping",
    siteName: "Click&Pick",
    title: "Shipping Information | Click&Pick UK",
    description:
      "Learn about Click&Pick UK delivery times, dispatch, order tracking and UK-wide shipping.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Shipping Information | Click&Pick UK",
    description:
      "Learn about Click&Pick UK delivery times, dispatch, tracking and UK-wide shipping.",
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

export default function ShippingPage() {
  const shippingSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Shipping Information | Click&Pick UK",
    description:
      "Learn about Click&Pick UK shipping, delivery times, order dispatch, tracking information and UK-wide delivery coverage.",
    url: "https://clickpick.uk/shipping",
    isPartOf: {
      "@type": "WebSite",
      name: "Click&Pick",
      url: "https://clickpick.uk/",
    },
    inLanguage: "en-GB",
  };

  return (
    <main
      className="min-h-screen bg-gray-100 text-gray-900"
      aria-labelledby="shipping-page-title"
    >
      <div className="mx-auto max-w-4xl px-4 py-10">

        {/* Page Header */}
        <div className="mb-8 text-center">
          <h1 id="shipping-page-title" className="text-4xl font-extrabold">
            Shipping Information
          </h1>

          <p className="mt-3 text-gray-500">
            Everything you need to know about delivery and order tracking.
          </p>
        </div>

        {/* Delivery Time */}
        <section
          className="mb-5 rounded-xl bg-white p-6 shadow-sm"
          aria-labelledby="delivery-time-heading"
        >
          <div className="flex items-start gap-4">
            <div className="text-4xl" aria-hidden="true">
              🚚
            </div>

            <div>
              <h2 id="delivery-time-heading" className="text-2xl font-bold">
                Delivery Time
              </h2>

              <p className="mt-3 leading-7 text-gray-600">
                We aim to deliver all orders within{" "}
                <strong>3–5 working days</strong> across the UK.
              </p>

              <p className="mt-2 leading-7 text-gray-600">
                Delivery times may vary slightly depending on your location
                and courier service.
              </p>
            </div>
          </div>
        </section>

        {/* Handling & Dispatch */}
        <section
          className="mb-5 rounded-xl bg-white p-6 shadow-sm"
          aria-labelledby="handling-dispatch-heading"
        >
          <div className="flex items-start gap-4">
            <div className="text-4xl" aria-hidden="true">
              🚚
            </div>

            <div>
              <h2
                id="handling-dispatch-heading"
                className="text-2xl font-bold"
              >
                Handling & Dispatch
              </h2>

              <p className="mt-3 leading-7 text-gray-600">
                Orders are processed and prepared for dispatch{" "}
                <strong>the same day</strong> when placed during our
                working hours.
              </p>

              <p className="mt-2 leading-7 text-gray-600">
                Orders placed outside working hours, on weekends, or public
                holidays may be dispatched on the next working day.
              </p>
            </div>
          </div>
        </section>

        {/* Tracking Information */}
        <section
          className="mb-5 rounded-xl bg-white p-6 shadow-sm"
          aria-labelledby="tracking-information-heading"
        >
          <div className="flex items-start gap-4">
            <div className="text-4xl" aria-hidden="true">
              🚚
            </div>

            <div>
              <h2
                id="tracking-information-heading"
                className="text-2xl font-bold"
              >
                Tracking Information
              </h2>

              <p className="mt-3 leading-7 text-gray-600">
                Once your order has been dispatched, the{" "}
                <strong>tracking information will be uploaded</strong> and
                sent to you by email.
              </p>

              <p className="mt-2 leading-7 text-gray-600">
                You can use the tracking information provided in your email
                to follow the progress of your delivery.
              </p>
            </div>
          </div>
        </section>

        {/* Delivery Coverage */}
        <section
          className="mb-5 rounded-xl bg-white p-6 shadow-sm"
          aria-labelledby="delivery-coverage-heading"
        >
          <div className="flex items-start gap-4">
            <div className="text-4xl" aria-hidden="true">
              🇬🇧
            </div>

            <div>
              <h2
                id="delivery-coverage-heading"
                className="text-2xl font-bold"
              >
                Delivery Across the UK
              </h2>

              <p className="mt-3 leading-7 text-gray-600">
                We provide delivery services across the UK. Our courier
                partners deliver orders to major cities as well as many
                other areas across the country.
              </p>
            </div>
          </div>
        </section>

        {/* Important Information */}
        <section
          className="rounded-xl bg-white p-6 shadow-sm"
          aria-labelledby="important-information-heading"
        >
          <h2
            id="important-information-heading"
            className="text-2xl font-bold"
          >
            Important Information
          </h2>

          <div className="mt-4 space-y-3 text-gray-600">
            <p>
              <strong>✓</strong> Please make sure your delivery address and
              contact number are correct when placing your order.
            </p>

            <p>
              <strong>✓</strong> Delivery time is normally 3–5 working days,
              but unexpected courier delays may occasionally occur.
            </p>

            <p>
              <strong>✓</strong> Tracking details will be provided after
              dispatch.
            </p>

            <p>
              <strong>✓</strong> Please keep your phone available so the
              courier can contact you when required.
            </p>
          </div>
        </section>

      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(shippingSchema),
        }}
      />
    </main>
  );
}