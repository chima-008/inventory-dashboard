'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

type UserRole = 'admin' | 'manager';

type UserRoleEditorProps = {
  userId: number;
  currentRole: UserRole;
  isCurrentUser: boolean;
};

export default function UserRoleEditor({
  userId,
  currentRole,
  isCurrentUser,
}: UserRoleEditorProps) {
  const router = useRouter();

  const [role, setRole] = useState<UserRole>(currentRole);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  async function handleSave() {
    if (role === currentRole) {
      return;
    }

    setSaving(true);
    setError('');

    try {
      const response = await fetch(`/api/users/${userId}/role`, {
        method: 'PATCH',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role }),
      });

      const data = await response.json();

      if (response.status === 401) {
        router.push('/login');
        return;
      }

      if (response.status === 403) {
        setError(
          data.message ||
            'You do not have permission to change user roles.'
        );
        return;
      }

      if (!response.ok) {
        setError(data.message || 'Failed to update user role.');
        return;
      }

      router.refresh();
    } catch {
      setError('Unable to connect to the server. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  if (isCurrentUser) {
    return (
      <span className="inline-flex items-center rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-500">
        Current account
      </span>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <select
        value={role}
        onChange={(event) =>
          setRole(event.target.value as UserRole)
        }
        disabled={saving}
        className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400"
      >
        <option value="manager">Manager</option>
        <option value="admin">Admin</option>
      </select>

      <button
        type="button"
        onClick={handleSave}
        disabled={saving || role === currentRole}
        className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {saving ? 'Saving...' : 'Save'}
      </button>

      {error && (
        <p className="basis-full text-xs font-medium text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}