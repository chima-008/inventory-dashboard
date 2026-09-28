import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (
      !body.token ||
      typeof body.token !== 'string'
    ) {
      return NextResponse.json(
        {
          message: 'Invitation token is required.',
        },
        {
          status: 422,
        }
      );
    }

    if (
      !body.name ||
      typeof body.name !== 'string' ||
      body.name.trim() === ''
    ) {
      return NextResponse.json(
        {
          message: 'Your name is required.',
        },
        {
          status: 422,
        }
      );
    }

    if (
      !body.password ||
      typeof body.password !== 'string'
    ) {
      return NextResponse.json(
        {
          message: 'Password is required.',
        },
        {
          status: 422,
        }
      );
    }

    if (
      !body.password_confirmation ||
      typeof body.password_confirmation !== 'string'
    ) {
      return NextResponse.json(
        {
          message:
            'Password confirmation is required.',
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

    const normalizedApiUrl =
      apiUrl.replace(/\/+$/, '');

    const response = await fetch(
      `${normalizedApiUrl}/invitations/complete`,
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: body.token,
          name: body.name.trim(),
          password: body.password,
          password_confirmation:
            body.password_confirmation,
        }),
        cache: 'no-store',
      }
    );

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
          'Unable to create your manager account. Please try again.',
      },
      {
        status: 500,
      }
    );
  }
}