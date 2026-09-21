import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    if (!apiUrl) {
      return NextResponse.json(
        {
          message: 'API configuration is missing.',
        },
        { status: 500 }
      );
    }

    const response = await fetch(`${apiUrl}/reset-password`, {
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
    console.error('Reset password API error:', error);

    return NextResponse.json(
      {
        message:
          'Unable to connect to the inventory API. Please try again later.',
      },
      { status: 500 }
    );
  }
}