"use client";

import { FormEvent, Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function ForgotPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const redirectTo = searchParams.get("redirect") || "/";

  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function sendOtp(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!email.trim()) {
      alert("Please enter your email address.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "/api/customer/forgot-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email.trim(),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Unable to send OTP.");
        return;
      }

      alert(
        "If an account exists with this email, a password reset OTP has been sent."
      );

      setStep(2);
    } catch (error) {
      console.error("Forgot password error:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function resetPassword(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (!/^\d{6}$/.test(otp)) {
      alert("Please enter the 6-digit OTP.");
      return;
    }

    if (newPassword.length < 8) {
      alert("Password must be at least 8 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "/api/customer/reset-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email.trim(),
            otp,
            newPassword,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Unable to reset password.");
        return;
      }

      setStep(3);
    } catch (error) {
      console.error("Reset password error:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-gray-100 px-4 py-12 text-gray-900">
      <div className="mx-auto max-w-md">
        <button
          type="button"
          onClick={() => router.push("/")}
          className="mb-8 block text-2xl font-extrabold text-orange-500"
        >
          Click&Pick
        </button>

        <div className="rounded-xl bg-white p-6 shadow-sm">
          {step === 1 && (
            <>
              <h1 className="text-3xl font-bold">
                Forgot Password
              </h1>

              <p className="mt-2 text-gray-500">
                Enter your email address and we will send you a
                password reset OTP.
              </p>

              <form
                onSubmit={sendOtp}
                className="mt-6 space-y-5"
              >
                <div>
                  <label className="mb-2 block font-semibold">
                    Email Address
                  </label>

                  <input
                    required
                    type="email"
                    value={email}
                    onChange={(event) =>
                      setEmail(event.target.value)
                    }
                    placeholder="Enter your email"
                    autoComplete="email"
                    className="w-full rounded-md border px-4 py-3 outline-none focus:border-orange-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-md bg-orange-500 py-3 font-bold text-white hover:bg-orange-600 disabled:cursor-not-allowed disabled:bg-gray-400"
                >
                  {loading ? "Sending OTP..." : "Send OTP"}
                </button>
              </form>

              <button
                type="button"
                onClick={() =>
                  router.push(
                    `/login?redirect=${encodeURIComponent(
                      redirectTo
                    )}`
                  )
                }
                className="mt-5 w-full text-center font-semibold text-orange-500 hover:underline"
              >
                Back to Sign In
              </button>
            </>
          )}

          {step === 2 && (
            <>
              <h1 className="text-3xl font-bold">
                Reset Password
              </h1>

              <p className="mt-2 text-gray-500">
                Enter the 6-digit OTP sent to your email and
                choose a new password.
              </p>

              <form
                onSubmit={resetPassword}
                className="mt-6 space-y-5"
              >
                <div>
                  <label className="mb-2 block font-semibold">
                    Email Address
                  </label>

                  <input
                    type="email"
                    value={email}
                    disabled
                    className="w-full rounded-md border bg-gray-100 px-4 py-3 text-gray-600"
                  />
                </div>

                <div>
                  <label className="mb-2 block font-semibold">
                    6-Digit OTP
                  </label>

                  <input
                    required
                    inputMode="numeric"
                    maxLength={6}
                    value={otp}
                    onChange={(event) =>
                      setOtp(
                        event.target.value.replace(/\D/g, "")
                      )
                    }
                    placeholder="Enter OTP"
                    className="w-full rounded-md border px-4 py-3 text-center text-xl tracking-[0.4em] outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="mb-2 block font-semibold">
                    New Password
                  </label>

                  <input
                    required
                    type="password"
                    value={newPassword}
                    onChange={(event) =>
                      setNewPassword(event.target.value)
                    }
                    placeholder="Minimum 8 characters"
                    autoComplete="new-password"
                    className="w-full rounded-md border px-4 py-3 outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="mb-2 block font-semibold">
                    Confirm New Password
                  </label>

                  <input
                    required
                    type="password"
                    value={confirmPassword}
                    onChange={(event) =>
                      setConfirmPassword(event.target.value)
                    }
                    placeholder="Confirm new password"
                    autoComplete="new-password"
                    className="w-full rounded-md border px-4 py-3 outline-none focus:border-orange-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-md bg-orange-500 py-3 font-bold text-white hover:bg-orange-600 disabled:cursor-not-allowed disabled:bg-gray-400"
                >
                  {loading
                    ? "Resetting Password..."
                    : "Reset Password"}
                </button>
              </form>

              <button
                type="button"
                onClick={() => setStep(1)}
                className="mt-5 w-full text-center font-semibold text-orange-500 hover:underline"
              >
                Change Email
              </button>
            </>
          )}

          {step === 3 && (
            <div className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-3xl">
                ✓
              </div>

              <h1 className="mt-5 text-3xl font-bold">
                Password Reset Successful
              </h1>

              <p className="mt-3 text-gray-500">
                Your password has been changed successfully.
              </p>

              <button
                type="button"
                onClick={() =>
                  router.push(
                    `/login?redirect=${encodeURIComponent(
                      redirectTo
                    )}`
                  )
                }
                className="mt-6 w-full rounded-md bg-orange-500 py-3 font-bold text-white hover:bg-orange-600"
              >
                Sign In
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

export default function ForgotPasswordPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-gray-100 px-4 py-12">
          <div className="mx-auto max-w-md text-center">
            Loading...
          </div>
        </main>
      }
    >
      <ForgotPasswordForm />
    </Suspense>
  );
}