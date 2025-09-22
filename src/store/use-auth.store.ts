import { ProfileStoreType, ProfileResType } from '@/types';
import { create } from 'zustand';
const useAuthStore = create<ProfileStoreType>((set) => ({
  profile: null,
  isAuthenticated: false,
  loading: true,
  setProfile: (profile: ProfileResType | null) => set({ profile }),
  setAuthenticated: (isAuthenticated: boolean) => set({ isAuthenticated }),
  setLoading: (loading: boolean) => set({ loading })
}));

export default useAuthStore;
