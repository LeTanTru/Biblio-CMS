import { authApiRequest } from '@/api-requests';
import { storageKeys } from '@/constants';
import { logger } from '@/logger';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  const req = await request.json();
  const cookieStore = await cookies();
  try {
    const response = await authApiRequest.loginFromNextServerToServer(req);
    const accessToken = response?.data?.token!;
    cookieStore.set(storageKeys.ACCESS_TOKEN, accessToken, {
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
      secure: true,
      maxAge: 60 * 60 * 24 * 7
    });
    return Response.json(response, {
      status: 200
    });
  } catch (error: any) {
    logger.error('Error while login:', error.message);
    return Response.json(
      { code: error.message },
      {
        status: 400
      }
    );
  }
}
