import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifySessionToken } from '@/lib/auth/session';

const PUBLIC_ROUTES = ['/login'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Proxy API requests to backend — manual fetch to preserve Set-Cookie headers
  if (pathname.startsWith('/api/v1/')) {
    const backendUrl = process.env.BACKEND_URL || 'https://api.m.p3hm.my.id';
    const targetUrl = new URL(pathname + request.nextUrl.search, backendUrl);

    // Build forwarded headers, replacing Host with backend's host
    const headers = new Headers(request.headers);
    headers.set('Host', new URL(backendUrl).host);
    // Remove Next.js internal headers that may confuse the backend
    headers.delete('x-middleware-invoke');
    headers.delete('x-middleware-next');

    const backendResponse = await fetch(targetUrl.toString(), {
      method: request.method,
      headers,
      body: request.method !== 'GET' && request.method !== 'HEAD'
        ? request.body
        : undefined,
      redirect: 'manual',
      // @ts-expect-error — required for Cloudflare Workers streaming
      duplex: 'half',
    });

    // Forward the backend response including ALL headers (Set-Cookie, etc.)
    const response = new NextResponse(backendResponse.body, {
      status: backendResponse.status,
      statusText: backendResponse.statusText,
    });

    // Copy every header from backend response
    backendResponse.headers.forEach((value, key) => {
      response.headers.set(key, value);
    });

    return response;
  }
  
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
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
