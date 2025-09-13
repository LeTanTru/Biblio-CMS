'use client';

import { useProfileStore } from '@/store';
import { decodeJwt, getAccessTokenFromLocalStorage } from '@/utils';

const useAuth = () => {
  const { profile, loading } = useProfileStore();
  const accessToken = getAccessTokenFromLocalStorage();
  let permissionCode: string[] = [];
  if (accessToken) {
    const decodedToken = decodeJwt(accessToken);
    if (decodedToken?.authorities) {
      permissionCode =
        decodedToken?.authorities?.length > 0
          ? decodedToken?.authorities?.map((role) => role)
          : [];
    }
  }

  return {
    isAuthenticated: !!profile,
    profile,
    kind: profile?.kind,
    permissionCode: permissionCode,
    accessToken,
    loading
  };
};

export default useAuth;
