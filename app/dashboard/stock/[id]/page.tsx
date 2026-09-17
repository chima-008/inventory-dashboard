import Link from 'next/link';
import { redirect } from 'next/navigation';
import { apiFetch } from '@/lib/api';
import type { Product } from '@/types/product';
import StockMovementForm from './StockMovementForm';

type StockMovement = {
  id: number;
  type: 'in' | 'out';
  quantity: number;
  reason: string;
  notes: string | null;
  created_at: string;
  user: {
    id: number;
    name: string;
  };
};

type StockPageProps = {
  params: Promise<{
    id: string;
  }>;
};

async function getProduct(id: string): Promise<Product> {
  const response = await apiFetch(`/products/${id}`);

  if (response.status === 401) {
    redirect('/login');
  }

  if (response.status === 404) {
    throw new Error('Product not found.');
  }

  if (!response.ok) {
    throw new Error('Failed to fetch product.');
  }

  const result = await response.json();

  return result.data;
}

async function getMovements(id: string): Promise<StockMovement[]> {
  const response = await apiFetch(`/products/${id}/stock-movements`);

  if (response.status === 401) {
    redirect('/login');
  }

  if (!response.ok) {
    throw new Error('Failed to fetch stock movements.');
  }

  const result = await response.json();

  return result.data;
}

function getStockStatusLabel(status: Product['stock_status']) {
  switch (status) {
    case 'in_stock':
      return 'In stock';
    case 'low_stock':
      return 'Low stock';
    case 'out_of_stock':
      return 'Out of stock';
  }
}

function getStockStatusClasses(status: Product['stock_status']) {
  switch (status) {
    case 'in_stock':
      return 'bg-emerald-50 text-emerald-700';
    case 'low_stock':
      return 'bg-amber-50 text-amber-700';
    case 'out_of_stock':
      return 'bg-red-50 text-red-700';
  }
}

function getStockStatusDotClasses(status: Product['stock_status']) {
  switch (status) {
    case 'in_stock':
      return 'bg-emerald-500';
    case 'low_stock':
      return 'bg-amber-500';
    case 'out_of_stock':
      return 'bg-red-500';
  }
}

