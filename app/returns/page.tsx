"use client";

import { ChangeEvent, FormEvent, useState } from "react";

export default function ReturnsPage() {
  const [videoName, setVideoName] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const [form, setForm] = useState({
    orderNumber: "",
    fullName: "",
    email: "",
    phone: "",
    reason: "",
    description: "",
  });

  function handleChange(
    event: ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  }

  function handleVideoChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      setVideoName("");
      return;
    }

    if (!file.type.startsWith("video/")) {
      alert("Please select a valid video file.");
      event.target.value = "";
      setVideoName("");
      return;
    }

    setVideoName(file.name);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!videoName) {
      alert("Please upload your unboxing video.");
      return;
    }

    setSubmitted(true);
    alert("Your refund request has been submitted successfully.");
  }

  function openWhatsApp() {
    window.location.href = "/contact";
  }

  return (
    <main className="min-h-screen bg-gray-100 text-gray-900">
      <div className="mx-auto max-w-4xl px-4 py-10">

        <div className="mb-8 text-center">
          <h1 className="text-4xl font-extrabold">
            Returns & Refunds
          </h1>

          <p className="mt-3 text-gray-500">
            Please read our return and refund policy before submitting a request.
          </p>
        </div>

        <section className="mb-5 rounded-xl bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-bold">
            Return Policy
          </h2>

          <p className="mt-3 leading-7 text-gray-600">
            Returns are accepted within{" "}
            <strong>7 days of delivery</strong> if the product is{" "}
            <strong>damaged, defective, or incorrect upon arrival</strong>.
          </p>
        </section>

        <section className="mb-5 rounded-xl bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-bold">
            How to Claim a Refund
          </h2>

          <p className="mt-3 leading-7 text-gray-600">
            Customers are requested to record a{" "}
            <strong>short unboxing video</strong> when receiving their order.
            The unboxing video is required to support a refund claim for
            damaged, defective, or incorrect products.
          </p>

          <div className="mt-5 space-y-3 text-gray-600">
            <p>
              <strong>1.</strong> Enter your Order Number and refund details
              in the form below.
            </p>

            <p>
              <strong>2.</strong> Upload the unboxing video with your refund
              request.
            </p>

            <p>
              <strong>3.</strong> Send the same unboxing video to us on
              WhatsApp for verification.
            </p>

            <p>
              <strong>4.</strong> Our team will review the request and video
              before processing the refund.
            </p>
          </div>
        </section>

        <section className="mb-5 rounded-xl bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-bold">
            Refund Processing
          </h2>

          <p className="mt-3 leading-7 text-gray-600">
            Once the returned item has been received and checked, the refund
            will be processed within <strong>3 working days</strong>.
          </p>
        </section>

        <section className="rounded-xl bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-bold">
            Claim a Refund
          </h2>

          <p className="mt-2 text-gray-500">
            Please complete the form below to submit your return or refund
            request.
          </p>

          {submitted ? (
            <div className="mt-6 rounded-lg border border-green-200 bg-green-50 p-5">
              <h3 className="text-lg font-bold text-green-800">
                Refund Request Submitted
              </h3>

              <p className="mt-2 text-sm leading-6 text-green-700">
                Your refund request has been submitted successfully.
                Please send the same unboxing video to us on WhatsApp with your order number for verification.
              </p>

              <button
                type="button"
                onClick={openWhatsApp}
                className="mt-5 rounded-md bg-green-600 px-6 py-3 font-bold text-white hover:bg-green-700"
              >
                Send Video on WhatsApp
              </button>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="mt-6 space-y-5"
            >

              <div>
                <label className="mb-2 block font-semibold">
                  Order Number
                </label>

                <input
                  required
                  name="orderNumber"
                  value={form.orderNumber}
                  onChange={handleChange}
                  placeholder="e.g. AM-12345678-123"
                  className="w-full rounded-md border px-4 py-3 outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="mb-2 block font-semibold">
                  Full Name
                </label>

                <input
                  required
                  name="fullName"
                  value={form.fullName}
                  onChange={handleChange}
                  placeholder="Your full name"
                  className="w-full rounded-md border px-4 py-3 outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="mb-2 block font-semibold">
                  Email Address
                </label>

                <input
                  required
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="your@email.com"
                  className="w-full rounded-md border px-4 py-3 outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="mb-2 block font-semibold">
                  Mobile Number
                </label>

                <input
                  required
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="03XXXXXXXXX"
                  className="w-full rounded-md border px-4 py-3 outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="mb-2 block font-semibold">
                  Reason for Refund
                </label>

                <select
                  required
                  name="reason"
                  value={form.reason}
                  onChange={handleChange}
                  className="w-full rounded-md border bg-white px-4 py-3 outline-none focus:border-orange-500"
                >
                  <option value="">
                    Select a reason
                  </option>

                  <option value="Damaged Product">
                    Damaged Product
                  </option>

                  <option value="Defective Product">
                    Defective Product
                  </option>

                  <option value="Incorrect Product">
                    Incorrect Product
                  </option>
                </select>
              </div>

              <div>
                <label className="mb-2 block font-semibold">
                  Describe the Issue
                </label>

                <textarea
                  required
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={5}
                  placeholder="Please describe the problem with your order..."
                  className="w-full resize-none rounded-md border px-4 py-3 outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="mb-2 block font-semibold">
                  Upload Unboxing Video
                </label>

                <div className="rounded-lg border-2 border-dashed border-gray-300 p-6 text-center">
                  <input
                    required
                    type="file"
                    accept="video/*"
                    onChange={handleVideoChange}
                    className="mx-auto block w-full max-w-md text-sm"
                  />

                  {videoName ? (
                    <p className="mt-3 text-sm font-semibold text-green-600">
                      Selected: {videoName}
                    </p>
                  ) : (
                    <p className="mt-3 text-sm text-gray-500">
                      Please upload a short unboxing video showing
                      the condition of the product.
                    </p>
                  )}
                </div>
              </div>

              <button
                type="submit"
                className="w-full rounded-md bg-orange-500 py-3 font-bold text-white hover:bg-orange-600"
              >
                Submit Refund Request
              </button>
            </form>
          )}
        </section>

        <section className="mt-5 rounded-xl bg-white p-6 text-center shadow-sm">
          <h2 className="text-xl font-bold">
            WhatsApp Verification
          </h2>

          <p className="mt-2 text-sm leading-6 text-gray-500">
            After submitting your request, please send the same unboxing video on WhatsApp with your order number for verification.
          </p>

          <button
            type="button"
            onClick={openWhatsApp}
            className="mt-5 rounded-md bg-green-600 px-6 py-3 font-bold text-white hover:bg-green-700"
          >
            Send Video on WhatsApp
          </button>
        </section>

      </div>
    </main>
  );
}