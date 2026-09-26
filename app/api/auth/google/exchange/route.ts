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

    console.log('[Google Exchange] API URL configured:', Boolean(apiUrl));

    if (!apiUrl) {
      console.error(
        '[Google Exchange] NEXT_PUBLIC_API_URL is missing.'
      );

      return NextResponse.json(
        {
          message: 'API configuration is missing.',
        },
        {
          status: 500,
        }
      );
    }

    const exchangeUrl = `${apiUrl}/auth/google/exchange`;

    console.log(
      '[Google Exchange] Starting API request:',
      exchangeUrl
    );

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

    let response: Response;

    try {
      response = await fetch(exchangeUrl, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
        cache: 'no-store',
      });
    } catch (error) {
      console.error(
        '[Google Exchange] Fetch failed:',
        error instanceof Error
          ? {
              name: error.name,
              message: error.message,
              cause:
                error.cause instanceof Error
                  ? error.cause.message
                  : error.cause,
            }
          : error
      );

      return NextResponse.json(
        {
          message:
            'Unable to connect to the inventory API.',
        },
        {
          status: 502,
        }
      );
    }

    console.log(
      '[Google Exchange] API response status:',
      response.status
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
      console.error(
        '[Google Exchange] Inventory API rejected request:',
        {
          status: response.status,
          statusText: response.statusText,
          response:
            typeof data === 'object' && data !== null
              ? data
              : 'Non-JSON response',
        }
      );

      return NextResponse.json(data, {
        status: response.status,
      });
    }

    const responseData = data as {
      message?: string;
      token?: string;
      requires_business_name?: boolean;
    };

    if (responseData.requires_business_name) {
      console.log(
        '[Google Exchange] Business name required for new Google user.'
      );

      return NextResponse.json({
        message:
          responseData.message ||
          'Please provide your business name to continue.',
        requires_business_name: true,
      });
    }

    if (!responseData.token) {
      console.error(
        '[Google Exchange] API returned success without authentication token.'
      );

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

    console.log(
      '[Google Exchange] Authentication successful. Setting session cookie.'
    );

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
  } catch (error) {
    console.error(
      '[Google Exchange] Unexpected route error:',
      error instanceof Error
        ? {
            name: error.name,
            message: error.message,
            cause:
              error.cause instanceof Error
                ? error.cause.message
                : error.cause,
          }
        : error
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