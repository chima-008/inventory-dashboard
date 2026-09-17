import Link from 'next/link';
import { redirect } from 'next/navigation';
import { apiFetch } from '@/lib/api';
import type { Category } from '@/types/product';
import CategoryForm from './CategoryForm';

type EditCategoryPageProps = {
  params: Promise<{
    id: string;
  }>;
};

async function getCategory(id: string): Promise<Category> {
  const response = await apiFetch(`/categories/${id}`);

  if (response.status === 401) {
    redirect('/login');
  }

  if (response.status === 404) {
    throw new Error('Category not found.');
  }

  if (!response.ok) {
    throw new Error('Failed to fetch category.');
  }

  const result = await response.json();

  return result.data;
}

export default async function EditCategoryPage({
  params,
}: EditCategoryPageProps) {
  const { id } = await params;
  const category = await getCategory(id);

  return (
    <div className="space-y-8">
      {/* Page header */}
      <section>
        <Link
          href="/dashboard/categories"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-950"
        >
          <span aria-hidden="true">←</span>
          Back to categories
        </Link>

        <div className="mt-7">
          <div className="flex flex-wrap items-center gap-3">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
              Inventory
            </p>

            <span className="rounded-md border border-slate-200 bg-slate-50 px-2 py-1 font-mono text-xs text-slate-600">
              {category.slug}
            </span>
          </div>

          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
            Edit Category
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
            Update the information for this product category.
          </p>
        </div>
      </section>

      {/* Category form */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 lg:p-8">
        <CategoryForm category={category} />
      </section>
    </div>
  );
}