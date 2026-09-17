import Link from 'next/link';
import CategoryForm from './CategoryForm';

export default function CreateCategoryPage() {
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
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
            Inventory
          </p>

          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
            Add Category
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
            Add a new category to organize your products.
          </p>
        </div>
      </section>

      {/* Form */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 lg:p-8">
        <CategoryForm />
      </section>
    </div>
  );
}