import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
 
// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  let { pathname } = request.nextUrl;

  pathname = pathname.replace('/api', '');
  return NextResponse.next();
  // return NextResponse.rewrite(new URL('/home', request.url))
}
 
// See "Matching Paths" below to learn more
export const config = {
  matcher: '/api/:path*',
}