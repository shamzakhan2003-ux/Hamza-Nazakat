"use client";

import { FormEvent, useState } from "react";

export default function AdminAccountPage() {
  const [step, setStep] = useState<"email" | "otp" | "credentials">(
    "email"
  );
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function requestOtp(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch("/api/admin/account/request-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Unable to send OTP.");
        return;
      }

      setMessage("Verification code has been sent to your email.");
      setStep("otp");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function verifyOtp(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch("/api/admin/account/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          otp,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Invalid OTP.");
        return;
      }

      setMessage("OTP verified successfully.");
      setStep("credentials");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function changeCredentials(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch(
        "/api/admin/account/change-credentials",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Unable to update credentials.");
        return;
      }

      setMessage(
        "Admin credentials updated successfully. Please use the new credentials for your next login."
      );

      setUsername("");
      setPassword("");
      setOtp("");
      setEmail("");
      setStep("email");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="mx-auto max-w-md rounded-2xl bg-white p-6 shadow">
        <h1 className="mb-2 text-2xl font-bold text-gray-900">
          Admin Account Management
        </h1>

        <p className="mb-6 text-sm text-gray-600">
          Verify your authorized email before changing admin credentials.
        </p>

        {message && (
          <div className="mb-4 rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700">
            {message}
          </div>
        )}

        {error && (
          <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {step === "email" && (
          <form onSubmit={requestOtp} className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Authorized Email
              </label>

              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="Enter authorized email"
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-black"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-black px-4 py-3 font-medium text-white disabled:opacity-50"
            >
              {loading ? "Sending..." : "Send OTP"}
            </button>
          </form>
        )}

        {step === "otp" && (
          <form onSubmit={verifyOtp} className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Verification Code
              </label>

              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={otp}
                onChange={(event) =>
                  setOtp(event.target.value.replace(/\D/g, ""))
                }
                placeholder="Enter 6-digit OTP"
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-center text-xl tracking-widest outline-none focus:border-black"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-black px-4 py-3 font-medium text-white disabled:opacity-50"
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>

            <button
              type="button"
              onClick={() => {
                setStep("email");
                setOtp("");
                setError("");
                setMessage("");
              }}
              className="w-full text-sm text-gray-600 hover:text-black"
            >
              Use another email
            </button>
          </form>
        )}

        {step === "credentials" && (
          <form onSubmit={changeCredentials} className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                New Username
              </label>

              <input
                type="text"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                placeholder="Enter new username"
                minLength={3}
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-black"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                New Password
              </label>

              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Enter new password"
                minLength={8}
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-black"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-black px-4 py-3 font-medium text-white disabled:opacity-50"
            >
              {loading ? "Updating..." : "Update Credentials"}
            </button>
          </form>
        )}
      </div>
    </main>
  );
}