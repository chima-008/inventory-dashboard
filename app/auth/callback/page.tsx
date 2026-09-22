import { Suspense } from 'react';
import GoogleCallbackContent from './GoogleCallbackContent';

export default function GoogleCallbackPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
          <div className="text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-blue-600" />

            <p className="mt-4 text-sm font-medium text-slate-600">
              Completing Google sign in...
            </p>
          </div>
        </main>
      }
    >
      <GoogleCallbackContent />
    </Suspense>
  );
}