'use client';

import { FormEvent, useState } from 'react';

export default function InviteManager() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setSuccessMessage('');
    setErrorMessage('');

    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      setErrorMessage(
        'Please enter the manager’s email address.'
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/invitations', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: trimmedEmail,
        }),
      });

      const data = await response.json().catch(() => null);

      if (response.status === 401) {
        window.location.href = '/login';
        return;
      }

      if (!response.ok) {
        setErrorMessage(
          data?.message ||
            'Unable to send the invitation. Please try again.'
        );
        return;
      }

      setEmail('');

      setSuccessMessage(
        data?.message ||
          'Manager invitation sent successfully.'
      );
    } catch {
      setErrorMessage(
        'Unable to connect to the server. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 px-5 py-5 sm:px-6">
        <div>
          <h2 className="text-base font-semibold text-slate-900">
            Invite a manager
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Invite someone to help manage this inventory
            workspace.
          </p>
        </div>
      </div>

      <div className="px-5 py-5 sm:px-6">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-3 sm:flex-row sm:items-end"
        >
          <div className="flex-1">
            <label
              htmlFor="manager-email"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Manager email
            </label>

            <input
              id="manager-email"
              type="email"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
              placeholder="manager@example.com"
              autoComplete="email"
              disabled={isSubmitting}
              className="h-12 w-full rounded-lg border border-slate-200 bg-white px-4 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-50"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="h-12 rounded-lg bg-blue-600 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting
              ? 'Sending...'
              : 'Send invitation'}
          </button>
        </form>

        {successMessage ? (
          <div className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            {successMessage}
          </div>
        ) : null}

        {errorMessage ? (
          <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {errorMessage}
          </div>
        ) : null}
      </div>
    </section>
  );
}