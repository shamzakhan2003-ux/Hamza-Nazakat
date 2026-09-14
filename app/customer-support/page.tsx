"use client";

import { useState } from "react";

type Message = {
  role: "user" | "assistant";
  text: string;
};

export default function CustomerSupportPage() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      text: "Hello! 🤖 Welcome to Click&Pick Customer Support. How can I help you today?",
    },
  ]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    const text = message.trim();

    if (!text || loading) return;

    setMessages((current) => [
      ...current,
      {
        role: "user",
        text,
      },
    ]);

    setMessage("");
    setLoading(true);

    try {
      const response = await fetch("/api/customer-support", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: text,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong.");
      }

      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          text:
            data.reply ||
            "Sorry, I couldn't generate a response.",
        },
      ]);
    } catch (error) {
      console.error("Customer support error:", error);

      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          text: "Sorry, customer support is temporarily unavailable. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === "Enter") {
      sendMessage();
    }
  };

  const supportSchema = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: "Click&Pick Customer Support",
    description:
      "Get instant customer support from Click&Pick UK for questions about products, orders, delivery, returns and general enquiries.",
    url: "https://clickpick.uk/customer-support",
    isPartOf: {
      "@type": "WebSite",
      name: "Click&Pick",
      url: "https://clickpick.uk",
    },
    mainEntity: {
      "@type": "Organization",
      name: "Click&Pick",
      url: "https://clickpick.uk",
    },
  };

  return (
    <main className="min-h-screen bg-gray-100 text-gray-900">
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(supportSchema),
        }}
      />

      {/* Header */}
      <header className="border-b bg-white shadow-sm">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-5">
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

      {/* Customer Support */}
      <section
        className="mx-auto max-w-4xl px-4 py-8"
        aria-labelledby="customer-support-title"
      >
        <div className="overflow-hidden rounded-xl bg-white shadow-sm">
          {/* Support Header */}
          <div className="bg-gray-900 px-6 py-7 text-white">
            <div className="flex items-center gap-4">
              <div
                className="flex h-14 w-14 items-center justify-center rounded-full bg-orange-500 text-2xl"
                aria-hidden="true"
              >
                🤖
              </div>

              <div>
                <h1
                  id="customer-support-title"
                  className="text-2xl font-bold"
                >
                  Customer Support
                </h1>

                <p className="mt-1 text-sm text-gray-300">
                  AI Assistant • Available 24/7
                </p>
              </div>
            </div>
          </div>

          {/* Chat */}
          <div
            className="h-[500px] space-y-4 overflow-y-auto bg-gray-50 p-5"
            aria-live="polite"
            aria-label="Customer support conversation"
          >
            {messages.map((item, index) => (
              <div
                key={index}
                className={`flex ${
                  item.role === "user"
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-6 ${
                    item.role === "user"
                      ? "rounded-br-sm bg-orange-500 text-white"
                      : "rounded-bl-sm bg-white text-gray-800 shadow-sm"
                  }`}
                >
                  {item.text}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div
                  className="rounded-2xl rounded-bl-sm bg-white px-4 py-3 text-sm text-gray-500 shadow-sm"
                  role="status"
                >
                  Gemini is typing...
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="border-t bg-white p-4">
            <div className="flex gap-3">
              <input
                type="text"
                value={message}
                onChange={(event) =>
                  setMessage(event.target.value)
                }
                onKeyDown={handleKeyDown}
                disabled={loading}
                placeholder="Ask us anything..."
                aria-label="Ask Click&Pick customer support"
                autoComplete="off"
                className="min-w-0 flex-1 rounded-lg border px-4 py-3 outline-none focus:border-orange-500 disabled:bg-gray-100"
              />

              <button
                type="button"
                onClick={sendMessage}
                disabled={
                  loading || !message.trim()
                }
                aria-label={
                  loading
                    ? "Sending message"
                    : "Send message to customer support"
                }
                className="rounded-lg bg-orange-500 px-6 py-3 font-bold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:bg-gray-300"
              >
                {loading ? "..." : "Send"}
              </button>
            </div>

            <p className="mt-2 text-center text-xs text-gray-400">
              Powered by Gemini AI
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-8 bg-gray-900 py-6 text-center text-sm text-gray-400">
        © 2026 Click&Pick. All rights reserved.
      </footer>
    </main>
  );
}