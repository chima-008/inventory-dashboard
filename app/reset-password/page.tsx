import { Suspense } from 'react';
import ResetPasswordContent from './ResetPasswordContent';

function ResetPasswordLoading() {
  return (
    <main className="min-h-screen bg-slate-50 px-6 py-12">
      <div className="mx-auto flex min-h-[80vh] w-full max-w-md items-center justify-center">
        <div className="w-full">
          <div className="mb-8 text-center">
            <div className="inline-flex items-center gap-2 text-xl font-bold text-slate-950">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-sm font-bold text-white">
                ID
              </span>
              Inventory Dashboard
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
            <div className="mx-auto h-6 w-6 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />

            <p className="mt-4 text-sm text-slate-500">
              Loading password reset...
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<ResetPasswordLoading />}>
      <ResetPasswordContent />
    </Suspense>
  );
}