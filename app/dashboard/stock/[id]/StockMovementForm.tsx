'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';

type StockMovementFormProps = {
  productId: number;
};

type MovementType = 'in' | 'out';

export default function StockMovementForm({
  productId,
}: StockMovementFormProps) {
  const router = useRouter();

  const [type, setType] = useState<MovementType>('in');
  const [quantity, setQuantity] = useState('');
  const [reason, setReason] = useState('');
  const [notes, setNotes] = useState('');

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [saving, setSaving] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError('');
    setSuccess('');

    const parsedQuantity = Number(quantity);

    if (!Number.isInteger(parsedQuantity) || parsedQuantity <= 0) {
      setError('Enter a valid quantity greater than 0.');
      return;
    }

    if (!reason.trim()) {
      setError('Please provide a reason for this stock adjustment.');
      return;
    }

    setSaving(true);

    try {
      const response = await fetch(
        `/api/products/${productId}/stock-movements`,
        {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            type,
            quantity: parsedQuantity,
            reason: reason.trim(),
            notes: notes.trim() || null,
          }),
        }
      );

      const data = await response.json();

      if (response.status === 401) {
        router.push('/login');
        return;
      }

      if (!response.ok) {
        setError(
          data.message ||
            'Failed to record the stock movement.'
        );
        return;
      }

      setQuantity('');
      setReason('');
      setNotes('');
      setSuccess(
        type === 'in'
          ? 'Stock added successfully.'
          : 'Stock removed successfully.'
      );

      router.refresh();
    } catch {
      setError(
        'Unable to connect to the server. Please try again.'
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Movement type */}
      <div>
        <label className="text-sm font-semibold text-slate-950">
          Movement type
        </label>

        <p className="mt-1 text-xs text-slate-500">
          Choose whether inventory is being added or removed.
        </p>

        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => setType('in')}
            disabled={saving}
            className={`rounded-lg border px-4 py-3 text-left transition focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
              type === 'in'
                ? 'border-emerald-300 bg-emerald-50'
                : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
            } disabled:cursor-not-allowed disabled:opacity-60`}
          >
            <div className="flex items-center gap-3">
              <span
                className={`flex h-9 w-9 items-center justify-center rounded-lg text-lg font-semibold ${
                  type === 'in'
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'bg-slate-100 text-slate-500'
                }`}
              >
                +
              </span>

              <div>
                <p
                  className={`text-sm font-semibold ${
                    type === 'in'
                      ? 'text-emerald-800'
                      : 'text-slate-700'
                  }`}
                >
                  Stock in
                </p>

                <p className="mt-0.5 text-xs text-slate-500">
                  Add inventory
                </p>
              </div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setType('out')}
            disabled={saving}
            className={`rounded-lg border px-4 py-3 text-left transition focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
              type === 'out'
                ? 'border-red-300 bg-red-50'
                : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
            } disabled:cursor-not-allowed disabled:opacity-60`}
          >
            <div className="flex items-center gap-3">
              <span
                className={`flex h-9 w-9 items-center justify-center rounded-lg text-lg font-semibold ${
                  type === 'out'
                    ? 'bg-red-100 text-red-700'
                    : 'bg-slate-100 text-slate-500'
                }`}
              >
                −
              </span>

              <div>
                <p
                  className={`text-sm font-semibold ${
                    type === 'out'
                      ? 'text-red-800'
                      : 'text-slate-700'
                  }`}
                >
                  Stock out
                </p>

                <p className="mt-0.5 text-xs text-slate-500">
                  Remove inventory
                </p>
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Quantity */}
      <div>
        <label
          htmlFor="quantity"
          className="mb-2 block text-sm font-semibold text-slate-700"
        >
          Quantity
        </label>

        <input
          id="quantity"
          name="quantity"
          type="number"
          min="1"
          step="1"
          inputMode="numeric"
          value={quantity}
          onChange={(event) => setQuantity(event.target.value)}
          disabled={saving}
          placeholder="Enter quantity"
          required
          className="block h-11 w-full rounded-lg border border-slate-200 bg-white px-3.5 text-sm text-slate-950 shadow-sm outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-50"
        />
      </div>

      {/* Reason */}
      <div>
        <label
          htmlFor="reason"
          className="mb-2 block text-sm font-semibold text-slate-700"
        >
          Reason
        </label>

        <input
          id="reason"
          name="reason"
          type="text"
          value={reason}
          onChange={(event) => setReason(event.target.value)}
          disabled={saving}
          placeholder="e.g. New shipment, sale, damaged item"
          required
          maxLength={255}
          className="block h-11 w-full rounded-lg border border-slate-200 bg-white px-3.5 text-sm text-slate-950 shadow-sm outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-50"
        />
      </div>

      {/* Notes */}
      <div>
        <label
          htmlFor="notes"
          className="mb-2 block text-sm font-semibold text-slate-700"
        >
          Notes
          <span className="ml-1 font-normal text-slate-400">
            (optional)
          </span>
        </label>

        <textarea
          id="notes"
          name="notes"
          value={notes}
          onChange={(event) => setNotes(event.target.value)}
          disabled={saving}
          rows={3}
          maxLength={1000}
          placeholder="Add any additional details..."
          className="block w-full resize-none rounded-lg border border-slate-200 bg-white px-3.5 py-3 text-sm text-slate-950 shadow-sm outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-50"
        />
      </div>

      {/* Feedback */}
      {error && (
        <div
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 px-4 py-3"
        >
          <p className="text-sm font-medium leading-5 text-red-700">
            {error}
          </p>
        </div>
      )}

      {success && (
        <div
          role="status"
          className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3"
        >
          <p className="text-sm font-medium leading-5 text-emerald-700">
            {success}
          </p>
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={saving}
        className={`inline-flex h-11 w-full items-center justify-center rounded-lg px-4 text-sm font-semibold text-white shadow-sm transition focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 ${
          type === 'in'
            ? 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
            : 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
        }`}
      >
        {saving
          ? 'Saving...'
          : type === 'in'
            ? 'Add stock'
            : 'Remove stock'}
      </button>
    </form>
  );
}