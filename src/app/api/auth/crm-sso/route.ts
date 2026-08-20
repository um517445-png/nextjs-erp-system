import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get('token');
  const redirectPath = searchParams.get('redirect') || '/dashboard';

  if (!token) {
    return NextResponse.redirect(new URL('/login?error=missing_token', request.url));
  }

  // In future production integration with Vorder CRM, validate JWT token via Supabase Auth
  const response = NextResponse.redirect(new URL(redirectPath, request.url));
  response.cookies.set('vorder_erp_session', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
  });

  return response;
}
