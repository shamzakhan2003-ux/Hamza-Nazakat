"use client";

import { useState } from "react";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!name.trim() || !email.trim() || !message.trim()) {
      return;
    }

    const whatsappMessage = `Hello Click&Pick,

Name: ${name}
Email: ${email}

Message:
${message}`;

    const whatsappUrl = `https://wa.me/447721190079?text=${encodeURIComponent(
      whatsappMessage
    )}`;

    window.open(whatsappUrl, "_blank");

    setSent(true);
    setName("");
    setEmail("");
    setMessage("");
  };

  const contactSchema = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: "Contact Click&Pick UK",
    description:
      "Contact Click&Pick UK for customer support, orders, products, delivery, returns and general enquiries.",
    url: "https://clickpick.uk/contact",
    mainEntity: {
      "@type": "Organization",
      name: "Click&Pick",
      url: "https://clickpick.uk",
      email: "shamzakhan2003@gmail.com",
      contactPoint: {
        "@type": "ContactPoint",
        telephone: "+447721190079",
        contactType: "customer service",
        availableLanguage: ["English"],
      },
    },
  };

  return (
    <>
      <title>Contact Us | Click&Pick UK</title>

      <meta
        name="description"
        content="Contact Click&Pick UK for help with orders, products, delivery, returns and general enquiries. Get in touch by WhatsApp or email."
      />

      <link
        rel="canonical"
        href="https://clickpick.uk/contact"
      />

      <meta
        property="og:title"
        content="Contact Us | Click&Pick UK"
      />

      <meta
        property="og:description"
        content="Contact Click&Pick UK for customer support, orders, products, delivery and general enquiries."
      />

      <meta
        property="og:url"
        content="https://clickpick.uk/contact"
      />

      <meta
        property="og:type"
        content="website"
      />

      <meta
        property="og:site_name"
        content="Click&Pick"
      />

      <meta
        property="og:locale"
        content="en_GB"
      />

      <meta
        name="twitter:card"
        content="summary_large_image"
      />

      <meta
        name="twitter:title"
        content="Contact Us | Click&Pick UK"
      />

      <meta
        name="twitter:description"
        content="Contact Click&Pick UK for customer support, orders, delivery and general enquiries."
      />

      <meta
        name="robots"
        content="index, follow"
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(contactSchema),
        }}
      />

      <main className="min-h-screen bg-gray-100 text-gray-900">
        {/* Header */}
        <header className="border-b bg-white shadow-sm">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5">
            <a
              href="/"
              aria-label="Click&Pick UK - Online Shopping Home"
              className="text-xl font-extrabold md:text-2xl"
            >
              Click&Pick
            </a>

            <a
              href="/"
              className="text-sm font-semibold text-gray-600 hover:text-orange-500"
            >
              Back to Store
            </a>
          </div>
        </header>

        {/* Contact Page */}
        <section
          className="mx-auto max-w-6xl px-4 py-10"
          aria-labelledby="contact-page-title"
        >
          {/* Page Title */}
          <div className="text-center">
            <p className="text-sm font-bold uppercase tracking-widest text-orange-500">
              Click&Pick UK
            </p>

            <h1
              id="contact-page-title"
              className="mt-2 text-3xl font-extrabold md:text-4xl"
            >
              Contact Us
            </h1>

            <p className="mx-auto mt-3 max-w-2xl text-gray-500">
              Have a question or need help with an order, product, delivery,
              return or general enquiry? Contact Click&Pick UK through
              WhatsApp, email, or send us a message.
            </p>
          </div>

          {/* Contact Options */}
          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {/* WhatsApp */}
            <a
              href="https://wa.me/447721190079"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Contact Click&Pick UK on WhatsApp"
              className="group rounded-xl bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="flex items-center gap-4">
                <div
                  className="flex h-14 w-14 items-center justify-center rounded-full bg-green-500 text-2xl text-white"
                  aria-hidden="true"
                >
                  {"\u{1F4AC}"}
                </div>

                <div>
                  <h2 className="text-xl font-bold">
                    WhatsApp
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    Chat with us directly on WhatsApp
                  </p>
                </div>
              </div>

              <div className="mt-5 text-sm font-semibold text-green-600">
                WhatsApp: 07721 190079 {"\u{2192}"}
              </div>
            </a>

            {/* Email */}
            <a
              href="mailto:shamzakhan2003@gmail.com"
              aria-label="Email Click&Pick UK customer support"
              className="group rounded-xl bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="flex items-center gap-4">
                <div
                  className="flex h-14 w-14 items-center justify-center rounded-full bg-orange-500 text-2xl text-white"
                  aria-hidden="true"
                >
                  {"\u{2709}"}
                </div>

                <div>
                  <h2 className="text-xl font-bold">
                    Email
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    Send us an email
                  </p>
                </div>
              </div>

              <div className="mt-5 break-all text-sm font-semibold text-orange-500">
                shamzakhan2003@gmail.com {"\u{2192}"}
              </div>
            </a>
          </div>

          {/* Send Us a Message */}
          <div className="mx-auto mt-8 max-w-3xl rounded-xl bg-white p-6 shadow-sm md:p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold">
                Send Us a Message
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Fill in the form and your message will open directly in
                WhatsApp.
              </p>
            </div>

            {sent && (
              <div
                role="status"
                className="mb-6 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm font-semibold text-green-700"
              >
                {"\u{2713}"} Your message is ready to send on WhatsApp.
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >
              {/* Name */}
              <div>
                <label
                  htmlFor="contact-name"
                  className="mb-2 block text-sm font-semibold"
                >
                  Your Name
                </label>

                <input
                  id="contact-name"
                  type="text"
                  value={name}
                  onChange={(event) =>
                    setName(event.target.value)
                  }
                  placeholder="Enter your name"
                  autoComplete="name"
                  className="w-full rounded-lg border px-4 py-3 outline-none transition focus:border-orange-500"
                  required
                />
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="contact-email"
                  className="mb-2 block text-sm font-semibold"
                >
                  Email Address
                </label>

                <input
                  id="contact-email"
                  type="email"
                  value={email}
                  onChange={(event) =>
                    setEmail(event.target.value)
                  }
                  placeholder="Enter your email"
                  autoComplete="email"
                  className="w-full rounded-lg border px-4 py-3 outline-none transition focus:border-orange-500"
                  required
                />
              </div>

              {/* Message */}
              <div>
                <label
                  htmlFor="contact-message"
                  className="mb-2 block text-sm font-semibold"
                >
                  Message
                </label>

                <textarea
                  id="contact-message"
                  value={message}
                  onChange={(event) =>
                    setMessage(event.target.value)
                  }
                  placeholder="How can we help you?"
                  rows={6}
                  className="w-full resize-none rounded-lg border px-4 py-3 outline-none transition focus:border-orange-500"
                  required
                />
              </div>

              {/* Send */}
              <button
                type="submit"
                className="w-full rounded-lg bg-orange-500 px-6 py-3 font-bold text-white transition hover:bg-orange-600"
              >
                Send Message
              </button>
            </form>
          </div>

          {/* Customer Support */}
          <div className="mx-auto mt-8 max-w-3xl rounded-xl bg-gray-900 p-7 text-center text-white">
            <div
              className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-orange-500 text-2xl"
              aria-hidden="true"
            >
              {"\u{1F916}"}
            </div>

            <h2 className="mt-4 text-xl font-bold">
              Need Instant Help?
            </h2>

            <p className="mt-2 text-sm text-gray-300">
              Chat with our Gemini AI Customer Support Assistant for
              instant help.
            </p>

            <a
              href="/customer-support"
              className="mt-5 inline-block rounded-lg bg-orange-500 px-6 py-3 font-bold text-white transition hover:bg-orange-600"
            >
              Open Customer Support
            </a>
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-10 bg-gray-900 py-6 text-center text-sm text-gray-400">
          {"\u{00A9}"} 2026 Click&Pick. All rights reserved.
        </footer>
      </main>
    </>
  );
}