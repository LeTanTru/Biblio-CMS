import { storageKeys } from '@/constants';
import { cookies } from 'next/headers';

export async function POST() {
  const cookieStore = await cookies();
  cookieStore.delete(storageKeys.ACCESS_TOKEN);
  return Response.json(
    { result: true, message: 'Logout successfully' },
    { status: 200 }
  );
}
