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
    postcode: "",
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

        {/* Page Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-extrabold">
            Returns & Refunds
          </h1>

          <p className="mt-3 text-gray-500">
            Please read our returns and refunds policy before submitting a
            request.
          </p>
        </div>

        {/* Return Policy */}
        <section className="mb-5 rounded-xl bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-bold">
            Return Policy
          </h2>

          <p className="mt-3 leading-7 text-gray-600">
            We accept refund requests within{" "}
            <strong>7 days of delivery</strong> if your order arrives{" "}
            <strong>damaged, defective, or incorrect</strong>.
          </p>

          <p className="mt-2 leading-7 text-gray-600">
            Please contact us as soon as possible after receiving your order
            if you notice any issue with the product.
          </p>
        </section>

        {/* How to Claim a Refund */}
        <section className="mb-5 rounded-xl bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-bold">
            How to Claim a Refund
          </h2>

          <p className="mt-3 leading-7 text-gray-600">
            Customers are requested to record a{" "}
            <strong>short unboxing video</strong> when opening their parcel.
            The video helps us verify claims relating to damaged, defective,
            or incorrect products.
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
              WhatsApp with your Order Number for verification.
            </p>

            <p>
              <strong>4.</strong> Our team will review your request and
              supporting evidence before deciding on the appropriate
              resolution.
            </p>
          </div>
        </section>

        {/* Refund Processing */}
        <section className="mb-5 rounded-xl bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-bold">
            Refund Processing
          </h2>

          <p className="mt-3 leading-7 text-gray-600">
            Once your claim has been reviewed and, where required, the
            returned item has been received and checked, an approved refund
            will normally be processed within <strong>3 working days</strong>.
          </p>

          <p className="mt-2 leading-7 text-gray-600">
            Please note that your bank or payment provider may require
            additional time for the refund to appear in your account.
          </p>
        </section>

        {/* Claim a Refund */}
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
                Please send the same unboxing video to us on WhatsApp with
                your Order Number for verification.
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

              {/* Order Number */}
              <div>
                <label className="mb-2 block font-semibold">
                  Order Number
                </label>

                <input
                  required
                  name="orderNumber"
                  value={form.orderNumber}
                  onChange={handleChange}
                  placeholder="e.g. CP-12345678"
                  className="w-full rounded-md border px-4 py-3 outline-none focus:border-orange-500"
                />
              </div>

              {/* Full Name */}
              <div>
                <label className="mb-2 block font-semibold">
                  Full Name
                </label>

                <input
                  required
                  name="fullName"
                  value={form.fullName}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className="w-full rounded-md border px-4 py-3 outline-none focus:border-orange-500"
                />
              </div>

              {/* Email */}
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
                  placeholder="name@example.co.uk"
                  className="w-full rounded-md border px-4 py-3 outline-none focus:border-orange-500"
                />
              </div>

              {/* UK Mobile Number */}
              <div>
                <label className="mb-2 block font-semibold">
                  UK Mobile Number
                </label>

                <input
                  required
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="e.g. 07123 456789"
                  inputMode="tel"
                  className="w-full rounded-md border px-4 py-3 outline-none focus:border-orange-500"
                />

                <p className="mt-1 text-sm text-gray-500">
                  Please enter a UK mobile number.
                </p>
              </div>

              {/* UK Postcode */}
              <div>
                <label className="mb-2 block font-semibold">
                  Delivery Postcode
                </label>

                <input
                  required
                  name="postcode"
                  value={form.postcode}
                  onChange={handleChange}
                  placeholder="e.g. SW1A 1AA"
                  autoCapitalize="characters"
                  className="w-full rounded-md border px-4 py-3 uppercase outline-none focus:border-orange-500"
                />
              </div>

              {/* Refund Reason */}
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

                  <option value="Missing Item">
                    Missing Item
                  </option>

                  <option value="Other">
                    Other
                  </option>
                </select>
              </div>

              {/* Description */}
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
                  placeholder="Please describe the issue with your order..."
                  className="w-full resize-none rounded-md border px-4 py-3 outline-none focus:border-orange-500"
                />
              </div>

              {/* Unboxing Video */}
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
                      Please upload a short unboxing video showing the
                      condition of the parcel and product.
                    </p>
                  )}
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="w-full rounded-md bg-orange-500 py-3 font-bold text-white hover:bg-orange-600"
              >
                Submit Refund Request
              </button>
            </form>
          )}
        </section>

        {/* WhatsApp Verification */}
        <section className="mt-5 rounded-xl bg-white p-6 text-center shadow-sm">
          <h2 className="text-xl font-bold">
            WhatsApp Verification
          </h2>

          <p className="mt-2 text-sm leading-6 text-gray-500">
            After submitting your request, please send the same unboxing
            video on WhatsApp with your Order Number for verification.
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