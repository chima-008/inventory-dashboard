'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState('');
  const [verificationMessage, setVerificationMessage] = useState('');
  const [verificationRequired, setVerificationRequired] =
    useState(false);
  const [resending, setResending] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setLoading(true);
    setError('');
    setVerificationMessage('');
    setVerificationRequired(false);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          remember,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.email_verification_required) {
          setVerificationRequired(true);
          setError(
            data.message ||
              'Please verify your email address before logging in.'
          );
        } else {
          setError(
            data.message || 'Invalid email or password.'
          );
        }

        return;
      }

      router.replace('/dashboard');
      router.refresh();
    } catch {
      setError(
        'Unable to connect to the server. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleResendVerification() {
    if (!email) {
      setError(
        'Enter your email address before requesting a verification email.'
      );
      return;
    }

    setResending(true);
    setError('');
    setVerificationMessage('');

    try {
      const response = await fetch(
        '/api/auth/verification-notification',
        {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.message ||
            'Unable to resend the verification email. Please try again.'
        );
        return;
      }

      setVerificationMessage(
        data.message ||
          'A new verification email has been sent. Please check your inbox.'
      );
      setVerificationRequired(false);
    } catch {
      setError(
        'Unable to connect to the server. Please try again.'
      );
    } finally {
      setResending(false);
    }
  }

  function handleGoogleSignIn() {
    setGoogleLoading(true);
    setError('');
    setVerificationMessage('');
    setVerificationRequired(false);

    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    if (!apiUrl) {
      setError(
        'Google sign in is currently unavailable. Please try again later.'
      );
      setGoogleLoading(false);
      return;
    }

    window.location.href = `${apiUrl}/auth/google`;
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="flex min-h-screen">

        {/* Brand panel */}
        <section className="hidden bg-slate-900 lg:flex lg:w-[44%] lg:flex-col lg:justify-between">
          <div className="p-8 xl:p-10">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-sm font-bold text-white shadow-sm">
                I
              </div>

              <div>
                <p className="text-sm font-semibold leading-none tracking-tight text-white">
                  Inventory
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  Management
                </p>
              </div>
            </div>
          </div>

          <div className="px-8 pb-16 xl:px-10">
            <div className="max-w-md">
              <div className="mb-5 inline-flex items-center rounded-full border border-slate-700 bg-slate-800 px-3 py-1.5">
                <span className="text-xs font-medium text-slate-300">
                  Inventory workspace
                </span>
              </div>

              <h2 className="text-3xl font-semibold leading-tight tracking-tight text-white xl:text-4xl">
                Manage your inventory with confidence.
              </h2>

              <p className="mt-5 text-sm leading-6 text-slate-400">
                Track products, monitor stock levels, manage categories,
                and keep your inventory organized from one place.
              </p>

              <div className="mt-8 grid grid-cols-3 gap-3">
                <div className="rounded-lg border border-slate-800 bg-slate-950/40 p-3">
                  <p className="text-xs font-medium text-slate-500">
                    Products
                  </p>

                  <p className="mt-1 text-sm font-semibold text-slate-200">
                    Organized
                  </p>
                </div>

                <div className="rounded-lg border border-slate-800 bg-slate-950/40 p-3">
                  <p className="text-xs font-medium text-slate-500">
                    Stock
                  </p>

                  <p className="mt-1 text-sm font-semibold text-slate-200">
                    Monitored
                  </p>
                </div>

                <div className="rounded-lg border border-slate-800 bg-slate-950/40 p-3">
                  <p className="text-xs font-medium text-slate-500">
                    Access
                  </p>

                  <p className="mt-1 text-sm font-semibold text-slate-200">
                    Controlled
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-8 xl:p-10">
            <p className="text-xs text-slate-500">
              Inventory Management System
            </p>
          </div>
        </section>

        {/* Login section */}
        <section className="flex flex-1 items-center justify-center px-4 py-8 sm:px-6 sm:py-10 lg:px-12 lg:py-12">
          <div className="w-full max-w-[420px]">

            {/* Mobile brand */}
            <div className="mb-10 lg:hidden">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-sm font-bold text-white shadow-sm">
                  I
                </div>

                <div>
                  <p className="text-sm font-semibold leading-none tracking-tight text-slate-950">
                    Inventory
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    Management
                  </p>
                </div>
              </div>
            </div>

            {/* Heading */}
            <div className="mb-7">
              <p className="text-sm font-semibold text-blue-600">
                Welcome back
              </p>

              <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
                Sign in to your account
              </h1>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Enter your details below to access your inventory dashboard.
              </p>
            </div>

            {/* Error */}
            {error && (
              <div
                role="alert"
                className={`mb-6 rounded-lg border px-4 py-3 ${
                  verificationRequired
                    ? 'border-amber-200 bg-amber-50'
                    : 'border-red-200 bg-red-50'
                }`}
              >
                <p
                  className={`text-sm font-medium leading-5 ${
                    verificationRequired
                      ? 'text-amber-700'
                      : 'text-red-700'
                  }`}
                >
                  {error}
                </p>

                {verificationRequired && (
                  <button
                    type="button"
                    onClick={handleResendVerification}
                    disabled={resending}
                    className="mt-3 text-sm font-semibold text-blue-600 transition hover:text-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {resending
                      ? 'Sending verification email...'
                      : 'Resend verification email'}
                  </button>
                )}
              </div>
            )}

            {/* Verification success */}
            {verificationMessage && (
              <div
                role="status"
                className="mb-6 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3"
              >
                <p className="text-sm font-medium leading-5 text-emerald-700">
                  {verificationMessage}
                </p>

                <button
                  type="button"
                  onClick={() =>
                    router.push(
                      `/verify-email?email=${encodeURIComponent(email)}`
                    )
                  }
                  className="mt-3 text-sm font-semibold text-blue-600 transition hover:text-blue-700"
                >
                  Go to verification page
                </button>
              </div>
            )}

            {/* Google sign in */}
            <div className="mb-6">
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={loading || googleLoading}
                className="inline-flex h-12 w-full items-center justify-center gap-3 rounded-lg border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {googleLoading ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-blue-600" />

                    <span>
                      Connecting to Google...
                    </span>
                  </>
                ) : (
                  <>
                    <svg
                      aria-hidden="true"
                      className="h-5 w-5"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M21.805 12.23c0-.79-.065-1.55-.207-2.28H12v4.31h5.51a4.7 4.7 0 0 1-2.045 3.083v2.564h3.31c1.938-1.784 3.03-4.414 3.03-7.677Z"
                        fill="#4285F4"
                      />

                      <path
                        d="M12 22c2.77 0 5.09-.917 6.785-2.493l-3.31-2.564c-.917.615-2.09.985-3.475.985-2.673 0-4.94-1.806-5.754-4.234H2.824v2.647A10.24 10.24 0 0 0 12 22Z"
                        fill="#34A853"
                      />

                      <path
                        d="M6.246 13.694A6.16 6.16 0 0 1 5.92 12c0-.588.1-1.16.326-1.694V7.659H2.824A10.04 10.04 0 0 0 1.75 12c0 1.397.335 2.718 1.074 4.341l3.422-2.647Z"
                        fill="#FBBC05"
                      />

                      <path
                        d="M12 6.072c1.508 0 2.862.518 3.927 1.53l2.945-2.946C17.085 2.996 14.765 2 12 2a10.24 10.24 0 0 0-9.176 5.659l3.422 2.647C7.06 7.878 9.327 6.072 12 6.072Z"
                        fill="#EA4335"
                      />
                    </svg>

                    <span>
                      Continue with Google
                    </span>
                  </>
                )}
              </button>
            </div>

            {/* Divider */}
            <div className="mb-6 flex items-center gap-4">
              <div className="h-px flex-1 bg-slate-200" />

              <span className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Or continue with email
              </span>

              <div className="h-px flex-1 bg-slate-200" />
            </div>

            {/* Form */}
            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >
              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Email address
                </label>

                <input
                  id="email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value);
                    setVerificationRequired(false);
                    setVerificationMessage('');
                    setError('');
                  }}
                  autoComplete="email"
                  autoFocus
                  required
                  placeholder="you@example.com"
                  className="block h-12 w-full rounded-lg border border-slate-200 bg-white px-4 text-sm text-slate-950 shadow-sm outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              {/* Password */}
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-slate-700"
                  >
                    Password
                  </label>

                  <button
                    type="button"
                    onClick={() => router.push('/forgot-password')}
                    className="text-sm font-semibold text-blue-600 transition hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    Forgot password?
                  </button>
                </div>

                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(event) =>
                      setPassword(event.target.value)
                    }
                    autoComplete="current-password"
                    required
                    placeholder="Enter your password"
                    className="block h-12 w-full rounded-lg border border-slate-200 bg-white px-4 pr-20 text-sm text-slate-950 shadow-sm outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword((current) => !current)
                    }
                    aria-label={
                      showPassword
                        ? 'Hide password'
                        : 'Show password'
                    }
                    className="absolute inset-y-0 right-0 px-4 text-xs font-semibold text-slate-500 transition hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
              </div>

              {/* Remember */}
              <div className="flex items-center">
                <label className="inline-flex min-h-10 cursor-pointer items-center gap-2.5">
                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={(event) =>
                      setRemember(event.target.checked)
                    }
                    className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
                  />

                  <span className="text-sm text-slate-600">
                    Remember me
                  </span>
                </label>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading || googleLoading}
                className="inline-flex h-12 w-full items-center justify-center rounded-lg bg-blue-600 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? 'Signing in...' : 'Sign in'}
              </button>
            </form>

            {/* Register */}
            <div className="mt-8 border-t border-slate-200 pt-6 text-center">
              <p className="text-sm text-slate-500">
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => router.push('/register')}
                  className="font-semibold text-blue-600 transition hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Create one
                </button>
              </p>
            </div>

          </div>
        </section>
      </div>
    </main>
  );
}

