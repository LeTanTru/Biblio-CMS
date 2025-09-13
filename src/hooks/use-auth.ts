'use client';

import { useProfileStore } from '@/store';
import { decodeJwt, getAccessTokenFromLocalStorage } from '@/utils';

const useAuth = () => {
  const { profile, loading, isAuthenticated } = useProfileStore();
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
    isAuthenticated: isAuthenticated || !!profile,
    profile,
    kind: profile?.kind,
    permissionCode: permissionCode,
    loading
  };
};

export default useAuth;
