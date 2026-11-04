// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth_token')?.value;
  const path = request.nextUrl.pathname;

  const isProtectedPage = 
    path.startsWith('/dashboard') ||
    path.startsWith('/products') ||
    path.startsWith('/transactions') ||
    path.startsWith('/settings') ||
    path.startsWith('/notifications');

  if (!token && isProtectedPage) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (token && (path === '/login' || path === '/register')) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/products/:path*',
    '/transactions/:path*',
    '/settings/:path*',
    '/notifications/:path*',
    '/login',
    '/register',
  ],
};