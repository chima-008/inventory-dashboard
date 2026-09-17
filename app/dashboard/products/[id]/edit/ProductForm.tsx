'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Category, Product } from '@/types/product';

type ProductFormProps = {
  product: Product;
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

export default function ProductForm({
  product,
  categories,
}: ProductFormProps) {
  const router = useRouter();

  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const [price, setPrice] = useState(
    formatPrice(product.price)
  );

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

  async function handleSubmit(formData: FormData) {
    setSubmitting(true);
    setError('');

    const payload = {
      name: formData.get('name'),
      slug: product.slug,
      sku: formData.get('sku'),
      category_id: Number(formData.get('category_id')),
      price: getCleanPrice(String(formData.get('price') ?? '')),
      description: formData.get('description') || null,
      low_stock_threshold: Number(
        formData.get('low_stock_threshold')
      ),
      is_active: formData.get('is_active') === 'on',
    };

    try {
      const response = await fetch(
        `/api/products/${product.id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
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
            data.message || 'Failed to update product.'
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

      <div className="grid gap-x-6 gap-y-7 md:grid-cols-2">
        {/* Product name */}
        <div className="md:col-span-2">
          <label
            htmlFor="name"
            className="block text-sm font-semibold text-slate-900"
          >
            Product name
          </label>

          <p className="mt-1 text-xs text-slate-500">
            Update the name used to identify this product.
          </p>

          <input
            id="name"
            name="name"
            type="text"
            defaultValue={product.name}
            required
            className="mt-3 w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
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
            The unique identifier for this product.
          </p>

          <input
            id="sku"
            name="sku"
            type="text"
            defaultValue={product.sku}
            required
            className="mt-3 w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
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
            Change the category assigned to this product.
          </p>

          <select
            id="category_id"
            name="category_id"
            defaultValue={product.category_id}
            required
            className="mt-3 w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          >
            {categories.map((category) => (
              <option
                key={category.id}
                value={category.id}
              >
                {category.name}
              </option>
            ))}
          </select>
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
            Update the selling price for one unit.
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
              required
              className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-8 pr-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              placeholder="0.00"
            />
          </div>
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
            defaultValue={product.low_stock_threshold}
            required
            className="mt-3 w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        {/* Description */}
        <div className="md:col-span-2">
          <label
            htmlFor="description"
            className="block text-sm font-semibold text-slate-900"
          >
            Description
          </label>

          <p className="mt-1 text-xs text-slate-500">
            Update any useful information about this product.
          </p>

          <textarea
            id="description"
            name="description"
            rows={5}
            defaultValue={product.description ?? ''}
            className="mt-3 w-full resize-y rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm leading-6 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        {/* Active status */}
        <div className="md:col-span-2">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <label className="flex cursor-pointer items-start gap-3">
              <input
                name="is_active"
                type="checkbox"
                defaultChecked={product.is_active}
                className="mt-0.5 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-0"
              />

              <span>
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
            router.push('/dashboard/products')
          }
          className="rounded-lg border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 hover:text-slate-950 focus:outline-none focus:ring-2 focus:ring-slate-300 focus:ring-offset-2"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}