// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  // For API routes, we need to check the Authorization header
  if (request.nextUrl.pathname.startsWith('/api/admin')) {
    const token = request.headers.get('authorization')?.split(' ')[1];
    if (!token) {
      return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }
    // You might want to verify the token here
    return NextResponse.next();
  }

  // For page routes, we'll let the client-side handle the redirect
  if (request.nextUrl.pathname.startsWith('/admin')) {
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};