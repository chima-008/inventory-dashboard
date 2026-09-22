'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function GoogleCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [error, setError] = useState('');

  const hasExchanged = useRef(false);

  useEffect(() => {
    if (hasExchanged.current) {
      return;
    }

    hasExchanged.current = true;

    const code = searchParams.get('code');
    const errorCode = searchParams.get('error');

    if (errorCode) {
      setError(
        'Google sign in could not be completed. Please try again.'
      );
      return;
    }

    if (!code) {
      setError(
        'The Google authentication response was incomplete. Please try again.'
      );
      return;
    }

    async function exchangeCode() {
      try {
        const response = await fetch(
          '/api/auth/google/exchange',
          {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              code,
            }),
          }
        );

        const data = await response.json();

        if (!response.ok) {
          setError(
            data.message ||
              'Google sign in could not be completed. Please try again.'
          );
          return;
        }

        router.replace('/dashboard');
        router.refresh();
      } catch {
        setError(
          'Unable to complete Google sign in. Please try again.'
        );
      }
    }

    exchangeCode();
  }, [router, searchParams]);

  if (error) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
        <div className="w-full max-w-[420px]">
          <div className="rounded-xl border border-red-200 bg-red-50 px-5 py-4">
            <p className="text-sm font-medium leading-6 text-red-700">
              {error}
            </p>
          </div>

          <button
            type="button"
            onClick={() => router.replace('/login')}
            className="mt-5 inline-flex h-12 w-full items-center justify-center rounded-lg bg-blue-600 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Back to sign in
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="text-center">
        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-blue-600" />

        <p className="mt-4 text-sm font-medium text-slate-600">
          Completing Google sign in...
        </p>
      </div>
    </main>
  );
}