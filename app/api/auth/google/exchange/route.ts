import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.code) {
      return NextResponse.json(
        {
          message: 'Authentication code is required.',
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

    const response = await fetch(
      `${apiUrl}/auth/google/exchange`,
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code: body.code,
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

    if (!response.ok) {
      return NextResponse.json(data, {
        status: response.status,
      });
    }

    const responseData = data as {
      message?: string;
      token?: string;
    };

    if (!responseData.token) {
      return NextResponse.json(
        {
          message:
            'Google authentication succeeded, but no authentication token was returned.',
        },
        {
          status: 500,
        }
      );
    }

    const nextResponse = NextResponse.json({
      message:
        responseData.message ||
        'Google authentication successful.',
    });

    nextResponse.cookies.set(
      'inventory_token',
      responseData.token,
      {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
      }
    );

    return nextResponse;
  } catch (error) {
    console.error(
      'Google authentication exchange error:',
      error
    );

    return NextResponse.json(
      {
        message:
          'Unable to complete Google authentication. Please try again.',
      },
      {
        status: 500,
      }
    );
  }
}