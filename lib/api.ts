import 'server-only';

import { cookies } from 'next/headers';

export async function apiFetch(
  path: string,
  options: RequestInit = {}
) {
  const cookieStore = await cookies();
  const token = cookieStore.get('inventory_token')?.value;

  const headers = new Headers(options.headers);

  headers.set('Accept', 'application/json');

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  return fetch(
    `${process.env.NEXT_PUBLIC_API_URL}${path}`,
    {
      ...options,
      headers,
      cache: 'no-store',
    }
  );
}