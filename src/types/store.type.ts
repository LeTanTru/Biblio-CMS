import { ProfileResType } from '@/types/account.type';

export type ProfileStoreType = {
  profile: ProfileResType | null;
  isAuthenticated: boolean;
  loading: boolean;
  setProfile: (profile: ProfileResType) => void;
  setAuthenticated: (isAuthenticated: boolean) => void;
  setLoading: (loading: boolean) => void;
};
