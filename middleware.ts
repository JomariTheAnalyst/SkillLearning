import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { applyRateLimit } from './lib/rate-limit';

export async function middleware(request: NextRequest) {
  // Apply rate limiting to API routes
  const rateLimitResponse = await applyRateLimit(request);
  if (rateLimitResponse) {
    return rateLimitResponse;
  }

  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = request.nextUrl;

  console.log("Middleware running for path:", pathname);
  console.log("Token exists:", !!token);

  // Check if the path is a protected route that requires authentication
  const isProtectedRoute = 
    pathname.startsWith('/dashboard') || 
    pathname.includes('/learn/') || 
    pathname.includes('/quiz/');
  
  // Check if it's a course lesson or quiz page
  const isCourseContentPage = 
    pathname.match(/\/courses\/[^\/]+\/[^\/]+\/learn\//) || 
    pathname.match(/\/courses\/[^\/]+\/[^\/]+\/quiz\//);

  console.log("Is protected route:", isProtectedRoute);
  console.log("Is course content page:", !!isCourseContentPage);

  // If the user is trying to access protected content without being logged in
  if ((isProtectedRoute || isCourseContentPage) && !token) {
    console.log("Redirecting unauthenticated user to login");
    // Store the URL they were trying to access for post-login redirection
    const url = new URL('/auth/login', request.url);
    url.searchParams.set('callbackUrl', encodeURIComponent(request.url));
    
    // Redirect to login
    return NextResponse.redirect(url);
  }

  // If the user is trying to access auth pages while logged in
  if ((pathname.startsWith('/auth/login') || pathname.startsWith('/auth/register')) && token) {
    // Get the callback URL if it exists or default to dashboard
    const callbackUrl = request.nextUrl.searchParams.get('callbackUrl');
    
    console.log("User already logged in, redirecting from auth page");
    console.log("Callback URL:", callbackUrl);
    
    // Redirect to the callback URL if it exists, otherwise to dashboard
    if (callbackUrl) {
      try {
        // Make sure the URL is properly decoded
        const decodedUrl = decodeURIComponent(callbackUrl);
        console.log("Redirecting to callback URL:", decodedUrl);
        return NextResponse.redirect(decodedUrl);
      } catch (error) {
        console.error("Error redirecting to callback URL:", error);
        console.log("Fallback to dashboard");
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }
    } else {
      console.log("No callback URL, redirecting to dashboard");
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  // Apply security headers to all responses
  const response = NextResponse.next();
  
  // Security headers
  response.headers.set('X-DNS-Prefetch-Control', 'on');
  response.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('X-Frame-Options', 'SAMEORIGIN');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'origin-when-cross-origin');
  
  // Content Security Policy
  response.headers.set(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self' data:; connect-src 'self'"
  );
  
  // Permissions Policy
  response.headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=(), interest-cohort=()'
  );

  return response;
}

// Configure which paths the middleware should run on
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}; 