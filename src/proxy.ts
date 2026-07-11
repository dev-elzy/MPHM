import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifySessionToken } from '@/lib/auth/session';

const PUBLIC_ROUTES = ['/login'];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  const sessionCookie = request.cookies.get('mphm_session');
  let isValidSession = false;
  let userRole = '';

  if (sessionCookie) {
    const session = await verifySessionToken(sessionCookie.value);
    if (session) {
      isValidSession = true;
      userRole = (session.role || '').toLowerCase();
    }
  }

  // Skip auth check for public routes and static assets
  if (
    PUBLIC_ROUTES.includes(pathname) ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon.ico')
  ) {
    if (isValidSession && pathname === '/login') {
      const dashboardUrl = new URL('/dashboard', request.url);
      return NextResponse.redirect(dashboardUrl);
    }
    return NextResponse.next();
  }

  if (!isValidSession) {
    const loginUrl = new URL('/login', request.url);
    // Clear the invalid cookie if present
    const response = NextResponse.redirect(loginUrl);
    if (sessionCookie) {
      response.cookies.delete('mphm_session');
    }
    return response;
  }

  // Role-based route guarding
  const ADMIN_ONLY_PREFIXES = [
    '/dashboard/pengguna',
    '/dashboard/pengaturan',
    '/dashboard/audit',
    '/dashboard/recycle-bin',
  ];

  const isMustahiqOrTeacher = ['mustahiq', 'teacher', 'ustadz'].includes(userRole);
  if (isMustahiqOrTeacher && ADMIN_ONLY_PREFIXES.some((prefix) => pathname.startsWith(prefix))) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
