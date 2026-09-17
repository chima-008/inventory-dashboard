import { redirect } from 'next/navigation';
import { apiFetch } from '@/lib/api';
import type { Category, Product } from '@/types/product';
import Link from 'next/link';
import DeleteProductButton from './DeleteProductButton';
import { getCurrentUser } from '@/lib/auth';

type SearchParams = {
  search?: string;
  category_id?: string;
  stock_status?: string;
};

async function getProducts(
  searchParams: SearchParams
): Promise<Product[]> {
  const params = new URLSearchParams();

  if (searchParams.search) {
    params.set('search', searchParams.search);
  }

  if (searchParams.category_id) {
    params.set('category_id', searchParams.category_id);
  }

  if (searchParams.stock_status) {
    params.set('stock_status', searchParams.stock_status);
  }

  const queryString = params.toString();

  const response = await apiFetch(
    `/products${queryString ? `?${queryString}` : ''}`
  );

  if (response.status === 401) {
    redirect('/login');
  }

  if (!response.ok) {
    throw new Error('Failed to fetch products.');
  }

  const result = await response.json();

  return result.data;
}

async function getCategories(): Promise<Category[]> {
  const response = await apiFetch('/categories');

  if (response.status === 401) {
    redirect('/login');
  }

  if (!response.ok) {
    throw new Error('Failed to fetch categories.');
  }

  const result = await response.json();

  return result.data;
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const user = await getCurrentUser();

  const [products, categories] = await Promise.all([
    getProducts(params),
    getCategories(),
  ]);

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
            Products
          </h1>

          <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">
            Manage products, pricing, stock levels, and availability.
          </p>
        </div>

        <Link
          href="/dashboard/products/create"
          className="inline-flex w-full shrink-0 items-center justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 sm:w-auto"
        >
          <span className="mr-2 text-base leading-none">+</span>
          Add product
        </Link>
      </section>

      {/* Filters */}
      <section className="rounded-xl border border-slate-200 bg-white">
        <div className="border-b border-slate-200 px-5 py-5 sm:px-6">
          <div>
            <h2 className="text-sm font-semibold text-slate-950">
              Filter products
            </h2>

            <p className="mt-1 text-xs leading-5 text-slate-500">
              Search and filter your inventory by product, category, or stock
              condition.
            </p>
          </div>
        </div>

        <form
          method="GET"
          className="space-y-5 p-5 sm:p-6"
        >
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-[minmax(0,2fr)_220px_190px_112px] lg:items-end">
            {/* Search */}
            <div>
              <label
                htmlFor="search"
                className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500"
              >
                Search
              </label>

              <div className="relative">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">
                  ⌕
                </span>

                <input
                  id="search"
                  name="search"
                  type="search"
                  defaultValue={params.search ?? ''}
                  placeholder="Search by name or SKU..."
                  className="h-11 w-full rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </div>

            {/* Category */}
            <div>
              <label
                htmlFor="category_id"
                className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500"
              >
                Category
              </label>

              <select
                id="category_id"
                name="category_id"
                defaultValue={params.category_id ?? ''}
                className="h-11 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
              >
                <option value="">All categories</option>

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

            {/* Stock status */}
            <div>
              <label
                htmlFor="stock_status"
                className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500"
              >
                Stock status
              </label>

              <select
                id="stock_status"
                name="stock_status"
                defaultValue={params.stock_status ?? ''}
                className="h-11 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
              >
                <option value="">All statuses</option>
                <option value="in_stock">In stock</option>
                <option value="low_stock">Low stock</option>
                <option value="out_of_stock">Out of stock</option>
              </select>
            </div>

            {/* Apply */}
            <div className="md:col-span-2 lg:col-span-1">
              <button
                type="submit"
                className="h-11 w-full rounded-lg bg-blue-600 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Apply
              </button>
            </div>
          </div>

          {/* Clear filters */}
          <div>
            <a
              href="/dashboard/products"
              className="inline-flex h-10 items-center justify-center rounded-lg border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-600 shadow-sm transition hover:border-slate-400 hover:bg-slate-50 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Clear filters
            </a>
          </div>
        </form>
      </section>

      {/* Inventory indicators */}
      <section className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white px-5 py-4">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Products displayed
          </p>

          <p className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
            {products.length}
          </p>
        </div>

        <div className="rounded-xl border border-amber-200 bg-amber-50/30 px-5 py-4">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Low stock
          </p>

          <p className="mt-2 text-2xl font-semibold tracking-tight text-amber-700">
            {lowStockCount}
          </p>
        </div>

        <div className="rounded-xl border border-red-200 bg-red-50/30 px-5 py-4">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Out of stock
          </p>

          <p className="mt-2 text-2xl font-semibold tracking-tight text-red-700">
            {outOfStockCount}
          </p>
        </div>
      </section>

      {/* Product table */}
      <section className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <div className="flex flex-col gap-2 border-b border-slate-200 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div>
            <h2 className="text-sm font-semibold text-slate-950">
              Product inventory
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              Products matching your current filters.
            </p>
          </div>

          <span className="w-fit rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
            {products.length}{' '}
            {products.length === 1 ? 'product' : 'products'}
          </span>
        </div>

        {products.length === 0 ? (
          <div className="px-6 py-20 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-lg text-slate-500">
              □
            </div>

            <h3 className="mt-4 text-sm font-semibold text-slate-950">
              No products found
            </h3>

            <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">
              No products match your current search or filters. Try adjusting
              your filters or add a new product.
            </p>

            <Link
              href="/dashboard/products/create"
              className="mt-5 inline-flex rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              Add product
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1080px] text-left text-sm">
              <colgroup>
                <col className="w-[27%]" />
                <col className="w-[14%]" />
                <col className="w-[16%]" />
                <col className="w-[13%]" />
                <col className="w-[10%]" />
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
                    Price
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Stock
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
                {products.map((product) => {
                  const isOutOfStock =
                    product.stock_status === 'out_of_stock';

                  const isLowStock =
                    product.stock_status === 'low_stock';

                  return (
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

                          <div className="min-w-0">
                            <p className="truncate font-semibold text-slate-950">
                              {product.name}
                            </p>

                            {product.description && (
                              <p className="mt-1 max-w-sm truncate text-xs text-slate-500">
                                {product.description}
                              </p>
                            )}
                          </div>
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
                        <p className="max-w-[180px] truncate text-slate-600">
                          {product.category.name}
                        </p>
                      </td>

                      {/* Price */}
                      <td className="whitespace-nowrap px-6 py-5 font-semibold text-slate-950">
                        ₦
                        {Number(product.price).toLocaleString(
                          'en-NG',
                          {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          }
                        )}
                      </td>

                      {/* Stock */}
                      <td className="whitespace-nowrap px-6 py-5">
                        <span
                          className={`font-semibold ${
                            isOutOfStock
                              ? 'text-red-600'
                              : isLowStock
                                ? 'text-amber-600'
                                : 'text-slate-700'
                          }`}
                        >
                          {product.stock_quantity}
                        </span>

                        <span className="ml-1 text-xs text-slate-400">
                          units
                        </span>
                      </td>

                      {/* Status */}
                      <td className="whitespace-nowrap px-6 py-5">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
                            isOutOfStock
                              ? 'bg-red-50 text-red-700'
                              : isLowStock
                                ? 'bg-amber-50 text-amber-700'
                                : 'bg-emerald-50 text-emerald-700'
                          }`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${
                              isOutOfStock
                                ? 'bg-red-500'
                                : isLowStock
                                  ? 'bg-amber-500'
                                  : 'bg-emerald-500'
                            }`}
                          />

                          {isOutOfStock
                            ? 'Out of stock'
                            : isLowStock
                              ? 'Low stock'
                              : 'In stock'}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="whitespace-nowrap px-6 py-5">
                        <div className="flex items-center justify-end gap-1">
                          <Link
                            href={`/dashboard/products/${product.id}/edit`}
                            className="rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-slate-950"
                          >
                            Edit
                          </Link>

                          {user.role === 'admin' && (
                            <DeleteProductButton
                              productId={product.id}
                              productName={product.name}
                            />
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}