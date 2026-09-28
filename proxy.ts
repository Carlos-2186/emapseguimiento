import { NextResponse, type NextRequest } from 'next/server';
import { SESSION_COOKIE, verifySession } from './lib/session';

export async function proxy(request: NextRequest) {
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const session = token ? await verifySession(token) : null;
  const { pathname } = request.nextUrl;

  if (pathname.startsWith('/derivaciones') && !session) {
    const url = new URL('/login', request.url);
    url.searchParams.set('next', pathname);
    return NextResponse.redirect(url);
  }

  if (pathname === '/login' && session) {
    return NextResponse.redirect(new URL('/derivaciones', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/derivaciones/:path*', '/login'],
};
