import { loginSchema } from '@/schemaValidations';
import { ProfileResType } from '@/types/account.type';
import { Socket } from 'socket.io-client';
import z from 'zod';

export type LoginBodyType = z.infer<typeof loginSchema>;
export type LoginResType = {
  token: string;
};

export type AuthStoreType = {
  isAuthenticated: boolean;
  profile: ProfileResType | null;
  loading: boolean;
  socket: Socket | null;
  setAuthenticated: (isAuthenticated: boolean) => void;
  setProfile: (profile: ProfileResType | null) => void;
  setLoading: (loading: boolean) => void;
  connectSocket: (token: string) => void;
  disconnectSocket: () => void;
};
