import { redirect } from 'next/navigation';
import { apiFetch } from '@/lib/api';
import type { Product } from '@/types/product';
import Link from 'next/link';

async function getProducts(): Promise<Product[]> {
  const response = await apiFetch('/products');

  if (response.status === 401) {
    redirect('/login');
  }

  if (!response.ok) {
    throw new Error('Failed to fetch products.');
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

function getStockIndicatorClasses(status: Product['stock_status']) {
  switch (status) {
    case 'in_stock':
      return 'bg-emerald-500';
    case 'low_stock':
      return 'bg-amber-500';
    case 'out_of_stock':
      return 'bg-red-500';
  }
}

function getStockQuantityClasses(status: Product['stock_status']) {
  switch (status) {
    case 'in_stock':
      return 'text-slate-950';
    case 'low_stock':
      return 'text-amber-600';
    case 'out_of_stock':
      return 'text-red-600';
  }
}

export default async function StockPage() {
  const products = await getProducts();

  const inStockCount = products.filter(
    (product) => product.stock_status === 'in_stock'
  ).length;

  const lowStockCount = products.filter(
    (product) => product.stock_status === 'low_stock'
  ).length;

  const outOfStockCount = products.filter(
    (product) => product.stock_status === 'out_of_stock'
  ).length;

  return (
    <div className="space-y-9">
      {/* Page header */}
      <section className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.12em] text-slate-400">
            Inventory
          </p>

          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
            Stock
          </h1>

          <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">
            Monitor inventory levels and manage stock movements.
          </p>
        </div>

        <Link
          href="/dashboard/products"
          className="inline-flex w-full shrink-0 items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-400 hover:bg-slate-50 hover:text-slate-950 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:w-auto"
        >
          View products
        </Link>
      </section>

      {/* Stock indicators */}
      <section className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white px-5 py-4">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Products monitored
          </p>

          <p className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
            {products.length}
          </p>

          <p className="mt-1 text-xs text-slate-500">
            Total products with stock data
          </p>
        </div>

        <div className="rounded-xl border border-emerald-200 bg-emerald-50/30 px-5 py-4">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            In stock
          </p>

          <p className="mt-2 text-2xl font-semibold tracking-tight text-emerald-700">
            {inStockCount}
          </p>

          <p className="mt-1 text-xs text-slate-500">
            Healthy inventory levels
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-xl border border-amber-200 bg-amber-50/30 px-4 py-4">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Low stock
            </p>

            <p className="mt-2 text-2xl font-semibold tracking-tight text-amber-700">
              {lowStockCount}
            </p>
          </div>

          <div className="rounded-xl border border-red-200 bg-red-50/30 px-4 py-4">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Out
            </p>

            <p className="mt-2 text-2xl font-semibold tracking-tight text-red-700">
              {outOfStockCount}
            </p>
          </div>
        </div>
      </section>

      {/* Stock overview */}
      <section className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <div className="flex flex-col gap-2 border-b border-slate-200 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div>
            <h2 className="text-sm font-semibold text-slate-950">
              Stock overview
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              Monitor current stock levels across your products.
            </p>
          </div>

          <span className="w-fit rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
            {products.length}{' '}
            {products.length === 1 ? 'product' : 'products'}
          </span>
        </div>

        {/* Empty state */}
        {products.length === 0 ? (
          <div className="px-6 py-20 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-lg text-slate-500">
              ↕
            </div>

            <h3 className="mt-4 text-sm font-semibold text-slate-950">
              No products found
            </h3>

            <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">
              Add products to your inventory before managing stock levels.
            </p>

            <Link
              href="/dashboard/products/create"
              className="mt-5 inline-flex rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Add product
            </Link>
          </div>
        ) : (
          /* Stock table */
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1000px] text-left text-sm">
              <colgroup>
                <col className="w-[25%]" />
                <col className="w-[15%]" />
                <col className="w-[18%]" />
                <col className="w-[11%]" />
                <col className="w-[11%]" />
                <col className="w-[12%]" />
                <col className="w-[8%]" />
              </colgroup>

              <thead className="border-b border-slate-200 bg-slate-50">
                <tr>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Product
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    SKU
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Category
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Stock
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Threshold
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Status
                  </th>

                  <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {products.map((product) => (
                  <tr
                    key={product.id}
                    className="group transition hover:bg-slate-50/70"
                  >
                    {/* Product */}
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-xs font-semibold text-slate-500">
                          {product.name.charAt(0).toUpperCase()}
                        </div>

                        <p className="min-w-0 truncate font-semibold text-slate-950">
                          {product.name}
                        </p>
                      </div>
                    </td>

                    {/* SKU */}
                    <td className="whitespace-nowrap px-6 py-5">
                      <span className="rounded-md bg-slate-100 px-2 py-1 font-mono text-xs text-slate-600">
                        {product.sku}
                      </span>
                    </td>

                    {/* Category */}
                    <td className="px-6 py-5">
                      <p className="max-w-[190px] truncate text-slate-600">
                        {product.category.name}
                      </p>
                    </td>

                    {/* Stock */}
                    <td className="whitespace-nowrap px-6 py-5">
                      <span
                        className={`font-semibold ${getStockQuantityClasses(
                          product.stock_status
                        )}`}
                      >
                        {product.stock_quantity}
                      </span>

                     <span className="ml-1 text-xs text-slate-400">
                        {product.stock_quantity === 1 ? 'unit' : 'units'}
                      </span>
                    </td>

                    {/* Threshold */}
                    <td className="whitespace-nowrap px-6 py-5 text-slate-600">
                      {product.low_stock_threshold}
                     <span className="ml-1 text-xs text-slate-400">
                        {product.low_stock_threshold === 1 ? 'unit' : 'units'}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="whitespace-nowrap px-6 py-5">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${getStockStatusClasses(
                          product.stock_status
                        )}`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${getStockIndicatorClasses(
                            product.stock_status
                          )}`}
                        />

                        {getStockStatusLabel(product.stock_status)}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="whitespace-nowrap px-6 py-5">
                      <div className="flex justify-end">
                        <Link
                          href={`/dashboard/stock/${product.id}`}
                          className="rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-slate-950 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        >
                          Manage
                        </Link>
                      </div>
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