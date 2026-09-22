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

    const payload: {
      code: string;
      business_name?: string;
    } = {
      code: body.code,
    };

    if (
      typeof body.business_name === 'string' &&
      body.business_name.trim() !== ''
    ) {
      payload.business_name = body.business_name.trim();
    }

    const response = await fetch(
      `${apiUrl}/auth/google/exchange`,
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
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
      return NextResponse.json(
        data,
        {
          status: response.status,
        }
      );
    }

    const responseData = data as {
      message?: string;
      token?: string;
      requires_business_name?: boolean;
    };

    /*
    |--------------------------------------------------------------------------
    | New Google user needs to choose a business name
    |--------------------------------------------------------------------------
    */

    if (responseData.requires_business_name) {
      return NextResponse.json({
        message:
          responseData.message ||
          'Please provide your business name to continue.',
        requires_business_name: true,
      });
    }

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

    nextResponse.cookies.set({
      name: 'inventory_token',
      value: responseData.token,
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 30,
    });

    return nextResponse;
  } catch {
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