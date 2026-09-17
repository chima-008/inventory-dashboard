import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
  const cookieStore = await cookies();
  const token = cookieStore.get('inventory_token')?.value;

  if (token) {
    await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/logout`,
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
    );
  }

  const response = NextResponse.json({
    message: 'Logout successful.',
  });

  response.cookies.delete('inventory_token');

  return response;
}