import { storageKeys } from '@/constants';
import route from '@/routes';
import { NextRequest, NextResponse } from 'next/server';

const publicPaths = ['/login'];

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const accessToken = request.cookies.get(storageKeys.ACCESS_TOKEN)?.value;
  // if (accessToken) {
  //   if (publicPaths.some((path) => pathname.startsWith(path))) {
  //     return NextResponse.redirect(
  //       new URL(route.account.getList.path, request.nextUrl)
  //     );
  //   }
  // } else {
  //   if (!publicPaths.some((path) => pathname.startsWith(path))) {
  //     return NextResponse.redirect(new URL(route.login.path, request.nextUrl));
  //   }
  // }
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|trpc|_next|_vercel|.*\\..*).*)']
};
