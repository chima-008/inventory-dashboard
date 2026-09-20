import Link from 'next/link';

export default function EmailVerifiedPage() {
  return (
    <main className="min-h-screen bg-slate-50 px-6 py-12">
      <div className="flex min-h-[80vh] items-center justify-center">
        <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-2xl text-emerald-600">
            ✓
          </div>

          <h1 className="mt-6 text-2xl font-bold text-slate-950">
            Email verified
          </h1>

          <p className="mt-3 text-sm leading-6 text-slate-500">
            Your email address has been verified successfully.
          </p>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            Your account is now ready. Sign in to access your inventory
            dashboard.
          </p>

          <Link
            href="/login"
            className="mt-6 inline-flex w-full items-center justify-center rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            Continue to login
          </Link>
        </div>
      </div>
    </main>
  );
}