export default async function StockProductPage({
  params,
}: StockPageProps) {
  const { id } = await params;

  const [product, movements] = await Promise.all([
    getProduct(id),
    getMovements(id),
  ]);

  return (
    <div className="space-y-9">
      {/* Page header */}
      <section>
        <Link
          href="/dashboard/stock"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-950"
        >
          <span aria-hidden="true">←</span>
          Back to stock
        </Link>

        <div className="mt-6 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-3">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
                Inventory
              </p>

              <span className="rounded-md border border-slate-200 bg-slate-50 px-2 py-1 font-mono text-xs text-slate-600">
                {product.sku}
              </span>
            </div>

            <h1 className="mt-2 truncate text-3xl font-semibold tracking-tight text-slate-950">
              {product.name}
            </h1>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              {product.category.name} · Manage stock levels and review
              inventory history.
            </p>
          </div>

          <Link
            href={`/dashboard/products/${product.id}/edit`}
            className="inline-flex w-full shrink-0 items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-400 hover:bg-slate-50 hover:text-slate-950 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:w-auto"
          >
            Edit product
          </Link>
        </div>
      </section>

      {/* Inventory summary */}
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white px-5 py-5">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Current stock
          </p>

          <div className="mt-3 flex items-baseline gap-2">
            <p
              className={`text-3xl font-semibold tracking-tight ${
                product.stock_status === 'out_of_stock'
                  ? 'text-red-600'
                  : product.stock_status === 'low_stock'
                    ? 'text-amber-600'
                    : 'text-slate-950'
              }`}
            >
              {product.stock_quantity}
            </p>

            <span className="text-sm text-slate-500">
              {product.stock_quantity === 1 ? 'unit' : 'units'}
            </span>
          </div>

          <span
            className={`mt-3 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${getStockStatusClasses(
              product.stock_status
            )}`}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${getStockStatusDotClasses(
                product.stock_status
              )}`}
            />

            {getStockStatusLabel(product.stock_status)}
          </span>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white px-5 py-5">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Low-stock threshold
          </p>

          <div className="mt-3 flex items-baseline gap-2">
            <p className="text-3xl font-semibold tracking-tight text-slate-950">
              {product.low_stock_threshold}
            </p>

            <span className="text-sm text-slate-500">
              {product.low_stock_threshold === 1 ? 'unit' : 'units'}
            </span>
          </div>

          <p className="mt-3 text-xs text-slate-500">
            Stock becomes low at or below this level.
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white px-5 py-5">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            SKU
          </p>

          <p className="mt-3 font-mono text-sm font-semibold text-slate-950">
            {product.sku}
          </p>

          <p className="mt-2 text-xs text-slate-500">
            Product identifier
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white px-5 py-5">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Recorded movements
          </p>

          <p className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
            {movements.length}
          </p>

          <p className="mt-2 text-xs text-slate-500">
            {movements.length === 1
              ? 'movement recorded'
              : 'movements recorded'}
          </p>
        </div>
      </section>

      {/* Stock management */}
      <section className="rounded-xl border border-slate-200 bg-white">
        <div className="border-b border-slate-200 px-5 py-5 sm:px-6">
          <h2 className="text-sm font-semibold text-slate-950">
            Manage stock
          </h2>

          <p className="mt-1 text-xs leading-5 text-slate-500">
            Add or remove inventory and record the reason for the adjustment.
          </p>
        </div>

        <div className="p-5 sm:p-6">
          <StockMovementForm productId={product.id} />
        </div>
      </section>

      {/* Movement history */}
      <section className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <div className="border-b border-slate-200 px-5 py-5 sm:px-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-sm font-semibold text-slate-950">
                Stock movement history
              </h2>

              <p className="mt-1 text-xs leading-5 text-slate-500">
                Every inventory adjustment is recorded here.
              </p>
            </div>

            <span className="w-fit rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
              {movements.length}{' '}
              {movements.length === 1 ? 'movement' : 'movements'}
            </span>
          </div>
        </div>

        {movements.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-lg text-slate-500">
              ↕
            </div>

            <h3 className="mt-4 text-sm font-semibold text-slate-950">
              No stock movements yet
            </h3>

            <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">
              Stock adjustments made for this product will appear here.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-left text-sm">
              <colgroup>
                <col className="w-[17%]" />
                <col className="w-[15%]" />
                <col className="w-[28%]" />
                <col className="w-[18%]" />
                <col className="w-[22%]" />
              </colgroup>

              <thead className="border-b border-slate-200 bg-slate-50">
                <tr>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Type
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Quantity
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Reason
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Performed by
                  </th>

                  <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Date
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {movements.map((movement) => (
                  <tr
                    key={movement.id}
                    className="transition hover:bg-slate-50/70"
                  >
                    {/* Type */}
                    <td className="whitespace-nowrap px-6 py-5">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
                          movement.type === 'in'
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-red-50 text-red-700'
                        }`}
                      >
                        <span
                          className={`font-bold ${
                            movement.type === 'in'
                              ? 'text-emerald-600'
                              : 'text-red-600'
                          }`}
                        >
                          {movement.type === 'in' ? '+' : '−'}
                        </span>

                        {movement.type === 'in'
                          ? 'Stock in'
                          : 'Stock out'}
                      </span>
                    </td>

                    {/* Quantity */}
                    <td className="whitespace-nowrap px-6 py-5">
                      <span
                        className={`font-semibold ${
                          movement.type === 'in'
                            ? 'text-emerald-700'
                            : 'text-red-700'
                        }`}
                      >
                        {movement.type === 'in' ? '+' : '−'}
                        {movement.quantity}
                      </span>

                      <span className="ml-1 text-xs text-slate-400">
                        {movement.quantity === 1 ? 'unit' : 'units'}
                      </span>
                    </td>

                    {/* Reason */}
                    <td className="px-6 py-5">
                      <p className="max-w-[300px] truncate text-slate-700">
                        {movement.reason}
                      </p>
                    </td>

                    {/* Performed by */}
                    <td className="whitespace-nowrap px-6 py-5 text-slate-600">
                      {movement.user.name}
                    </td>

                    {/* Date */}
                    <td className="whitespace-nowrap px-6 py-5 text-right text-xs text-slate-500">
                      {new Date(movement.created_at).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}