import Link from 'next/link';
import LogoutButton from '../components/LogoutButton';
import SidebarNavigation from './SideBarNavigation';
import { getCurrentUser } from '@/lib/auth';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  const displayName = user?.name ?? user?.email ?? 'User';
  const initial = displayName.charAt(0).toUpperCase();
  const isAdmin = user?.role === 'admin';

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-slate-800 bg-slate-900 text-white">
        <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Brand */}
          <Link
            href="/dashboard"
            className="flex items-center gap-3"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-sm font-bold text-white shadow-sm">
              I
            </div>

            <div className="hidden sm:block">
              <p className="text-sm font-semibold leading-none tracking-tight text-white">
                Inventory
              </p>

              <p className="mt-1 text-xs text-slate-400">
                Management
              </p>
            </div>
          </Link>

          {/* User */}
          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-semibold text-white">
                {displayName}
              </p>

              <p className="mt-0.5 text-xs capitalize text-slate-400">
                {user?.role ?? 'User'}
              </p>
            </div>

            <div className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-700 bg-slate-800 text-sm font-semibold text-blue-400">
              {initial}
            </div>

            <div className="ml-1 border-l border-slate-700 pl-3">
              <LogoutButton />
            </div>
          </div>
        </div>
      </header>

      <div className="flex min-h-[calc(100vh-4rem)]">
        {/* Sidebar */}
        <aside className="hidden w-64 shrink-0 bg-slate-900 lg:block">
          <div className="flex h-full flex-col">
            <SidebarNavigation isAdmin={isAdmin} />

            {/* Sidebar information */}
            <div className="mt-auto border-t border-slate-800 p-4">
              <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600/10 text-sm font-semibold text-blue-400">
                  I
                </div>

                <p className="mt-4 text-xs font-semibold text-slate-200">
                  Inventory management
                </p>

                <p className="mt-1.5 text-xs leading-5 text-slate-500">
                  Manage products, categories, and stock from one place.
                </p>
              </div>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <main className="min-w-0 flex-1">
          <div className="mx-auto w-full max-w-[1400px] px-4 py-7 sm:px-6 lg:px-8 lg:py-9">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile navigation */}
      <div className="border-t border-slate-800 bg-slate-900 lg:hidden">
        <SidebarNavigation
          mobile
          isAdmin={isAdmin}
        />
      </div>
    </div>
  );
}