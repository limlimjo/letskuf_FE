import { create } from 'zustand';
import * as ApiFetch from '../api/apiFetch';

const useAuthStore = create(set => ({
  isLogin: null, // null: 로그인 상태 확인 중, true: 로그인, false: 로그아웃
  user: null,

  setIsLogin: value => set({ isLogin: value }),
  setUser: user => set({ user }),

  checkLogin: async () => {
    try {
      const res = await ApiFetch.requestFetch('/api/me');
      set({ isLogin: true, user: res.result.username });
    } catch (e) {
      set({ isLogin: false, user: null });
    }
  },

  logout: async () => {
    await ApiFetch.requestFetch('/api/logout');
    set({ isLogin: false, user: null });
  },
}));
export default useAuthStore;
