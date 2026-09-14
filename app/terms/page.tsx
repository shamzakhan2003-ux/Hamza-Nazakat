import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms & Conditions | Click&Pick UK",
  description:
    "Read the Click&Pick UK Terms & Conditions covering website use, products, prices, orders, accounts, delivery, returns, refunds, and customer responsibilities.",
  alternates: {
    canonical: "https://clickpick.uk/terms",
  },
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: "https://clickpick.uk/terms",
    siteName: "Click&Pick",
    title: "Terms & Conditions | Click&Pick UK",
    description:
      "Review the Click&Pick UK Terms & Conditions for website use, products, orders, delivery, returns, refunds, and accounts.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Terms & Conditions | Click&Pick UK",
    description:
      "Review the Click&Pick UK Terms & Conditions for website use, orders, delivery, returns, refunds, and accounts.",
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

export default function TermsPage() {
  const termsPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Terms & Conditions | Click&Pick UK",
    url: "https://clickpick.uk/terms",
    description:
      "Terms and Conditions for using the Click&Pick UK ecommerce website and placing orders.",
    isPartOf: {
      "@type": "WebSite",
      name: "Click&Pick",
      url: "https://clickpick.uk",
    },
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <section
        className="bg-gray-900 px-4 py-14 text-white"
        aria-labelledby="terms-title"
      >
        <div className="mx-auto max-w-5xl text-center">
          <p className="mb-3 font-semibold text-orange-400">
            Click&Pick
          </p>

          <h1
            id="terms-title"
            className="text-4xl font-extrabold"
          >
            Terms & Conditions
          </h1>

          <p className="mt-4 text-gray-300">
            Please read these terms before using our website or placing an
            order.
          </p>
        </div>
      </section>

      <section
        className="mx-auto max-w-5xl px-4 py-12"
        aria-label="Click&Pick Terms and Conditions"
      >
        <div className="space-y-6 rounded-xl bg-white p-6 shadow-sm md:p-8">
          <section>
            <h2 className="text-2xl font-bold text-gray-900">
              1. General Terms
            </h2>

            <p className="mt-3 leading-7 text-gray-600">
              By using the Click&Pick website, you agree to use
              the website lawfully and responsibly and to comply with these
              Terms & Conditions.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900">
              2. Products and Information
            </h2>

            <p className="mt-3 leading-7 text-gray-600">
              We make reasonable efforts to display accurate product names,
              descriptions, images, prices, and availability. Product
              information may occasionally change or contain errors, and we
              reserve the right to correct such information.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900">
              3. Prices
            </h2>

            <p className="mt-3 leading-7 text-gray-600">
              Product prices are displayed in British Pounds (GBP/£).
              Prices and promotional offers may change without prior notice.
              The applicable price for an order will be the price shown at
              the time the order is placed, subject to correction of obvious
              errors.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900">
              4. Orders
            </h2>

            <p className="mt-3 leading-7 text-gray-600">
              Placing an order does not automatically guarantee acceptance.
              We may cancel or decline an order in circumstances such as
              product unavailability, pricing errors, suspected fraudulent
              activity, or other legitimate reasons.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900">
              5. Customer Accounts
            </h2>

            <p className="mt-3 leading-7 text-gray-600">
              Customers are responsible for providing accurate information
              and maintaining the security of their account credentials.
              Customers should notify us if they believe their account has
              been accessed without authorization.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900">
              6. Delivery
            </h2>

            <p className="mt-3 leading-7 text-gray-600">
              Delivery times may vary depending on the destination,
              availability, courier service, weather, and other circumstances.
              Customers should provide a complete and accurate delivery
              address and contact information.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900">
              7. Returns and Refunds
            </h2>

            <p className="mt-3 leading-7 text-gray-600">
              Returns and refunds are handled according to our Returns &
              Refunds policy. Customers should review that policy and contact
              customer support if they receive an incorrect, damaged, or
              otherwise eligible product.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900">
              8. Prohibited Use
            </h2>

            <p className="mt-3 leading-7 text-gray-600">
              Customers must not misuse the website, attempt unauthorized
              access, interfere with website operations, submit false
              information, or use the website for unlawful activities.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900">
              9. Website Content
            </h2>

            <p className="mt-3 leading-7 text-gray-600">
              Website content, including text, graphics, logos, and other
              materials, may not be copied, reproduced, or used commercially
              without appropriate authorization.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900">
              10. Changes to These Terms
            </h2>

            <p className="mt-3 leading-7 text-gray-600">
              We may update these Terms & Conditions when necessary. Updated
              terms will be published on this page, and continued use of the
              website after an update may constitute acceptance of the
              revised terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900">
              11. Contact Us
            </h2>

            <p className="mt-3 leading-7 text-gray-600">
              If you have questions about these Terms & Conditions, orders,
              products, delivery, returns, or refunds, please contact
              Click&Pick through our Contact Us page.
            </p>
          </section>
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(termsPageSchema),
        }}
      />
    </main>
  );
}