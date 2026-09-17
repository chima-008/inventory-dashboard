'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Category } from '@/types/product';

type ProductFormProps = {
  categories: Category[];
};

function formatPrice(value: string | number) {
  const rawValue = String(value).replace(/,/g, '');

  if (!rawValue) {
    return '';
  }

  const [integerPart, decimalPart] = rawValue.split('.');

  const formattedInteger = Number(integerPart || 0).toLocaleString(
    'en-NG'
  );

  if (decimalPart !== undefined) {
    return `${formattedInteger}.${decimalPart.slice(0, 2)}`;
  }

  return formattedInteger;
}

function getCleanPrice(value: string) {
  return value.replace(/,/g, '');
}

function formatQuantity(value: string | number) {
  const rawValue = String(value).replace(/,/g, '');

  if (!rawValue) {
    return '';
  }

  return Number(rawValue).toLocaleString('en-NG');
}

function getCleanQuantity(value: string) {
  return value.replace(/,/g, '');
}

export default function ProductForm({
  categories,
}: ProductFormProps) {
  const router = useRouter();

  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string[]>
  >({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [price, setPrice] = useState('');
  const [stockQuantity, setStockQuantity] = useState('');

  function handlePriceChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const value = event.target.value;

    const cleanedValue = value
      .replace(/,/g, '')
      .replace(/[^\d.]/g, '');

    const parts = cleanedValue.split('.');

    if (parts.length > 2) {
      return;
    }

    const integerPart = parts[0] || '';
    const decimalPart = parts[1];

    if (decimalPart !== undefined && decimalPart.length > 2) {
      return;
    }

    if (!integerPart && decimalPart === undefined) {
      setPrice('');
      return;
    }

    const formattedInteger = integerPart
      ? Number(integerPart).toLocaleString('en-NG')
      : '0';

    setPrice(
      decimalPart !== undefined
        ? `${formattedInteger}.${decimalPart}`
        : formattedInteger
    );
  }

  function handleStockQuantityChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const value = event.target.value;

    const cleanedValue = value
      .replace(/,/g, '')
      .replace(/\D/g, '');

    if (!cleanedValue) {
      setStockQuantity('');
      return;
    }

    setStockQuantity(formatQuantity(cleanedValue));
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError('');
    setValidationErrors({});
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);

    const name = String(formData.get('name') ?? '');

    const slug = name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');

    const payload = {
      name,
      slug,
      sku: formData.get('sku'),
      category_id: Number(formData.get('category_id')),
      price: getCleanPrice(
        String(formData.get('price') ?? '')
      ),
      stock_quantity: Number(
        getCleanQuantity(
          String(formData.get('stock_quantity') ?? '')
        )
      ),
      low_stock_threshold: Number(
        formData.get('low_stock_threshold')
      ),
      description: formData.get('description') || null,
      is_active: formData.get('is_active') === 'on',
    };

    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.status === 401) {
        router.push('/login');
        return;
      }

      if (response.status === 422) {
        setValidationErrors(data.errors ?? {});
        return;
      }

      if (!response.ok) {
        if (data.errors) {
          setValidationErrors(data.errors);
        } else {
          setError(
            data.message || 'Failed to create product.'
          );
        }

        return;
      }

      router.push('/dashboard/products');
      router.refresh();
    } catch {
      setError(
        'Unable to connect to the server. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-3xl"
    >
      {error && (
        <div
          role="alert"
          className="mb-7 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-700"
        >
          {error}
        </div>
      )}

      <div className="grid gap-x-6 gap-y-7 lg:grid-cols-2">
        {/* Product name */}
        <div className="lg:col-span-2">
          <label
            htmlFor="name"
            className="block text-sm font-semibold text-slate-900"
          >
            Product name
          </label>

          <p className="mt-1 text-xs text-slate-500">
            Enter the name customers or staff will use to identify this product.
          </p>

          <input
            id="name"
            name="name"
            type="text"
            placeholder="e.g. Wireless Keyboard"
            className="mt-3 w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />

          {validationErrors.name && (
            <p className="mt-1.5 text-sm text-red-600">
              {validationErrors.name[0]}
            </p>
          )}
        </div>

        {/* SKU */}
        <div>
          <label
            htmlFor="sku"
            className="block text-sm font-semibold text-slate-900"
          >
            SKU
          </label>

          <p className="mt-1 text-xs text-slate-500">
            A unique identifier for this product.
          </p>

          <input
            id="sku"
            name="sku"
            type="text"
            placeholder="e.g. ELEC-KEY-002"
            className="mt-3 w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />

          {validationErrors.sku && (
            <p className="mt-1.5 text-sm text-red-600">
              {validationErrors.sku[0]}
            </p>
          )}
        </div>

        {/* Category */}
        <div>
          <label
            htmlFor="category_id"
            className="block text-sm font-semibold text-slate-900"
          >
            Category
          </label>

          <p className="mt-1 text-xs text-slate-500">
            Select the category this product belongs to.
          </p>

          <select
            id="category_id"
            name="category_id"
            defaultValue=""
            className="mt-3 w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          >
            <option value="" disabled>
              Select a category
            </option>

            {categories.map((category) => (
              <option
                key={category.id}
                value={category.id}
              >
                {category.name}
              </option>
            ))}
          </select>

          {validationErrors.category_id && (
            <p className="mt-1.5 text-sm text-red-600">
              {validationErrors.category_id[0]}
            </p>
          )}
        </div>

        {/* Price */}
        <div>
          <label
            htmlFor="price"
            className="block text-sm font-semibold text-slate-900"
          >
            Price
          </label>

          <p className="mt-1 text-xs text-slate-500">
            Enter the selling price for one unit.
          </p>

          <div className="relative mt-3">
            <span
              aria-hidden="true"
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-medium text-slate-500"
            >
              ₦
            </span>

            <input
              id="price"
              name="price"
              type="text"
              inputMode="decimal"
              value={price}
              onChange={handlePriceChange}
              placeholder="0.00"
              required
              className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-8 pr-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          {validationErrors.price && (
            <p className="mt-1.5 text-sm text-red-600">
              {validationErrors.price[0]}
            </p>
          )}
        </div>

        {/* Initial stock */}
        <div>
          <label
            htmlFor="stock_quantity"
            className="block text-sm font-semibold text-slate-900"
          >
            Initial stock
          </label>

          <p className="mt-1 text-xs text-slate-500">
            The number of units currently available.
          </p>

          <input
            id="stock_quantity"
            name="stock_quantity"
            type="text"
            inputMode="numeric"
            value={stockQuantity}
            onChange={handleStockQuantityChange}
            placeholder="0"
            required
            className="mt-3 w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />

          {validationErrors.stock_quantity && (
            <p className="mt-1.5 text-sm text-red-600">
              {validationErrors.stock_quantity[0]}
            </p>
          )}
        </div>

        {/* Low stock threshold */}
        <div>
          <label
            htmlFor="low_stock_threshold"
            className="block text-sm font-semibold text-slate-900"
          >
            Low-stock threshold
          </label>

          <p className="mt-1 text-xs text-slate-500">
            Stock level at which this product needs attention.
          </p>

          <input
            id="low_stock_threshold"
            name="low_stock_threshold"
            type="number"
            min="0"
            defaultValue="5"
            className="mt-3 w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />

          {validationErrors.low_stock_threshold && (
            <p className="mt-1.5 text-sm text-red-600">
              {validationErrors.low_stock_threshold[0]}
            </p>
          )}
        </div>

        {/* Description */}
        <div className="lg:col-span-2">
          <label
            htmlFor="description"
            className="block text-sm font-semibold text-slate-900"
          >
            Description
          </label>

          <p className="mt-1 text-xs text-slate-500">
            Add any useful information about this product.
          </p>

          <textarea
            id="description"
            name="description"
            rows={5}
            placeholder="Describe the product..."
            className="mt-3 w-full resize-y rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm leading-6 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />

          {validationErrors.description && (
            <p className="mt-1.5 text-sm text-red-600">
              {validationErrors.description[0]}
            </p>
          )}
        </div>

        {/* Active status */}
        <div className="lg:col-span-2">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <label className="flex cursor-pointer items-start gap-3">
              <input
                type="checkbox"
                name="is_active"
                defaultChecked
                className="mt-0.5 h-4 w-4 shrink-0 rounded border-slate-300 text-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-0"
              />

              <span className="min-w-0">
                <span className="block text-sm font-semibold text-slate-900">
                  Product is active
                </span>

                <span className="mt-1 block text-xs leading-5 text-slate-500">
                  Active products are included in inventory totals and can be
                  managed normally.
                </span>
              </span>
            </label>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-8 flex flex-col gap-3 border-t border-slate-100 pt-6 sm:flex-row sm:flex-wrap">
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
        >
          {isSubmitting ? 'Creating...' : 'Create product'}
        </button>

        <button
          type="button"
          onClick={() =>
            router.push('/dashboard/products')
          }
          className="w-full rounded-lg border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 hover:text-slate-950 focus:outline-none focus:ring-2 focus:ring-slate-300 focus:ring-offset-2 sm:w-auto"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}