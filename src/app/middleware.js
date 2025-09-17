import { NextResponse } from 'next/server';

export function middleware(request) {
  console.log('Middleware: Request method:', request.method, 'URL:', request.nextUrl.pathname);
  const token = request.cookies.get('token')?.value || request.headers.get('authorization')?.replace('Bearer ', '');
  if ((request.nextUrl.pathname.startsWith('/pages/dashboard') || 
       request.nextUrl.pathname.startsWith('/pages/academy-dashboard') ||
       request.nextUrl.pathname.startsWith('/pages/coach-dashboard')) && !token) {
    console.log('Middleware: No token, redirecting to /login');
    return NextResponse.redirect(new URL('/login', request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/pages/dashboard/:path*', '/pages/academy-dashboard/:path*', '/pages/coach-dashboard/:path*'],
};