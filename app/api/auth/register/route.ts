import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    if (!apiUrl) {
      console.error('NEXT_PUBLIC_API_URL is not configured.');

      return NextResponse.json(
        {
          message: 'API configuration is missing.',
        },
        {
          status: 500,
        }
      );
    }

    const response = await fetch(`${apiUrl}/register`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const text = await response.text();

    let data: unknown;

    try {
      data = JSON.parse(text);
    } catch {
      console.error(
        'Inventory API returned a non-JSON response:',
        text
      );

      data = {
        message:
          response.statusText ||
          'The inventory API returned an unexpected response.',
      };
    }

    return NextResponse.json(data, {
      status: response.status,
    });
  } catch (error) {
    console.error('Registration API error:', error);

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