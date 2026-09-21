'use client';

import { FormEvent, useState } from 'react';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setMessage('');
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.message ||
            'Unable to process your request. Please try again.'
        );
        return;
      }

      setMessage(
        data.message ||
          'If an account exists with that email address, a password reset link has been sent.'
      );
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
                    d="M3 8l9 6 9-6"
                  />
                  <rect
                    x="3"
                    y="5"
                    width="18"
                    height="14"
                    rx="2"
                  />
                </svg>
              </div>

              <h1 className="text-2xl font-bold text-slate-950">
                Forgot your password?
              </h1>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Enter the email address associated with your account and
                we'll send you a link to reset your password.
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
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@example.com"
                  required
                  disabled={loading}
                  className="h-12 w-full rounded-lg border border-slate-200 bg-white px-4 text-sm text-slate-950 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:bg-slate-50"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Sending...
                  </>
                ) : (
                  'Send reset link'
                )}
              </button>
            </form>

            <div className="mt-6 border-t border-slate-100 pt-6 text-center">
              <Link
                href="/login"
                className="text-sm font-semibold text-blue-600 transition hover:text-blue-700"
              >
                Back to sign in
              </Link>
            </div>
          </div>

          <p className="mt-6 text-center text-xs leading-5 text-slate-400">
            For your security, we don't reveal whether an email address is
            associated with an account.
          </p>
        </div>
      </div>
    </main>
  );
}