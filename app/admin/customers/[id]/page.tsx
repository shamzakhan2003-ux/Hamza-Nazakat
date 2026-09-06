"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

type Customer = {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  mobileVerified: boolean;
  emailVerified: boolean;
  isActive: boolean;
  createdAt: string;
};

export default function CustomerDetailsPage() {
  const params = useParams();
  const id = params.id as string;

  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const [resettingPassword, setResettingPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    if (!id) return;

    const loadCustomer = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(`/api/admin/customers/${id}`);

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error("Customer not found.");
          }

          if (response.status === 401) {
            throw new Error("Unauthorized.");
          }

          throw new Error("Failed to load customer.");
        }

        const data = await response.json();

        setCustomer(data.customer);
        setFullName(data.customer.fullName);
        setEmail(data.customer.email);
        setPhone(data.customer.phone);
      } catch (err) {
        console.error(err);

        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Failed to load customer.");
        }
      } finally {
        setLoading(false);
      }
    };

    loadCustomer();
  }, [id]);

  const handleSave = async () => {
    try {
      setSaving(true);
      setSaveMessage("");
      setError("");

      const response = await fetch(`/api/admin/customers/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName,
          email,
          phone,
          isActive: customer?.isActive ?? true,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to update customer."
        );
      }

      setCustomer(data.customer);
      setFullName(data.customer.fullName);
      setEmail(data.customer.email);
      setPhone(data.customer.phone);

      setEditing(false);
      setSaveMessage("Customer updated successfully.");

      setTimeout(() => {
        setSaveMessage("");
      }, 3000);
    } catch (err) {
      console.error(err);

      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to update customer.");
      }
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = async () => {
    if (!customer) return;

    const newStatus = !customer.isActive;

    const confirmed = window.confirm(
      newStatus
        ? "Are you sure you want to enable this customer?"
        : "Are you sure you want to disable this customer?"
    );

    if (!confirmed) return;

    try {
      setSaving(true);
      setSaveMessage("");
      setError("");

      const response = await fetch(`/api/admin/customers/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName: customer.fullName,
          email: customer.email,
          phone: customer.phone,
          isActive: newStatus,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to update customer status."
        );
      }

      setCustomer(data.customer);

      setSaveMessage(
        newStatus
          ? "Customer enabled successfully."
          : "Customer disabled successfully."
      );

      setTimeout(() => {
        setSaveMessage("");
      }, 3000);
    } catch (err) {
      console.error(err);

      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to update customer status.");
      }
    } finally {
      setSaving(false);
    }
  };

  const handleResetPassword = async () => {
    if (!newPassword || !confirmPassword) {
      setError("Please enter and confirm the new password.");
      return;
    }

    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to reset this customer's password?"
    );

    if (!confirmed) return;

    try {
      setResettingPassword(true);
      setSaveMessage("");
      setError("");

      const response = await fetch(
        `/api/admin/customers/${id}/password`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            password: newPassword,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to reset customer password."
        );
      }

      setNewPassword("");
      setConfirmPassword("");

      setSaveMessage(
        "Customer password reset successfully."
      );

      setTimeout(() => {
        setSaveMessage("");
      }, 3000);
    } catch (err) {
      console.error(err);

      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to reset customer password.");
      }
    } finally {
      setResettingPassword(false);
    }
  };

  const handleCancelEdit = () => {
    if (!customer) return;

    setFullName(customer.fullName);
    setEmail(customer.email);
    setPhone(customer.phone);

    setEditing(false);
    setError("");
  };

  return (
    <main className="min-h-screen bg-slate-100 text-slate-900">
      <header className="border-b border-slate-800 bg-slate-950 text-white shadow-lg">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <div>
            <h1 className="text-xl font-extrabold tracking-tight sm:text-2xl">
              Click&Pick
            </h1>

            <p className="mt-0.5 text-xs font-medium text-slate-400 sm:text-sm">
              Admin Control Panel
            </p>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/admin"
              className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm font-semibold text-white transition hover:bg-slate-700 sm:px-4"
            >
              Dashboard
            </Link>

            <Link
              href="/admin/customers"
              className="rounded-lg border border-blue-500 bg-blue-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 sm:px-4"
            >
              Customers
            </Link>

            <Link
              href="/"
              className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm font-semibold text-white transition hover:bg-slate-700 sm:px-4"
            >
              View Store
            </Link>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6">
          <p className="mb-1 text-sm font-bold uppercase tracking-wider text-orange-600">
            Customer
          </p>

          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">
            Customer Details
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            View and manage customer account information.
          </p>
        </div>

        {loading ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
            <p className="text-slate-500">
              Loading customer details...
            </p>
          </div>
        ) : error && !customer ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center shadow-sm">
            <p className="font-semibold text-red-700">
              {error}
            </p>

            <Link
              href="/admin/customers"
              className="mt-5 inline-flex rounded-lg bg-slate-800 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700"
            >
              Back to Customers
            </Link>
          </div>
        ) : customer ? (
          <div className="space-y-6">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Account Status
                  </p>

                  <div className="mt-2 flex items-center gap-3">
                    <span
                      className={
                        customer.isActive
                          ? "rounded-full bg-green-100 px-3 py-1 text-sm font-bold text-green-700"
                          : "rounded-full bg-red-100 px-3 py-1 text-sm font-bold text-red-700"
                      }
                    >
                      {customer.isActive
                        ? "✓ Active"
                        : "✕ Disabled"}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => setEditing(!editing)}
                    disabled={saving || resettingPassword}
                    className="rounded-lg bg-orange-500 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {editing ? "Close Edit" : "Edit Customer"}
                  </button>

                  <button
                    type="button"
                    onClick={handleToggleActive}
                    disabled={saving || resettingPassword}
                    className={
                      customer.isActive
                        ? "rounded-lg bg-red-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                        : "rounded-lg bg-green-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
                    }
                  >
                    {saving
                      ? "Saving..."
                      : customer.isActive
                      ? "Disable Customer"
                      : "Enable Customer"}
                  </button>
                </div>
              </div>
            </div>

            {saveMessage && (
              <div className="rounded-xl border border-green-200 bg-green-50 px-5 py-4 text-sm font-semibold text-green-700">
                {saveMessage}
              </div>
            )}

            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-semibold text-red-700">
                {error}
              </div>
            )}

            {editing && (
              <div className="rounded-2xl border border-orange-200 bg-white shadow-sm">
                <div className="border-b border-orange-100 px-6 py-5">
                  <h3 className="text-lg font-bold text-slate-900">
                    Edit Customer
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    Update the customer's basic account information.
                  </p>
                </div>

                <div className="grid gap-5 p-6">
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Full Name
                    </label>

                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Email
                    </label>

                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Phone
                    </label>

                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                    />
                  </div>

                  <div className="flex flex-wrap gap-3 pt-2">
                    <button
                      type="button"
                      onClick={handleSave}
                      disabled={saving || resettingPassword}
                      className="rounded-lg bg-orange-500 px-6 py-2.5 text-sm font-bold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {saving ? "Saving..." : "Save Changes"}
                    </button>

                    <button
                      type="button"
                      onClick={handleCancelEdit}
                      disabled={saving || resettingPassword}
                      className="rounded-lg bg-slate-200 px-6 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-slate-300 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="rounded-2xl border border-red-200 bg-white shadow-sm">
              <div className="border-b border-red-100 px-6 py-5">
                <h3 className="text-lg font-bold text-slate-900">
                  Password Management
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  Set a new password for this customer account.
                </p>
              </div>

              <div className="grid gap-5 p-6">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    New Password
                  </label>

                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Minimum 8 characters"
                    disabled={resettingPassword}
                    className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-100 disabled:bg-slate-100"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Confirm New Password
                  </label>

                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) =>
                      setConfirmPassword(e.target.value)
                    }
                    placeholder="Enter password again"
                    disabled={resettingPassword}
                    className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-100 disabled:bg-slate-100"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleResetPassword}
                    disabled={resettingPassword}
                    className="rounded-lg bg-red-600 px-6 py-2.5 text-sm font-bold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {resettingPassword
                      ? "Resetting Password..."
                      : "Reset Password"}
                  </button>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-200 px-6 py-5">
                <h3 className="text-lg font-bold text-slate-900">
                  Customer Information
                </h3>
              </div>

              <div className="grid gap-6 p-6 sm:grid-cols-2">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Full Name
                  </p>

                  <p className="mt-2 text-base font-semibold text-slate-900">
                    {customer.fullName}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Customer ID
                  </p>

                  <p className="mt-2 break-all text-sm text-slate-700">
                    {customer.id}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Email
                  </p>

                  <p className="mt-2 break-all text-base text-slate-900">
                    {customer.email}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Phone
                  </p>

                  <p className="mt-2 text-base text-slate-900">
                    {customer.phone || "-"}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Joined
                  </p>

                  <p className="mt-2 text-base text-slate-900">
                    {new Date(
                      customer.createdAt
                    ).toLocaleDateString("en-GB")}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-200 px-6 py-5">
                <h3 className="text-lg font-bold text-slate-900">
                  Verification Status
                </h3>
              </div>

              <div className="grid gap-4 p-6 sm:grid-cols-2">
                <div
                  className={
                    customer.emailVerified
                      ? "rounded-xl border border-green-200 bg-green-50 p-5"
                      : "rounded-xl border border-red-200 bg-red-50 p-5"
                  }
                >
                  <p className="text-sm font-semibold text-slate-700">
                    Email Verification
                  </p>

                  <p
                    className={
                      customer.emailVerified
                        ? "mt-2 text-lg font-bold text-green-700"
                        : "mt-2 text-lg font-bold text-red-700"
                    }
                  >
                    {customer.emailVerified
                      ? "✓ Verified"
                      : "✕ Not Verified"}
                  </p>
                </div>

                <div
                  className={
                    customer.mobileVerified
                      ? "rounded-xl border border-green-200 bg-green-50 p-5"
                      : "rounded-xl border border-red-200 bg-red-50 p-5"
                  }
                >
                  <p className="text-sm font-semibold text-slate-700">
                    Mobile Verification
                  </p>

                  <p
                    className={
                      customer.mobileVerified
                        ? "mt-2 text-lg font-bold text-green-700"
                        : "mt-2 text-lg font-bold text-red-700"
                    }
                  >
                    {customer.mobileVerified
                      ? "✓ Verified"
                      : "✕ Not Verified"}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/admin/customers"
                className="rounded-lg bg-slate-800 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700"
              >
                ← Back to Customers
              </Link>
            </div>
          </div>
        ) : null}
      </section>

      <footer className="border-t border-slate-800 bg-slate-950 py-7 text-center">
        <p className="text-sm font-medium text-slate-400">
          © 2026 Click&Pick. All rights reserved.
        </p>
      </footer>
    </main>
  );
}