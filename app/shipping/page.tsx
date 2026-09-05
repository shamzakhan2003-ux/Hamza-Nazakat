export default function ShippingPage() {
  return (
    <main className="min-h-screen bg-gray-100 text-gray-900">
      <div className="mx-auto max-w-4xl px-4 py-10">

        {/* Page Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-extrabold">
            Shipping Information
          </h1>

          <p className="mt-3 text-gray-500">
            Everything you need to know about delivery and order tracking.
          </p>
        </div>

        {/* Delivery Time */}
        <section className="mb-5 rounded-xl bg-white p-6 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="text-4xl">
              ðŸšš
            </div>

            <div>
              <h2 className="text-2xl font-bold">
                Delivery Time
              </h2>

              <p className="mt-3 leading-7 text-gray-600">
                We aim to deliver all orders within{" "}
                <strong>3â€“5 working days</strong> across the UK.
              </p>

              <p className="mt-2 leading-7 text-gray-600">
                Delivery times may vary slightly depending on your location
                and courier service.
              </p>
            </div>
          </div>
        </section>

        {/* Handling & Dispatch */}
        <section className="mb-5 rounded-xl bg-white p-6 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="text-4xl">
              ðŸšš
            </div>

            <div>
              <h2 className="text-2xl font-bold">
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
        <section className="mb-5 rounded-xl bg-white p-6 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="text-4xl">
              ðŸšš
            </div>

            <div>
              <h2 className="text-2xl font-bold">
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
        <section className="mb-5 rounded-xl bg-white p-6 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="text-4xl">
              ðŸ‡¬ðŸ‡§
            </div>

            <div>
              <h2 className="text-2xl font-bold">
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
        <section className="rounded-xl bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-bold">
            Important Information
          </h2>

          <div className="mt-4 space-y-3 text-gray-600">
            <p>
              <strong>âœ“</strong> Please make sure your delivery address and
              contact number are correct when placing your order.
            </p>

            <p>
              <strong>âœ“</strong> Delivery time is normally 3â€“5 working days,
              but unexpected courier delays may occasionally occur.
            </p>

            <p>
              <strong>âœ“</strong> Tracking details will be provided after
              dispatch.
            </p>

            <p>
              <strong>âœ“</strong> Please keep your phone available so the
              courier can contact you when required.
            </p>
          </div>
        </section>

      </div>
    </main>
  );
}
