"use client";

import { FormEvent, Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const redirectTo =
    searchParams.get("redirect") || "/";

  const [loading, setLoading] = useState(false);
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");

  async function handleLogin(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (!identifier.trim() || !password) {
      alert("Email/mobile number and password are required.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch("/api/customer/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          identifier: identifier.trim(),
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Login failed.");
        return;
      }

      if (data.requiresMobileVerification) {
        alert(
          "Your mobile number is not verified. Please verify your mobile number first."
        );

        router.push(
          `/signup?verify=1&phone=${encodeURIComponent(
            data.phone || identifier
          )}&redirect=${encodeURIComponent(redirectTo)}`
        );

        return;
      }

      router.push(redirectTo);
      router.refresh();
    } catch (error) {
      console.error("Login error:", error);
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

          <h1 className="text-3xl font-bold">
            Sign in
          </h1>

          <p className="mt-2 text-gray-500">
            Sign in using your email address or mobile number.
          </p>

          <form
            onSubmit={handleLogin}
            className="mt-6 space-y-5"
          >

            <div>
              <label className="mb-2 block font-semibold">
                Email or Mobile Number
              </label>

              <input
                required
                value={identifier}
                onChange={(event) =>
                  setIdentifier(event.target.value)
                }
                placeholder="Email or mobile number"
                autoComplete="username"
                className="w-full rounded-md border px-4 py-3 outline-none focus:border-orange-500"
              />
            </div>

            <div>
              <label className="mb-2 block font-semibold">
                Password
              </label>

              <input
                required
                type="password"
                value={password}
                onChange={(event) =>
                  setPassword(event.target.value)
                }
                placeholder="Your password"
                autoComplete="current-password"
                className="w-full rounded-md border px-4 py-3 outline-none focus:border-orange-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-md bg-orange-500 py-3 font-bold text-white hover:bg-orange-600 disabled:cursor-not-allowed disabled:bg-gray-400"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>

          </form>

          <div className="mt-6 border-t pt-6 text-center">

            <p className="text-sm text-gray-500">
              Don't have an account?
            </p>

            <button
              type="button"
              onClick={() =>
                router.push(
                  `/signup?redirect=${encodeURIComponent(redirectTo)}`
                )
              }
              className="mt-2 font-semibold text-orange-500 hover:underline"
            >
              Create Account
            </button>

          </div>

          <div className="mt-5 rounded-md bg-gray-50 p-4 text-sm text-gray-600">

            <p className="font-semibold text-gray-800">
              Important
            </p>

            <p className="mt-1">
              Your mobile number must be verified before you can place an order.
            </p>

          </div>

        </div>
      </div>
    </main>
  );
}

export default function LoginPage() {
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
      <LoginForm />
    </Suspense>
  );
}
