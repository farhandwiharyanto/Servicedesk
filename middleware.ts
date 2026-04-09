import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Skip middleware for internal Next.js paths, static files, and the login page
  if (
    pathname.startsWith('/_next') ||
    pathname.includes('/api/') ||
    pathname.includes('/favicon.ico') ||
    pathname === '/login' ||
    pathname === '/'
  ) {
    return NextResponse.next();
  }

  const session = request.cookies.get('portal_user_logged_in');

  if (!session) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(url);
  }

  // Restricted Access for Super Admin Portal
  if (pathname.startsWith('/super_admin') && session.value !== 'super_admin') {
    const url = request.nextUrl.clone();
    url.pathname = '/'; // Kick back to landing page if not super_admin
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
