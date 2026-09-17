'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

type DeleteCategoryButtonProps = {
  categoryId: number;
  categoryName: string;
};

export default function DeleteCategoryButton({
  categoryId,
  categoryName,
}: DeleteCategoryButtonProps) {
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');

  function handleOpen() {
    setError('');
    setOpen(true);
  }

  function handleClose() {
    if (deleting) {
      return;
    }

    setOpen(false);
    setError('');
  }

  async function handleDelete() {
    setDeleting(true);
    setError('');

    try {
      const response = await fetch(
        `/api/categories/${categoryId}`,
        {
          method: 'DELETE',
        }
      );

      const data = await response.json();

      if (response.status === 401) {
        router.push('/login');
        return;
      }

      if (!response.ok) {
        setError(
          data.message || 'Failed to delete category.'
        );
        setDeleting(false);
        return;
      }

      setOpen(false);
      router.refresh();
    } catch {
      setError(
        'Unable to connect to the server. Please try again.'
      );
      setDeleting(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={handleOpen}
        disabled={deleting}
        className="rounded-lg px-2.5 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-50 hover:text-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {deleting ? 'Deleting...' : 'Delete'}
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/50 p-4 sm:p-8"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              handleClose();
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-category-title"
            aria-describedby="delete-category-description"
            className="w-full max-w-2xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl"
          >
            <div className="p-7 sm:p-8">
              <div className="flex items-start gap-5">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-red-50 text-red-600">
                  <span
                    className="text-xl font-semibold"
                    aria-hidden="true"
                  >
                    !
                  </span>
                </div>

                <div className="min-w-0 flex-1">
                  <h2
                    id="delete-category-title"
                    className="text-xl font-semibold tracking-tight text-slate-950"
                  >
                    Delete category?
                  </h2>

                  <p
                    id="delete-category-description"
                    className="mt-3 max-w-none break-words text-sm leading-7 text-slate-500"
                  >
                    You are about to delete{' '}
                    <span className="font-semibold text-slate-900">
                      "{categoryName}"
                    </span>
                    . This action cannot be undone.
                  </p>
                </div>
              </div>

              {error && (
                <div
                  role="alert"
                  className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-700"
                >
                  {error}
                </div>
              )}
            </div>

            <div className="flex flex-col-reverse gap-3 border-t border-slate-200 bg-slate-50 px-7 py-5 sm:flex-row sm:justify-end sm:px-8">
              <button
                type="button"
                onClick={handleClose}
                disabled={deleting}
                className="rounded-lg border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 hover:text-slate-950 focus:outline-none focus:ring-2 focus:ring-slate-300 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className="rounded-lg bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {deleting ? 'Deleting...' : 'Delete category'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}