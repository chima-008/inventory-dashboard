'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Category } from '@/types/product';

type CategoryFormProps = {
  category: Category;
};

export default function CategoryForm({
  category,
}: CategoryFormProps) {
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
      const response = await fetch(
        `/api/categories/${category.id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name,
            slug,
            description,
          }),
        }
      );

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
            data.message || 'Failed to update category.'
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
      className="max-w-3xl"
    >
      {error && (
        <div
          role="alert"
          className="mb-7 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-700"
        >
          {error}
        </div>
      )}

      <div className="space-y-7">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-semibold text-slate-900"
          >
            Category name
          </label>

          <p className="mt-1 text-xs leading-5 text-slate-500">
            Update the name used to identify this category.
          </p>

          <input
            id="name"
            name="name"
            type="text"
            defaultValue={category.name}
            required
            className="mt-3 w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        <div>
          <label
            htmlFor="description"
            className="block text-sm font-semibold text-slate-900"
          >
            Description
          </label>

          <p className="mt-1 text-xs leading-5 text-slate-500">
            Update the description to help explain what belongs in this
            category.
          </p>

          <textarea
            id="description"
            name="description"
            rows={5}
            defaultValue={category.description ?? ''}
            className="mt-3 w-full resize-y rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm leading-6 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-sm font-semibold text-blue-600">
              #
            </div>

            <div>
              <p className="text-sm font-semibold text-slate-900">
                Category URL
              </p>

              <p className="mt-1 text-xs leading-5 text-slate-500">
                The category slug is generated automatically from the
                category name when you save your changes.
              </p>

              <div className="mt-3 inline-flex rounded-md border border-slate-200 bg-white px-2.5 py-1.5 font-mono text-xs text-slate-600">
                /{category.slug}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 flex flex-wrap gap-3 border-t border-slate-100 pt-6">
        <button
          type="submit"
          disabled={submitting}
          className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {submitting ? 'Saving...' : 'Save changes'}
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