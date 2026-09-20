'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

type VerifyEmailContentProps = {
  email: string;
};

export default function VerifyEmailContent({
  email,
}: VerifyEmailContentProps) {
  const router = useRouter();

  const [resending, setResending] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  async function handleResend() {
    if (!email) {
      setError(
        'We could not determine your email address. Please return to registration and try again.'
      );
      return;
    }

    setResending(true);
    setMessage('');
    setError('');

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

      setMessage(
        data.message ||
          'A new verification email has been sent. Please check your inbox.'
      );
    } catch {
      setError(
        'Something went wrong while sending the verification email. Please try again.'
      );
    } finally {
      setResending(false);
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

          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-50">
              <svg
                className="h-8 w-8 text-blue-600"
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

            <h1 className="mt-6 text-2xl font-bold text-slate-950">
              Check your email
            </h1>

            <p className="mt-3 text-sm leading-6 text-slate-500">
              We sent a verification link to:
            </p>

            {email && (
              <p className="mt-2 break-all font-medium text-slate-950">
                {email}
              </p>
            )}

            <p className="mt-4 text-sm leading-6 text-slate-500">
              Click the link in the email to verify your account.
              If you don't see it, check your spam or junk folder.
            </p>

            {message && (
              <div className="mt-6 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-left text-sm leading-5 text-emerald-700">
                {message}
              </div>
            )}

            {error && (
              <div className="mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-left text-sm leading-5 text-red-700">
                {error}
              </div>
            )}

            <button
              type="button"
              onClick={handleResend}
              disabled={resending || !email}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {resending ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Sending...
                </>
              ) : (
                'Resend verification email'
              )}
            </button>

            <button
              type="button"
              onClick={() => router.push('/login')}
              className="mt-3 w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-300 focus:ring-offset-2"
            >
              Back to sign in
            </button>
          </div>

          <p className="mt-6 text-center text-xs leading-5 text-slate-400">
            Your account must be verified before you can sign in.
          </p>
        </div>
      </div>
    </main>
  );
}