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
  const isSekretariat = ['sekretariat', 'super_admin', 'admin', 'operator'].includes(userRole);
  const isMustahiq = ['mustahiq', 'teacher', 'ustadz'].includes(userRole);
  const isMufattisy = ['mufattisy', 'mufatish', 'pengawas'].includes(userRole);
  const isPimpinan = ['pimpinan', 'mundzir', 'mudir'].includes(userRole);
  const isKeamanan = ['petugas_keamanan', 'security', 'keamanan'].includes(userRole);
  const isWali = ['wali_santri', 'guardian', 'parent', 'wali'].includes(userRole);

  if (pathname.startsWith('/dashboard/sekretariat') && !isSekretariat) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
  if (pathname.startsWith('/dashboard/mustahiq') && !isMustahiq) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
  if (pathname.startsWith('/dashboard/mufattisy') && !isMufattisy) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
  if (pathname.startsWith('/dashboard/pimpinan') && !isPimpinan) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
  if (pathname.startsWith('/dashboard/keamanan') && !isKeamanan) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
  if (pathname.startsWith('/dashboard/parent') && !isWali) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
