'use client';

import { FormEvent, useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

export default function ResetPasswordContent() {
  const searchParams = useSearchParams();

  const [token, setToken] = useState('');
  const [email, setEmail] = useState('');

  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] =
    useState('');

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setToken(searchParams.get('token') ?? '');
    setEmail(searchParams.get('email') ?? '');
  }, [searchParams]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setMessage('');
    setError('');

    if (!token || !email) {
      setError(
        'This password reset link is missing required information. Please request a new reset link.'
      );
      return;
    }

    if (password !== passwordConfirmation) {
      setError('The passwords do not match.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          email,
          password,
          password_confirmation: passwordConfirmation,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.message ||
            'Unable to reset your password. Please try again.'
        );
        return;
      }

      setMessage(
        data.message ||
          'Your password has been reset successfully.'
      );

      setPassword('');
      setPasswordConfirmation('');
    } catch {
      setError(
        'Something went wrong. Please check your connection and try again.'
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-12">
      <div className="mx-auto flex min-h-[80vh] w-full max-w-md items-center justify-center">
        <div className="w-full">
          <div className="mb-8 text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-xl font-bold text-slate-950 transition hover:text-blue-600"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-sm font-bold text-white">
                ID
              </span>
              Inventory Dashboard
            </Link>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
            <div className="mb-8">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <svg
                  className="h-6 w-6"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 15v2"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M7 10V8a5 5 0 0110 0v2"
                  />
                  <rect
                    x="5"
                    y="10"
                    width="14"
                    height="10"
                    rx="2"
                  />
                </svg>
              </div>

              <h1 className="text-2xl font-bold text-slate-950">
                Create a new password
              </h1>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Choose a strong password for your Inventory Dashboard
                account.
              </p>
            </div>

            {message && (
              <div className="mb-6 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm leading-5 text-emerald-700">
                {message}
              </div>
            )}

            {error && (
              <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm leading-5 text-red-700">
                {error}
              </div>
            )}

            {!message && (
              <form onSubmit={handleSubmit} className="space-y-5">
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
                    autoComplete="email"
                    value={email}
                    onChange={(event) =>
                      setEmail(event.target.value)
                    }
                    placeholder="you@example.com"
                    required
                    disabled={loading}
                    className="h-12 w-full rounded-lg border border-slate-200 bg-white px-4 text-sm text-slate-950 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:bg-slate-50"
                  />
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="mb-2 block text-sm font-medium text-slate-700"
                  >
                    New password
                  </label>

                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    value={password}
                    onChange={(event) =>
                      setPassword(event.target.value)
                    }
                    placeholder="Enter a new password"
                    minLength={8}
                    required
                    disabled={loading}
                    className="h-12 w-full rounded-lg border border-slate-200 bg-white px-4 text-sm text-slate-950 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:bg-slate-50"
                  />

                  <p className="mt-2 text-xs text-slate-400">
                    Use at least 8 characters.
                  </p>
                </div>

                <div>
                  <label
                    htmlFor="password_confirmation"
                    className="mb-2 block text-sm font-medium text-slate-700"
                  >
                    Confirm new password
                  </label>

                  <input
                    id="password_confirmation"
                    name="password_confirmation"
                    type="password"
                    autoComplete="new-password"
                    value={passwordConfirmation}
                    onChange={(event) =>
                      setPasswordConfirmation(event.target.value)
                    }
                    placeholder="Re-enter your new password"
                    minLength={8}
                    required
                    disabled={loading}
                    className="h-12 w-full rounded-lg border border-slate-200 bg-white px-4 text-sm text-slate-950 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:bg-slate-50"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading || !token}
                  className="flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Resetting password...
                    </>
                  ) : (
                    'Reset password'
                  )}
                </button>
              </form>
            )}

            {message && (
              <Link
                href="/login"
                className="flex h-12 w-full items-center justify-center rounded-lg bg-blue-600 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Continue to sign in
              </Link>
            )}

            {!message && (
              <div className="mt-6 border-t border-slate-100 pt-6 text-center">
                <Link
                  href="/login"
                  className="text-sm font-semibold text-blue-600 transition hover:text-blue-700"
                >
                  Back to sign in
                </Link>
              </div>
            )}
          </div>

          <p className="mt-6 text-center text-xs leading-5 text-slate-400">
            Password reset links expire after 60 minutes.
          </p>
        </div>
      </div>
    </main>
  );
}