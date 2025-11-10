/**
 * Next.js 16 proxy.ts Template
 * 
 * Network boundary configuration (replaces middleware.ts)
 * Runs on Node.js runtime
 */

import { NextRequest, NextResponse } from 'next/server';

/**
 * Main proxy function - handles all request interception
 */
export default function proxy(request: NextRequest) {
  // Get request information
  const { pathname, searchParams } = request.nextUrl;
  const url = request.nextUrl.clone();
  
  // ============================================
  // AUTHENTICATION
  // ============================================
  
  // Check authentication for protected routes
  if (pathname.startsWith('/dashboard') || pathname.startsWith('/admin')) {
    const token = request.cookies.get('auth-token');
    
    if (!token) {
      url.pathname = '/login';
      url.searchParams.set('redirect', pathname);
      return NextResponse.redirect(url);
    }
    
    // Additional role check for admin routes
    if (pathname.startsWith('/admin')) {
      const role = request.cookies.get('user-role')?.value;
      if (role !== 'admin') {
        url.pathname = '/unauthorized';
        return NextResponse.redirect(url);
      }
    }
  }
  
  // ============================================
  // INTERNATIONALIZATION
  // ============================================
  
  // Handle locale redirects
  const locale = getLocale(request);
  const pathnameHasLocale = pathname.startsWith(`/${locale}`);
  
  if (!pathnameHasLocale && shouldAddLocale(pathname)) {
    url.pathname = `/${locale}${pathname}`;
    return NextResponse.redirect(url);
  }
  
  // ============================================
  // A/B TESTING
  // ============================================
  
  // Assign A/B test variant
  let variant = request.cookies.get('ab-variant')?.value;
  
  if (!variant && pathname === '/landing') {
    variant = Math.random() < 0.5 ? 'A' : 'B';
    
    const response = NextResponse.next();
    response.cookies.set('ab-variant', variant, {
      maxAge: 60 * 60 * 24 * 30, // 30 days
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
    });
    response.headers.set('x-ab-variant', variant);
    
    return response;
  }
  
  // ============================================
  // GEOGRAPHIC ROUTING
  // ============================================
  
  // Route based on country
  const country = request.geo?.country || 'US';
  
  if (pathname === '/') {
    if (country === 'GB') {
      url.pathname = '/uk';
      return NextResponse.redirect(url);
    } else if (country === 'DE') {
      url.pathname = '/de';
      return NextResponse.redirect(url);
    }
  }
  
  // ============================================
  // REQUEST MODIFICATION
  // ============================================
  
  // Add custom headers
  const response = NextResponse.next();
  
  // Add security headers
  response.headers.set('X-Frame-Options', 'SAMEORIGIN');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // Add custom headers for Server Components
  response.headers.set('x-user-country', country);
  response.headers.set('x-pathname', pathname);
  
  if (variant) {
    response.headers.set('x-ab-variant', variant);
  }
  
  // ============================================
  // REDIRECTS
  // ============================================
  
  // Redirect old URLs
  if (pathname === '/old-page') {
    url.pathname = '/new-page';
    return NextResponse.redirect(url, 301); // Permanent redirect
  }
  
  // Redirect with search params
  if (pathname === '/search' && !searchParams.has('q')) {
    url.pathname = '/';
    return NextResponse.redirect(url);
  }
  
  // ============================================
  // REWRITES
  // ============================================
  
  // Rewrite API calls to external service
  if (pathname.startsWith('/api/external')) {
    const apiUrl = new URL(pathname.replace('/api/external', ''), 'https://api.example.com');
    searchParams.forEach((value, key) => apiUrl.searchParams.set(key, value));
    return NextResponse.rewrite(apiUrl);
  }
  
  // ============================================
  // RATE LIMITING (Example - requires external service)
  // ============================================
  
  // Note: For production, use a proper rate limiting service
  // like Upstash Redis or similar
  
  // if (pathname.startsWith('/api')) {
  //   const ip = request.ip ?? '127.0.0.1';
  //   const { success } = await rateLimit(ip);
  //   
  //   if (!success) {
  //     return NextResponse.json(
  //       { error: 'Too many requests' },
  //       { status: 429 }
  //     );
  //   }
  // }
  
  // ============================================
  // LOGGING & ANALYTICS
  // ============================================
  
  // Log request (in production, send to analytics service)
  if (process.env.NODE_ENV === 'production') {
    // sendToAnalytics({
    //   path: pathname,
    //   method: request.method,
    //   country,
    //   userAgent: request.headers.get('user-agent'),
    //   timestamp: Date.now(),
    // });
  }
  
  return response;
}

// ============================================
// CONFIGURATION
// ============================================

// Specify which paths to run proxy on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};

// Alternative matchers:
// export const config = {
//   matcher: ['/dashboard/:path*', '/admin/:path*', '/api/:path*'],
// };

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Get locale from request headers
 */
function getLocale(request: NextRequest): string {
  // Check for locale cookie first
  const localeCookie = request.cookies.get('locale')?.value;
  if (localeCookie && ['en', 'es', 'fr', 'de'].includes(localeCookie)) {
    return localeCookie;
  }
  
  // Check Accept-Language header
  const acceptLanguage = request.headers.get('accept-language');
  if (acceptLanguage) {
    const languages = acceptLanguage
      .split(',')
      .map((lang) => lang.split(';')[0].trim().toLowerCase());
    
    for (const lang of languages) {
      if (lang.startsWith('es')) return 'es';
      if (lang.startsWith('fr')) return 'fr';
      if (lang.startsWith('de')) return 'de';
    }
  }
  
  return 'en'; // Default locale
}

/**
 * Check if pathname should have locale prefix
 */
function shouldAddLocale(pathname: string): boolean {
  // Skip for API routes and static files
  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.includes('.')
  ) {
    return false;
  }
  
  return true;
}

/**
 * Validate authentication token (example)
 */
async function validateToken(token: string): Promise<boolean> {
  try {
    // Implement your token validation logic
    // e.g., JWT verification, database lookup, etc.
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Get user role from token (example)
 */
async function getUserRole(token: string): Promise<string> {
  try {
    // Implement role extraction from token
    return 'user';
  } catch (error) {
    return 'guest';
  }
}

// ============================================
// NOTES
// ============================================

/**
 * Differences from middleware.ts:
 * 
 * 1. File name: proxy.ts (instead of middleware.ts)
 * 2. Export: export default function proxy() (instead of export function middleware())
 * 3. Runtime: Node.js (middleware.ts was Edge)
 * 4. Purpose: Clarifies network boundary and routing focus
 * 
 * Migration:
 * - Rename middleware.ts → proxy.ts
 * - Rename exported function to 'proxy'
 * - Logic remains the same
 */
