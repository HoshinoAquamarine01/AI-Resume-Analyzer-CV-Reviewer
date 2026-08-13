import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Protected routes requiring authentication
const protectedRoutes = ['/dashboard', '/profile', '/resumes', '/cover-letters', '/interviews'];

// Admin routes requiring admin permissions
const adminRoutes = ['/admin'];

// Auth routes (login/register)
const authRoutes = ['/login', '/register', '/auth/login', '/auth/register'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Retrieve token from cookies
  const token = request.cookies.get('token')?.value || request.cookies.get('accessToken')?.value;

  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route));
  const isAdminRoute = adminRoutes.some((route) => pathname.startsWith(route));
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  // Redirect unauthenticated user trying to access protected or admin routes
  if ((isProtectedRoute || isAdminRoute) && !token) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect authenticated user away from auth pages
  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - api routes (/api/*)
     * - Next.js static assets (_next/static, _next/image)
     * - Favicon and static files (.svg, .png, etc.)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
