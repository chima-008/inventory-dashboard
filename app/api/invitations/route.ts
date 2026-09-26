import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (
      !body.email ||
      typeof body.email !== 'string' ||
      body.email.trim() === ''
    ) {
      return NextResponse.json(
        {
          message: 'Manager email address is required.',
        },
        {
          status: 422,
        }
      );
    }

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
          message: 'Authentication is required.',
        },
        {
          status: 401,
        }
      );
    }

    const response = await fetch(`${apiUrl}/invitations`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        email: body.email.trim(),
      }),
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
          'Unable to send the invitation. Please try again.',
      },
      {
        status: 500,
      }
    );
  }
}