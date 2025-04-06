import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  console.log('Middleware - URL:', req.nextUrl.pathname);
  console.log('Middleware - Token:', token);

  const isProtectedPath = req.nextUrl.pathname.startsWith('/dashboard') && req.nextUrl.pathname !== '/dashboard/login';

  if (isProtectedPath && !token) {
    console.log('Middleware - Redirecting to /dashboard/login');
    return NextResponse.redirect(new URL('/dashboard/login', req.url));
  }

  if (req.nextUrl.pathname === '/' && !token) {
    console.log('Middleware - Redirecting root to /dashboard/login');
    return NextResponse.redirect(new URL('/dashboard/login', req.url));
  }

  console.log('Middleware - Allowing navigation');
  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/'],
};