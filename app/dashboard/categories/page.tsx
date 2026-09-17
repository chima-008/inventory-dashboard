import { redirect } from 'next/navigation';
import { apiFetch } from '@/lib/api';
import type { Category } from '@/types/product';
import Link from 'next/link';
import DeleteCategoryButton from './DeleteCategoryButton';
import { getCurrentUser } from '@/lib/auth';

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

export default async function CategoriesPage() {
  const categories = await getCategories();
  const user = await getCurrentUser();

  return (
    <div className="space-y-9">
      {/* Page header */}
      <section className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.12em] text-slate-400">
            Inventory
          </p>

          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
            Categories
          </h1>

          <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">
            Manage the categories used to organize your products.
          </p>
        </div>

        <Link
          href="/dashboard/categories/create"
          className="inline-flex w-full shrink-0 items-center justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:w-auto"
        >
          <span className="mr-2 text-base leading-none">+</span>
          Add category
        </Link>
      </section>

      {/* Category list */}
      <section className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <div className="flex flex-col gap-2 border-b border-slate-200 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div>
            <h2 className="text-sm font-semibold text-slate-950">
              Product categories
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              {categories.length}{' '}
              {categories.length === 1 ? 'category' : 'categories'} available
            </p>
          </div>

          <span className="w-fit rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
            {categories.length}{' '}
            {categories.length === 1 ? 'category' : 'categories'}
          </span>
        </div>

        {/* Empty state */}
        {categories.length === 0 ? (
          <div className="px-6 py-20 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-lg text-slate-500">
              ◇
            </div>

            <h3 className="mt-4 text-sm font-semibold text-slate-950">
              No categories found
            </h3>

            <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">
              Create your first category to start organizing your products.
            </p>

            <Link
              href="/dashboard/categories/create"
              className="mt-5 inline-flex rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Add category
            </Link>
          </div>
        ) : (
          /* Category table */
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-left text-sm">
              <colgroup>
                <col className="w-[25%]" />
                <col className="w-[20%]" />
                <col className="w-[38%]" />
                <col className="w-[17%]" />
              </colgroup>

              <thead className="border-b border-slate-200 bg-slate-50">
                <tr>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Name
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Slug
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Description
                  </th>

                  <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {categories.map((category) => (
                  <tr
                    key={category.id}
                    className="group transition hover:bg-slate-50/70"
                  >
                    {/* Name */}
                    <td className="px-6 py-5">
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-sm font-semibold text-blue-600">
                          {category.name.charAt(0).toUpperCase()}
                        </div>

                        <span className="min-w-0 truncate font-semibold text-slate-950">
                          {category.name}
                        </span>
                      </div>
                    </td>

                    {/* Slug */}
                    <td className="whitespace-nowrap px-6 py-5">
                      <span className="inline-flex max-w-full rounded-md bg-slate-100 px-2 py-1 font-mono text-xs text-slate-600">
                        {category.slug}
                      </span>
                    </td>

                    {/* Description */}
                    <td className="px-6 py-5">
                      <p className="max-w-[420px] truncate text-slate-600">
                        {category.description || '—'}
                      </p>
                    </td>

                    {/* Actions */}
                    <td className="whitespace-nowrap px-6 py-5">
                      <div className="flex items-center justify-end gap-1">
                        <Link
                          href={`/dashboard/categories/${category.id}/edit`}
                          className="rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-slate-950 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        >
                          Edit
                        </Link>

                        {user.role === 'admin' && (
                          <DeleteCategoryButton
                            categoryId={category.id}
                            categoryName={category.name}
                          />
                        )}
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