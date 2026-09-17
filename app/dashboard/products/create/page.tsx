import Link from 'next/link';
import { redirect } from 'next/navigation';
import { apiFetch } from '@/lib/api';
import type { Category } from '@/types/product';
import ProductForm from './ProductForm';

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

export default async function CreateProductPage() {
  const categories = await getCategories();

  return (
    <div className="space-y-8">
      {/* Page header */}
      <section>
        <Link
          href="/dashboard/products"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-950"
        >
          <span aria-hidden="true">←</span>
          Back to products
        </Link>

        <div className="mt-7">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
            Inventory
          </p>

          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
            Add Product
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
            Add a new product to your inventory.
          </p>
        </div>
      </section>

      {/* Product form */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 lg:p-8">
        <ProductForm categories={categories} />
      </section>
    </div>
  );
}