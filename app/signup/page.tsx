"use client";

import {
  FormEvent,
  Suspense,
  useEffect,
  useState,
} from "react";
import { useRouter, useSearchParams } from "next/navigation";

function SignupContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const redirectTo =
    searchParams.get("redirect") || "/";

  const verifyMode =
    searchParams.get("verify") === "1";

  const verifyPhone =
    searchParams.get("phone") || "";

  const [step, setStep] = useState<
    "signup" | "otp"
  >(verifyMode ? "otp" : "signup");

  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState("");
  const [developmentOtp, setDevelopmentOtp] =
    useState("");

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: verifyPhone,
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (verifyMode && verifyPhone) {
      setForm((current) => ({
        ...current,
        phone: verifyPhone,
      }));
    }
  }, [verifyMode, verifyPhone]);

  function handleChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  }

  async function handleSignup(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    if (form.password.length < 8) {
      alert(
        "Password must be at least 8 characters."
      );
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "/api/customer/signup",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            fullName: form.fullName,
            email: form.email,
            phone: form.phone,
            password: form.password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Signup failed.");
        return;
      }

      setDevelopmentOtp(
        data.developmentOtp || ""
      );

      setStep("otp");
    } catch (error) {
      console.error(
        "Signup error:",
        error
      );

      alert(
        "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleVerifyOtp(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (!otp || otp.length !== 6) {
      alert(
        "Please enter the 6-digit OTP."
      );
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "/api/customer/verify-otp",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            phone: form.phone,
            otp,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(
          data.error ||
            "OTP verification failed."
        );
        return;
      }

      alert(
        "Account verified successfully!"
      );

      router.push(redirectTo);
      router.refresh();
    } catch (error) {
      console.error(
        "OTP verification error:",
        error
      );

      alert(
        "Something went wrong. Please try again."
      );
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
          className="mb-8 block text-2xl font-bold text-orange-500"
        >
          Click&Pick
        </button>

        <div className="rounded-xl bg-white p-6 shadow-sm">

          {step === "signup" ? (
            <>
              <h1 className="text-3xl font-bold">
                Create Account
              </h1>

              <p className="mt-2 text-gray-500">
                Create your customer account to continue.
              </p>

              <form
                onSubmit={handleSignup}
                className="mt-6 space-y-5"
              >

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
                    Email
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
                    placeholder="+44 7XXXXXXXXX"
                    className="w-full rounded-md border px-4 py-3 outline-none focus:border-orange-500"
                  />

                  <p className="mt-1 text-xs text-gray-500">
                    Your mobile number must be verified by OTP.
                  </p>
                </div>

                <div>
                  <label className="mb-2 block font-semibold">
                    Password
                  </label>

                  <input
                    required
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Minimum 8 characters"
                    autoComplete="new-password"
                    className="w-full rounded-md border px-4 py-3 outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="mb-2 block font-semibold">
                    Confirm Password
                  </label>

                  <input
                    required
                    type="password"
                    name="confirmPassword"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm your password"
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
                    ? "Creating Account..."
                    : "Create Account"}
                </button>

              </form>

              <p className="mt-6 text-center text-sm text-gray-500">
                Already have an account?{" "}

                <button
                  type="button"
                  onClick={() =>
                    router.push(
                      `/login?redirect=${encodeURIComponent(
                        redirectTo
                      )}`
                    )
                  }
                  className="font-semibold text-orange-500 hover:underline"
                >
                  Login
                </button>
              </p>
            </>
          ) : (
            <>
              <h1 className="text-3xl font-bold">
                Verify Mobile Number
              </h1>

              <p className="mt-2 text-gray-500">
                Enter the 6-digit OTP sent to:
              </p>

              <p className="mt-1 font-bold">
                {form.phone}
              </p>

              {developmentOtp && (
                <div className="mt-5 rounded-md border border-yellow-300 bg-yellow-50 p-4">

                  <p className="text-sm font-semibold text-yellow-800">
                    Development OTP
                  </p>

                  <p className="mt-1 text-2xl font-bold tracking-widest">
                    {developmentOtp}
                  </p>

                  <p className="mt-1 text-xs text-yellow-700">
                    Temporary testing only. Real SMS will be connected later.
                  </p>

                </div>
              )}

              <form
                onSubmit={handleVerifyOtp}
                className="mt-6 space-y-5"
              >

                <div>
                  <label className="mb-2 block font-semibold">
                    OTP
                  </label>

                  <input
                    required
                    inputMode="numeric"
                    maxLength={6}
                    value={otp}
                    onChange={(event) =>
                      setOtp(
                        event.target.value.replace(
                          /\D/g,
                          ""
                        )
                      )
                    }
                    placeholder="Enter 6-digit OTP"
                    className="w-full rounded-md border px-4 py-3 text-center text-2xl tracking-[0.5em] outline-none focus:border-orange-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-md bg-orange-500 py-3 font-bold text-white hover:bg-orange-600 disabled:cursor-not-allowed disabled:bg-gray-400"
                >
                  {loading
                    ? "Verifying..."
                    : "Verify Mobile"}
                </button>

              </form>
            </>
          )}

        </div>
      </div>
    </main>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={null}>
      <SignupContent />
    </Suspense>
  );
}
