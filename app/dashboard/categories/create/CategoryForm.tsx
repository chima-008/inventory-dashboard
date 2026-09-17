'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CategoryForm() {
  const router = useRouter();

  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(formData: FormData) {
    setSubmitting(true);
    setError('');

    const name = String(
      formData.get('name') ?? ''
    ).trim();

    const description =
      String(
        formData.get('description') ?? ''
      ).trim() || null;

    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');

    try {
      const response = await fetch('/api/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          slug,
          description,
        }),
      });

      const data = await response.json();

      if (response.status === 401) {
        router.push('/login');
        return;
      }

      if (!response.ok) {
        if (data.errors) {
          const messages = Object.values(data.errors)
            .flat()
            .join(' ');

          setError(messages);
        } else {
          setError(
            data.message || 'Failed to create category.'
          );
        }

        return;
      }

      router.push('/dashboard/categories');
      router.refresh();
    } catch {
      setError(
        'Unable to connect to the server. Please try again.'
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form
      action={handleSubmit}
      className="max-w-2xl space-y-7"
    >
      {error && (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm leading-6 text-red-700"
        >
          {error}
        </div>
      )}

      {/* Category name */}
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-semibold text-slate-900"
        >
          Category name
        </label>

        <p className="mt-1 text-xs text-slate-500">
          Choose a clear name that describes the products in this category.
        </p>

        <input
          id="name"
          name="name"
          type="text"
          required
          className="mt-3 w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          placeholder="e.g. Electronics"
        />
      </div>

      {/* Description */}
      <div>
        <label
          htmlFor="description"
          className="block text-sm font-semibold text-slate-900"
        >
          Description
        </label>

        <p className="mt-1 text-xs text-slate-500">
          Add an optional description to help explain what belongs in this category.
        </p>

        <textarea
          id="description"
          name="description"
          rows={5}
          className="mt-3 w-full resize-y rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm leading-6 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          placeholder="Describe this category..."
        />
      </div>

      {/* Actions */}
      <div className="flex flex-wrap items-center gap-3 border-t border-slate-100 pt-6">
        <button
          type="submit"
          disabled={submitting}
          className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {submitting
            ? 'Creating...'
            : 'Create category'}
        </button>

        <button
          type="button"
          onClick={() =>
            router.push('/dashboard/categories')
          }
          className="rounded-lg border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 hover:text-slate-950 focus:outline-none focus:ring-2 focus:ring-slate-300 focus:ring-offset-2"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}