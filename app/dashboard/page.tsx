import { redirect } from 'next/navigation';
import Link from 'next/link';
import { apiFetch } from '@/lib/api';

type DashboardSummary = {
  inventory_value?: number | string | null;
  total_products?: number | string | null;
  total_categories?: number | string | null;
  total_stock_units?: number | string | null;
  low_stock_count?: number | string | null;
  out_of_stock_count?: number | string | null;
};

async function getSummary(): Promise<DashboardSummary> {
  const response = await apiFetch('/dashboard/summary');

  if (response.status === 401) {
    redirect('/login');
  }

  if (!response.ok) {
    throw new Error('Failed to fetch dashboard summary.');
  }

  const result = await response.json();

  return result.data ?? {};
}

function toNumber(value: number | string | null | undefined): number {
  const number = Number(value);

  return Number.isFinite(number) ? number : 0;
}

function formatNumber(value: number) {
  return value.toLocaleString('en-NG');
}

function formatInventoryValue(value: number) {
  return value.toLocaleString('en-NG', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export default async function DashboardPage() {
  const summary = await getSummary();

  const inventoryValue = toNumber(summary.inventory_value);
  const totalProducts = toNumber(summary.total_products);
  const totalCategories = toNumber(summary.total_categories);
  const totalStockUnits = toNumber(summary.total_stock_units);
  const lowStockCount = toNumber(summary.low_stock_count);
  const outOfStockCount = toNumber(summary.out_of_stock_count);

  const healthyProducts = Math.max(
    totalProducts - lowStockCount - outOfStockCount,
    0
  );

  const stockHealth =
    totalProducts > 0
      ? Math.round((healthyProducts / totalProducts) * 100)
      : 0;

  const healthyPercentage =
    totalProducts > 0
      ? (healthyProducts / totalProducts) * 100
      : 0;

  const lowStockPercentage =
    totalProducts > 0
      ? (lowStockCount / totalProducts) * 100
      : 0;

  const outOfStockPercentage =
    totalProducts > 0
      ? (outOfStockCount / totalProducts) * 100
      : 0;

  const healthColor =
    stockHealth >= 70
      ? '#10b981'
      : stockHealth >= 30
        ? '#f59e0b'
        : '#ef4444';

  const healthValueClass =
    stockHealth >= 70
      ? 'text-emerald-700'
      : stockHealth >= 30
        ? 'text-amber-700'
        : 'text-red-700';

  return (
    <div className="space-y-9">
      {/* Page header */}
      <section className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.12em] text-slate-400">
            Dashboard
          </p>

          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
            Overview
          </h1>

          <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">
            Monitor inventory performance, stock levels, and products that
            need attention.
          </p>
        </div>

        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center sm:gap-3">
          <Link
            href="/dashboard/products"
            className="inline-flex w-full items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:border-slate-400 hover:bg-slate-50 hover:text-slate-950 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:w-auto"
          >
            View products
          </Link>

          <Link
            href="/dashboard/products/create"
            className="inline-flex w-full items-center justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:w-auto"
          >
            <span className="mr-2 text-base leading-none">+</span>
            Add product
          </Link>
        </div>
      </section>

      {/* Key metrics */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <div className="rounded-xl border border-slate-200 bg-white p-5 sm:p-6 xl:col-span-2">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Total inventory value
          </p>

          <div className="mt-4 flex min-w-0 items-baseline gap-2">
            <span className="shrink-0 text-2xl font-semibold text-slate-950">
              ₦
            </span>

            <p
              className="min-w-0 truncate text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl"
              title={`₦${formatInventoryValue(inventoryValue)}`}
            >
              {formatInventoryValue(inventoryValue)}
            </p>
          </div>

          <p className="mt-3 text-xs text-slate-400">
            Value of current active stock
          </p>
        </div>

        <Link
          href="/dashboard/products"
          className="rounded-xl border border-slate-200 bg-white p-5 transition hover:border-slate-300 hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:p-6"
        >
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Products
          </p>

          <p className="mt-4 text-2xl font-semibold tracking-tight text-slate-950">
            {formatNumber(totalProducts)}
          </p>

          <p className="mt-2 text-xs text-slate-400">
            Active products
          </p>
        </Link>

        <Link
          href="/dashboard/stock"
          className="rounded-xl border border-slate-200 bg-white p-5 transition hover:border-slate-300 hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:p-6"
        >
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Stock units
          </p>

          <p className="mt-4 text-2xl font-semibold tracking-tight text-slate-950">
            {formatNumber(totalStockUnits)}
          </p>

          <p className="mt-2 text-xs text-slate-400">
            Available units
          </p>
        </Link>

        <Link
          href="/dashboard/categories"
          className="rounded-xl border border-slate-200 bg-white p-5 transition hover:border-slate-300 hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:p-6"
        >
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Categories
          </p>

          <p className="mt-4 text-2xl font-semibold tracking-tight text-slate-950">
            {formatNumber(totalCategories)}
          </p>

          <p className="mt-2 text-xs text-slate-400">
            Product categories
          </p>
        </Link>
      </section>

      {/* Main dashboard */}
      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.6fr)_minmax(320px,0.8fr)]">
        {/* Inventory health */}
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
          <div className="flex flex-col gap-3 border-b border-slate-200 px-5 py-5 sm:flex-row sm:items-start sm:justify-between sm:px-6">
            <div>
              <h2 className="text-base font-semibold text-slate-950">
                Inventory health
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Current stock conditions across your products.
              </p>
            </div>

            <Link
              href="/dashboard/stock"
              className="text-sm font-semibold text-blue-600 transition hover:text-blue-700"
            >
              Manage stock
            </Link>
          </div>

          <div className="p-5 sm:p-6">
            {totalProducts === 0 ? (
              <div className="py-8 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-lg text-slate-500">
                  ↕
                </div>

                <h3 className="mt-4 text-sm font-semibold text-slate-950">
                  No inventory to assess
                </h3>

                <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">
                  Add your first product to start monitoring inventory health.
                </p>

                <Link
                  href="/dashboard/products/create"
                  className="mt-5 inline-flex rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Add product
                </Link>
              </div>
            ) : (
              <div className="flex flex-col gap-7 md:flex-row md:items-center md:gap-10">
                {/* Health ring + summary */}
                <div className="flex items-center gap-5 md:w-56 md:shrink-0">
                  <div
                    className="relative flex h-32 w-32 shrink-0 items-center justify-center rounded-full"
                    style={{
                      background: `conic-gradient(${healthColor} ${stockHealth}%, #e2e8f0 ${stockHealth}% 100%)`,
                    }}
                  >
                    <div className="flex h-24 w-24 items-center justify-center rounded-full bg-white">
                      <div className="text-center">
                        <p
                          className={`text-xl font-semibold ${healthValueClass}`}
                        >
                          {stockHealth}%
                        </p>

                        <p className="mt-0.5 text-[10px] font-medium uppercase tracking-wide text-slate-400">
                          healthy
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="md:hidden">
                    <p className="text-sm font-semibold text-slate-900">
                      {healthyProducts} of {totalProducts} healthy
                    </p>

                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      Products above their low-stock threshold.
                    </p>
                  </div>
                </div>

                {/* Desktop information beside the circle */}
                <div className="min-w-0 flex-1">
                  <div className="hidden md:block">
                    <p className="text-sm font-semibold text-slate-900">
                      {healthyProducts} of {totalProducts} products are healthy
                    </p>

                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      Products with stock above their configured low-stock
                      threshold.
                    </p>
                  </div>

                  <div className="mt-6 space-y-5">
                    {/* Healthy */}
                    <div>
                      <div className="mb-2 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="h-2 w-2 rounded-full bg-emerald-500" />

                          <span className="text-xs font-medium text-slate-600">
                            Healthy
                          </span>
                        </div>

                        <span className="text-xs font-semibold text-slate-900">
                          {healthyProducts}
                        </span>
                      </div>

                      <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                        <div
                          className="h-full rounded-full bg-emerald-500"
                          style={{
                            width: `${healthyPercentage}%`,
                          }}
                        />
                      </div>
                    </div>

                    {/* Low stock */}
                    <div>
                      <div className="mb-2 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="h-2 w-2 rounded-full bg-amber-500" />

                          <span className="text-xs font-medium text-slate-600">
                            Low stock
                          </span>
                        </div>

                        <span className="text-xs font-semibold text-slate-900">
                          {lowStockCount}
                        </span>
                      </div>

                      <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                        <div
                          className="h-full rounded-full bg-amber-500"
                          style={{
                            width: `${lowStockPercentage}%`,
                          }}
                        />
                      </div>
                    </div>

                    {/* Out of stock */}
                    <div>
                      <div className="mb-2 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="h-2 w-2 rounded-full bg-red-500" />

                          <span className="text-xs font-medium text-slate-600">
                            Out of stock
                          </span>
                        </div>

                        <span className="text-xs font-semibold text-slate-900">
                          {outOfStockCount}
                        </span>
                      </div>

                      <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                        <div
                          className="h-full rounded-full bg-red-500"
                          style={{
                            width: `${outOfStockPercentage}%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Attention required */}
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
          <div className="border-b border-slate-200 px-5 py-5 sm:px-6">
            <h2 className="text-base font-semibold text-slate-950">
              Attention required
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Inventory conditions that may need action.
            </p>
          </div>

          <div className="space-y-3 p-5 sm:p-6">
            <Link
              href="/dashboard/products?stock_status=low_stock"
              className="flex items-center justify-between rounded-lg border border-amber-200 bg-amber-50/40 p-4 transition hover:bg-amber-50 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
            >
              <div>
                <p className="text-sm font-semibold text-slate-900">
                  Low stock
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  Products nearing their threshold.
                </p>
              </div>

              <span className="text-xl font-semibold text-amber-700">
                {formatNumber(lowStockCount)}
              </span>
            </Link>

            <Link
              href="/dashboard/products?stock_status=out_of_stock"
              className="flex items-center justify-between rounded-lg border border-red-200 bg-red-50/40 p-4 transition hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
              <div>
                <p className="text-sm font-semibold text-slate-900">
                  Out of stock
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  Products with zero available units.
                </p>
              </div>

              <span className="text-xl font-semibold text-red-700">
                {formatNumber(outOfStockCount)}
              </span>
            </Link>

            <Link
              href="/dashboard/products"
              className="flex items-center justify-center rounded-lg border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 hover:text-slate-950 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Review inventory
            </Link>
          </div>
        </div>
      </section>

      {/* Inventory summary */}
      <section>
        <div className="mb-4">
          <h2 className="text-base font-semibold text-slate-950">
            Inventory summary
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            A snapshot of your current inventory structure.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Link
            href="/dashboard/products"
            className="rounded-xl border border-slate-200 bg-white p-6 transition hover:border-slate-300 hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <p className="text-sm font-medium text-slate-500">
              Active products
            </p>

            <p className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
              {formatNumber(totalProducts)}
            </p>

            <p className="mt-2 text-xs text-slate-400">
              Products currently being tracked.
            </p>
          </Link>

          <Link
            href="/dashboard/stock"
            className="rounded-xl border border-slate-200 bg-white p-6 transition hover:border-slate-300 hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <p className="text-sm font-medium text-slate-500">
              Available units
            </p>

            <p className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
              {formatNumber(totalStockUnits)}
            </p>

            <p className="mt-2 text-xs text-slate-400">
              Total quantity across active products.
            </p>
          </Link>

          <Link
            href="/dashboard/categories"
            className="rounded-xl border border-slate-200 bg-white p-6 transition hover:border-slate-300 hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <p className="text-sm font-medium text-slate-500">
              Categories
            </p>

            <p className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
              {formatNumber(totalCategories)}
            </p>

            <p className="mt-2 text-xs text-slate-400">
              Categories used to organize inventory.
            </p>
          </Link>
        </div>
      </section>

      {/* Quick actions */}
      <section className="pb-4">
        <div className="mb-4">
          <h2 className="text-base font-semibold text-slate-950">
            Quick actions
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Frequently used inventory operations.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          <Link
            href="/dashboard/products/create"
            className="group rounded-xl border border-slate-200 bg-white p-5 transition hover:border-blue-200 hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <p className="text-sm font-semibold text-slate-900">
              Add product
            </p>

            <p className="mt-1 text-xs leading-5 text-slate-500">
              Create a new inventory item.
            </p>

            <p className="mt-4 text-sm font-semibold text-blue-600 transition group-hover:text-blue-700">
              Get started →
            </p>
          </Link>

          <Link
            href="/dashboard/categories/create"
            className="group rounded-xl border border-slate-200 bg-white p-5 transition hover:border-blue-200 hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <p className="text-sm font-semibold text-slate-900">
              Add category
            </p>

            <p className="mt-1 text-xs leading-5 text-slate-500">
              Create a category for your products.
            </p>

            <p className="mt-4 text-sm font-semibold text-blue-600 transition group-hover:text-blue-700">
              Create category →
            </p>
          </Link>

          <Link
            href="/dashboard/stock"
            className="group rounded-xl border border-slate-200 bg-white p-5 transition hover:border-blue-200 hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <p className="text-sm font-semibold text-slate-900">
              Adjust stock
            </p>

            <p className="mt-1 text-xs leading-5 text-slate-500">
              Record an inventory stock movement.
            </p>

            <p className="mt-4 text-sm font-semibold text-blue-600 transition group-hover:text-blue-700">
              Manage stock →
            </p>
          </Link>
        </div>
      </section>
    </div>
  );
}