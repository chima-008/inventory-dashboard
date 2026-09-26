import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    if (!apiUrl) {
      return NextResponse.json(
        {
          message: 'API configuration is missing.',
        },
        {
          status: 500,
        }
      );
    }

    const cookieStore = await cookies();
    const token = cookieStore.get('inventory_token')?.value;

    if (!token) {
      return NextResponse.json(
        {
          message: 'Unauthenticated.',
        },
        {
          status: 401,
        }
      );
    }

    const response = await fetch(`${apiUrl}/user`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
      cache: 'no-store',
    });

    const text = await response.text();

    let data: unknown;

    try {
      data = JSON.parse(text);
    } catch {
      data = {
        message:
          response.statusText ||
          'The inventory API returned an unexpected response.',
      };
    }

    return NextResponse.json(data, {
      status: response.status,
    });
  } catch {
    return NextResponse.json(
      {
        message:
          'Unable to verify your authenticated session.',
      },
      {
        status: 500,
      }
    );
  }
}