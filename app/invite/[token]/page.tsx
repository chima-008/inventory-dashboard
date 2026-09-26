'use client';

import { FormEvent, useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

type InvitationDetails = {
  business_name: string;
  email: string;
  role: string;
  expires_at: string;
};

export default function InvitationPage() {
  const router = useRouter();
  const params = useParams();

  const token =
    typeof params.token === 'string'
      ? params.token
      : '';

  const [invitation, setInvitation] =
    useState<InvitationDetails | null>(null);

  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] =
    useState('');

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [error, setError] = useState('');

  useEffect(() => {
    if (!token) {
      setError(
        'This invitation link is invalid.'
      );
      setIsLoading(false);
      return;
    }

    async function loadInvitation() {
      try {
        const response = await fetch(
          `/api/invitations/${token}`,
          {
            method: 'GET',
            headers: {
              Accept: 'application/json',
            },
            cache: 'no-store',
          }
        );

        const data = await response.json().catch(
          () => null
        );

        if (!response.ok) {
          setError(
            data?.message ||
              'This invitation is invalid or has expired.'
          );
          return;
        }

        setInvitation(data);
      } catch {
        setError(
          'Unable to load this invitation. Please try again.'
        );
      } finally {
        setIsLoading(false);
      }
    }

    loadInvitation();
  }, [token]);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError('');

    const trimmedName = name.trim();

    if (!trimmedName) {
      setError('Please enter your name.');
      return;
    }

    if (password.length < 8) {
      setError(
        'Password must be at least 8 characters.'
      );
      return;
    }

    if (password !== passwordConfirmation) {
      setError(
        'Passwords do not match.'
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(
        '/api/invitations/complete',
        {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            token,
            name: trimmedName,
            password,
            password_confirmation:
              passwordConfirmation,
          }),
        }
      );

      const data = await response.json().catch(
        () => null
      );

      if (!response.ok) {
        setError(
          data?.message ||
            'Unable to create your manager account. Please try again.'
        );
        return;
      }

      if (data?.token) {
  router.replace('/dashboard');
  return;
}

      setError(
        'Your account was created, but we could not establish your session. Please try signing in.'
      );
    } catch {
      setError(
        'Unable to connect to the server. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-blue-600" />

          <p className="mt-4 text-sm font-medium text-slate-600">
            Loading invitation...
          </p>
        </div>
      </main>
    );
  }

  if (error && !invitation) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
        <div className="w-full max-w-[420px]">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-lg font-bold text-white shadow-sm">
              I
            </div>

            <h1 className="mt-6 text-center text-2xl font-bold tracking-tight text-slate-900">
              Invitation unavailable
            </h1>

            <p className="mt-3 text-center text-sm leading-6 text-slate-500">
              {error}
            </p>

            <button
              type="button"
              onClick={() =>
                router.replace('/login')
              }
              className="mt-6 inline-flex h-12 w-full items-center justify-center rounded-lg bg-blue-600 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Go to sign in
            </button>
          </div>
        </div>
      </main>
    );
  }

  if (!invitation) {
    return null;
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10">
      <div className="w-full max-w-[460px]">
        <div className="mb-8 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-lg font-bold text-white shadow-sm">
            I
          </div>

          <h1 className="mt-6 text-2xl font-bold tracking-tight text-slate-900">
            Join the inventory workspace
          </h1>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            You have been invited to manage inventory for{' '}
            <span className="font-semibold text-slate-700">
              {invitation.business_name}
            </span>
            .
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="rounded-xl border border-blue-100 bg-blue-50 px-4 py-4">
            <p className="text-xs font-medium uppercase tracking-wide text-blue-600">
              Manager invitation
            </p>

            <p className="mt-2 text-sm font-semibold text-slate-900">
              {invitation.email}
            </p>

            <p className="mt-1 text-sm text-slate-600">
              Role: Manager
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="mt-6 space-y-5"
          >
            {error ? (
              <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3">
                <p className="text-sm leading-6 text-red-700">
                  {error}
                </p>
              </div>
            ) : null}

            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-slate-700"
              >
                Full name
              </label>

              <input
                id="name"
                type="text"
                value={name}
                onChange={(event) =>
                  setName(event.target.value)
                }
                placeholder="Your full name"
                autoComplete="name"
                disabled={isSubmitting}
                className="mt-2 h-12 w-full rounded-lg border border-slate-200 bg-white px-4 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-50"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-slate-700"
              >
                Password
              </label>

              <input
                id="password"
                type="password"
                value={password}
                onChange={(event) =>
                  setPassword(event.target.value)
                }
                placeholder="At least 8 characters"
                autoComplete="new-password"
                disabled={isSubmitting}
                className="mt-2 h-12 w-full rounded-lg border border-slate-200 bg-white px-4 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-50"
              />
            </div>

            <div>
              <label
                htmlFor="password-confirmation"
                className="block text-sm font-medium text-slate-700"
              >
                Confirm password
              </label>

              <input
                id="password-confirmation"
                type="password"
                value={passwordConfirmation}
                onChange={(event) =>
                  setPasswordConfirmation(
                    event.target.value
                  )
                }
                placeholder="Enter your password again"
                autoComplete="new-password"
                disabled={isSubmitting}
                className="mt-2 h-12 w-full rounded-lg border border-slate-200 bg-white px-4 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-50"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex h-12 w-full items-center justify-center rounded-lg bg-blue-600 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting
                ? 'Creating your account...'
                : 'Create manager account'}
            </button>
          </form>

          <div className="mt-6 border-t border-slate-200 pt-5">
            <p className="text-center text-xs leading-5 text-slate-500">
              By creating your account, you will join{' '}
              <span className="font-medium text-slate-700">
                {invitation.business_name}
              </span>{' '}
              as a manager.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}