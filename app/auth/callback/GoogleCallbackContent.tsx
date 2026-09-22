'use client';

import { FormEvent, useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function GoogleCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [error, setError] = useState('');
  const [requiresBusinessName, setRequiresBusinessName] =
    useState(false);

  const [businessName, setBusinessName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

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

        if (data.requires_business_name) {
          setRequiresBusinessName(true);
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

  async function handleBusinessSetup(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    const code = searchParams.get('code');

    if (!code) {
      setError(
        'The Google authentication response was incomplete. Please try again.'
      );
      return;
    }

    const trimmedBusinessName = businessName.trim();

    if (!trimmedBusinessName) {
      setError('Please enter your business name.');
      return;
    }

    if (trimmedBusinessName.length > 255) {
      setError(
        'Business name must be 255 characters or fewer.'
      );
      return;
    }

    setError('');
    setIsSubmitting(true);

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
            business_name: trimmedBusinessName,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.message ||
            'Unable to finish setting up your account. Please try again.'
        );
        setIsSubmitting(false);
        return;
      }

      if (data.requires_business_name) {
        setError(
          'Please enter your business name to continue.'
        );
        setIsSubmitting(false);
        return;
      }

      router.replace('/dashboard');
      router.refresh();
    } catch {
      setError(
        'Unable to complete account setup. Please try again.'
      );
      setIsSubmitting(false);
    }
  }

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

  if (requiresBusinessName) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10">
        <div className="w-full max-w-[420px]">
          <div className="mb-8 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-lg font-bold text-white shadow-sm">
              I
            </div>

            <h1 className="mt-6 text-2xl font-bold tracking-tight text-slate-900">
              Set up your workspace
            </h1>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              One last step. Enter your business name to create your
              inventory workspace.
            </p>
          </div>

          <form
            onSubmit={handleBusinessSetup}
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
          >
            <label
              htmlFor="business-name"
              className="block text-sm font-medium text-slate-700"
            >
              Business name
            </label>

            <input
              id="business-name"
              name="business_name"
              type="text"
              value={businessName}
              onChange={(event) =>
                setBusinessName(event.target.value)
              }
              placeholder="e.g. Acme Electronics"
              autoComplete="organization"
              autoFocus
              disabled={isSubmitting}
              className="mt-2 h-12 w-full rounded-lg border border-slate-200 bg-white px-4 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-50"
            />

            <p className="mt-2 text-xs leading-5 text-slate-500">
              This name will appear throughout your inventory
              workspace.
            </p>

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-6 inline-flex h-12 w-full items-center justify-center rounded-lg bg-blue-600 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting
                ? 'Creating your workspace...'
                : 'Continue to workspace'}
            </button>
          </form>
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