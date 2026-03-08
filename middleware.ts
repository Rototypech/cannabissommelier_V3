import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const locales = ['en', 'de'];
const defaultLocale = 'de';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const ageVerified = request.cookies.get('age_verified');

  // Skip static files & API
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/favicon.ico') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // Check if pathname has a locale
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  // 1. Handle Root & Missing Locale
  if (!pathnameHasLocale) {
    const locale = defaultLocale; // Could use negotiator here for browser lang
    return NextResponse.redirect(
      new URL(`/${locale}${pathname === '/' ? '' : pathname}`, request.url)
    );
  }

  // 2. Handle Age Gate
  const currentLocale = pathname.split('/')[1];
  const ageGatePath = `/${currentLocale}/age-gate`;

  if (!ageVerified && pathname !== ageGatePath) {
    return NextResponse.rewrite(new URL(ageGatePath, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
