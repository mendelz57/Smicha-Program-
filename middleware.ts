import NextAuth from 'next-auth';
import { authConfig } from '@/lib/auth.config';
import { NextResponse } from 'next/server';

const { auth } = NextAuth(authConfig);

export default auth(async (req) => {
  const { pathname } = req.nextUrl;
  const session = req.auth;

  const publicPaths = ['/', '/login', '/register', '/contact', '/api/auth', '/api/register'];
  if (publicPaths.some(p => pathname.startsWith(p))) return NextResponse.next();

  if (!session) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  if (pathname.startsWith('/admin')) {
    if ((session.user as any)?.role !== 'admin') {
      return NextResponse.redirect(new URL('/student', req.url));
    }
    return NextResponse.next();
  }

  return NextResponse.next();
});

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
