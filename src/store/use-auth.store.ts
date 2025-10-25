import { AppConstants } from '@/constants';
import { AuthStoreType, ProfileResType } from '@/types';
import { io, Socket } from 'socket.io-client';
import { create } from 'zustand';
const useAuthStore = create<AuthStoreType>((set, get) => ({
  profile: null,
  isAuthenticated: false,
  loading: true,
  socket: null,
  setProfile: (profile: ProfileResType | null) => set({ profile }),
  setAuthenticated: (isAuthenticated: boolean) => set({ isAuthenticated }),
  setLoading: (loading: boolean) => set({ loading }),
  connectSocket: (token: string) => {
    const socket: Socket = io(AppConstants.socketUrl, {
      auth: {
        token: `Bearer ${token}`
      },
      transports: ['websocket']
    });
    socket.connect();
    set({ socket });
    socket.on('connect', () => {
      socket.emit('ping', { message: 'ping from client' });
    });
  },
  disconnectSocket: () => {
    const socket = get().socket;
    if (socket) {
      socket.disconnect();
    }
  }
}));

export default useAuthStore;
