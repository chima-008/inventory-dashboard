import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.email) {
      return NextResponse.json(
        {
          message: 'Email address is required.',
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
      `${apiUrl}/email/verification-notification`,
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: body.email,
        }),
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
          'The API returned an unexpected response.',
      };
    }

    return NextResponse.json(data, {
      status: response.status,
    });
  } catch (error) {
    console.error(
      'Verification notification error:',
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