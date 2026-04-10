import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // 1. PUBLIC PATHS & ASSETS EXCLUSIONS
  // Skip middleware for internal Next.js paths, static files, and public landing/login pages
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api/') || // Don't intercept API calls (handled by backend or separate auth)
    pathname === '/login' ||
    pathname === '/' ||
    pathname.match(/\.(.*)$/) // Skip any path with an extension (assets like .png, .svg, .css, etc)
  ) {
    return NextResponse.next();
  }

  // 2. SESSION CHECK
  // We check for our custom session cookie
  const session = request.cookies.get('portal_user_logged_in');

  if (!session) {
    const url = request.nextUrl.clone();
    
    // Safety check to prevent redirect loops if something went wrong with the logic above
    if (pathname === '/login') return NextResponse.next();

    url.pathname = '/login';
    url.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(url);
  }

  // 3. AUTHORIZATION LOGIC
  // Restricted Access for Super Admin Portal
  if (pathname.startsWith('/super_admin') && session.value !== 'super_admin') {
    const url = request.nextUrl.clone();
    url.pathname = '/'; // Kick back to landing page if not super_admin
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  // Use a cleaner matcher that covers everything except for standard exclusions
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
