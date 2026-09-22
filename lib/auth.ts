import 'server-only';

import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

export type AuthUser = {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'manager';
  business: {
    id: number;
    name: string;
  } | null;
};

export async function getCurrentUser(): Promise<AuthUser> {
  const cookieStore = await cookies();
  const token = cookieStore.get('inventory_token')?.value;

  if (!token) {
    redirect('/login');
  }

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/user`,
    {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
      cache: 'no-store',
    }
  );

  if (response.status === 401) {
    redirect('/login');
  }

  if (!response.ok) {
    throw new Error('Failed to fetch authenticated user.');
  }

  const body = await response.json();

  return body.data;
}