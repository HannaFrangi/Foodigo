import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Retrieve the JWT token from cookies
  const token = request.cookies.get('jwt'); // Ensure 'jwt' matches your actual cookie name
  const signInPath = '/auth/sign-in'; // Path to the sign-in page
  const dashboardPath = '/'; // Path to the dashboard or home page after login

  // Redirect to sign-in if not authenticated and trying to access protected routes
  if (!token) {
    if (request.nextUrl.pathname !== signInPath) {
    //  console.log('User not authenticated. Redirecting to sign-in page.');
      const url = new URL(signInPath, request.url);
      return NextResponse.redirect(url);
    }
  } else {
    // If authenticated, prevent access to the sign-in page
    if (request.nextUrl.pathname.startsWith(signInPath)) {
     // console.log('User already authenticated. Redirecting to dashboard.');
      const url = new URL(dashboardPath, request.url);
      return NextResponse.redirect(url);
    }
  }

  // Allow the request to proceed if none of the conditions above are met
  return NextResponse.next();
}

// Apply middleware to specific routes
export const config = {
  matcher: [
    '/', // Root path
    '/dashboard/:path*', // Protect dashboard and sub-routes
    '/profile/:path*',   // Protect profile and sub-routes
    '/calendar/:path*',  // Protect calendar and sub-routes
    '/auth/sign-in',     // To handle cases where the user is already authenticated
  ],
};
