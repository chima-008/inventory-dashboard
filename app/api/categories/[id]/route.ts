import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function PUT(
  request: Request,
  { params }: RouteContext
) {
  const { id } = await params;

  const cookieStore = await cookies();
  const token = cookieStore.get('inventory_token')?.value;

  if (!token) {
    return NextResponse.json(
      { message: 'Unauthenticated.' },
      { status: 401 }
    );
  }

  const body = await request.json();

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/categories/${id}`,
    {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    }
  );

  const data = await response.json();

  return NextResponse.json(data, {
    status: response.status,
  });
}

export async function DELETE(
  request: Request,
  { params }: RouteContext
) {
  const { id } = await params;

  const cookieStore = await cookies();
  const token = cookieStore.get('inventory_token')?.value;

  if (!token) {
    return NextResponse.json(
      { message: 'Unauthenticated.' },
      { status: 401 }
    );
  }

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/categories/${id}`,
    {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();

  return NextResponse.json(data, {
    status: response.status,
  });
}