import { redirect } from 'next/navigation';
import { apiFetch } from '@/lib/api';
import { getCurrentUser } from '@/lib/auth';
import UserRoleEditor from './UserRoleEditor';
import InviteManager from './InviteManager';

type User = {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'manager';
  created_at: string;
};

async function getUsers(): Promise<User[]> {
  const response = await apiFetch('/users');

  if (response.status === 401) {
    redirect('/login');
  }

  if (response.status === 403) {
    redirect('/dashboard');
  }

  if (!response.ok) {
    throw new Error('Failed to fetch users.');
  }

  const result = await response.json();

  return result.data;
}

export default async function UsersPage() {
  const currentUser = await getCurrentUser();

  if (currentUser.role !== 'admin') {
    redirect('/dashboard');
  }

  const users = await getUsers();

  const administratorCount = users.filter(
    (user) => user.role === 'admin'
  ).length;

  const managerCount = users.filter(
    (user) => user.role === 'manager'
  ).length;

  return (
    <div className="space-y-9">
      {/* Page header */}
      <section>
        <p className="text-xs font-medium uppercase tracking-[0.12em] text-slate-400">
          Administration
        </p>

        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
          Users
        </h1>

        <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">
          Manage user access and roles across your inventory system.
        </p>
      </section>

      {/* User summary */}
      <section className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-5 sm:p-6">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Total users
          </p>

          <p className="mt-3 text-2xl font-semibold tracking-tight text-slate-950">
            {users.length}
          </p>

          <p className="mt-1 text-xs text-slate-400">
            Accounts with system access.
          </p>
        </div>

        <div className="rounded-xl border border-blue-200 bg-blue-50/30 p-5 sm:p-6">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Administrators
          </p>

          <p className="mt-3 text-2xl font-semibold tracking-tight text-blue-700">
            {administratorCount}
          </p>

          <p className="mt-1 text-xs text-slate-500">
            Users with administrative access.
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 sm:p-6">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Managers
          </p>

          <p className="mt-3 text-2xl font-semibold tracking-tight text-slate-950">
            {managerCount}
          </p>

          <p className="mt-1 text-xs text-slate-400">
            Users with management access.
          </p>
        </div>
      </section>

      {/* Invite manager */}
      <InviteManager />

      {/* Users table */}
      <section className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <div className="flex flex-col gap-2 border-b border-slate-200 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div>
            <h2 className="text-sm font-semibold text-slate-950">
              User accounts
            </h2>

            <p className="mt-1 text-xs leading-5 text-slate-500">
              Review accounts and manage their assigned roles.
            </p>
          </div>

          <span className="w-fit rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
            {users.length} {users.length === 1 ? 'user' : 'users'}
          </span>
        </div>

        {users.length === 0 ? (
          <div className="px-6 py-20 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-lg text-slate-500">
              ○
            </div>

            <h3 className="mt-4 text-sm font-semibold text-slate-950">
              No users found
            </h3>

            <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">
              There are currently no user accounts to manage.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[950px] text-left text-sm">
              <colgroup>
                <col className="w-[25%]" />
                <col className="w-[25%]" />
                <col className="w-[14%]" />
                <col className="w-[21%]" />
                <col className="w-[15%]" />
              </colgroup>

              <thead className="border-b border-slate-200 bg-slate-50">
                <tr>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    User
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Email
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Role
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Access
                  </th>

                  <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Joined
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {users.map((user) => (
                  <tr
                    key={user.id}
                    className="group transition hover:bg-slate-50/70"
                  >
                    {/* User */}
                    <td className="px-6 py-5">
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-xs font-semibold text-blue-600">
                          {user.name.charAt(0).toUpperCase()}
                        </div>

                        <div className="min-w-0">
                          <p className="truncate font-semibold text-slate-950">
                            {user.name}
                          </p>

                          {user.id === currentUser.id && (
                            <p className="mt-0.5 text-xs text-slate-400">
                              Current account
                            </p>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Email */}
                    <td className="px-6 py-5">
                      <p className="max-w-[250px] truncate text-slate-600">
                        {user.email}
                      </p>
                    </td>

                    {/* Role */}
                    <td className="whitespace-nowrap px-6 py-5">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
                          user.role === 'admin'
                            ? 'bg-blue-50 text-blue-700'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            user.role === 'admin'
                              ? 'bg-blue-500'
                              : 'bg-slate-500'
                          }`}
                        />

                        <span className="capitalize">
                          {user.role}
                        </span>
                      </span>
                    </td>

                    {/* Access / role editor */}
                    <td className="px-6 py-5">
                      <UserRoleEditor
                        userId={user.id}
                        currentRole={user.role}
                        isCurrentUser={user.id === currentUser.id}
                      />
                    </td>

                    {/* Joined */}
                    <td className="whitespace-nowrap px-6 py-5 text-right text-xs text-slate-500">
                      {new Date(user.created_at).toLocaleDateString(
                        'en-NG',
                        {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        }
                      )}
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