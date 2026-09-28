import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    if (!apiUrl) {
      console.error(
        'Registration error: NEXT_PUBLIC_API_URL is not configured.'
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

    const normalizedApiUrl = apiUrl.replace(/\/+$/, '');

    console.log(
      'Registration request started:',
      `${normalizedApiUrl}/register`
    );

    const response = await fetch(
      `${normalizedApiUrl}/register`,
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
        cache: 'no-store',
      }
    );

    const text = await response.text();

    let data: any;

    try {
      data = JSON.parse(text);
    } catch {
      console.error(
        'Registration upstream returned non-JSON response:',
        {
          status: response.status,
          statusText: response.statusText,
          body: text,
        }
      );

      return NextResponse.json(
        {
          message:
            response.statusText ||
            'The inventory API returned an unexpected response.',
        },
        {
          status: response.status || 502,
        }
      );
    }

    console.log(
      'Registration upstream response:',
      {
        status: response.status,
        ok: response.ok,
        message: data?.message,
        email_verification_required:
          data?.email_verification_required,
        verification_email_sent:
          data?.verification_email_sent,
      }
    );

    return NextResponse.json(data, {
      status: response.status,
    });
  } catch (error) {
    console.error(
      'Registration API error:',
      error
    );

    return NextResponse.json(
      {
        message:
          'Unable to connect to the inventory API. Please try again later.',
      },
      {
        status: 500,
      }
    );
  }
}