'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navigation = [
  {
    href: '/dashboard',
    label: 'Overview',
    icon: '▦',
  },
  {
    href: '/dashboard/products',
    label: 'Products',
    icon: '□',
  },
  {
    href: '/dashboard/categories',
    label: 'Categories',
    icon: '◇',
  },
  {
    href: '/dashboard/stock',
    label: 'Stock',
    icon: '↕',
  },
];

const administrationNavigation = [
  {
    href: '/dashboard/users',
    label: 'Users',
    icon: '○',
  },
];

export default function SideBarNavigation({
  mobile = false,
  isAdmin = false,
}: {
  mobile?: boolean;
  isAdmin?: boolean;
}) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === '/dashboard';
    }

    return pathname.startsWith(href);
  };

  const items = isAdmin
    ? [...navigation, ...administrationNavigation]
    : navigation;

  if (mobile) {
    return (
      <nav
        className={`grid ${
          isAdmin ? 'grid-cols-5' : 'grid-cols-4'
        }`}
      >
        {items.map((item) => {
          const active = isActive(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex min-w-0 flex-col items-center gap-1 px-1 py-3 text-xs font-medium transition ${
                active
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <span className="text-base">
                {item.icon}
              </span>

              <span className="truncate">
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>
    );
  }

  return (
    <div className="px-4 py-7">
      <p className="px-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">
        Workspace
      </p>

      <nav className="mt-4 space-y-1">
        {navigation.map((item) => {
          const active = isActive(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`group flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition ${
                active
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <span
                className={`flex h-5 w-5 items-center justify-center text-base ${
                  active
                    ? 'text-white'
                    : 'text-slate-500 group-hover:text-slate-300'
                }`}
              >
                {item.icon}
              </span>

              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {isAdmin && (
        <>
          <p className="mt-8 px-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">
            Administration
          </p>

          <nav className="mt-4 space-y-1">
            {administrationNavigation.map((item) => {
              const active = isActive(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`group flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition ${
                    active
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <span
                    className={`flex h-5 w-5 items-center justify-center text-base ${
                      active
                        ? 'text-white'
                        : 'text-slate-500 group-hover:text-slate-300'
                    }`}
                  >
                    {item.icon}
                  </span>

                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </>
      )}
    </div>
  );
}