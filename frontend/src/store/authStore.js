import { create } from "zustand";

const tokenKey = "bomboclat-admin-token";

const useAuthStore = create((set) => ({
  token: localStorage.getItem(tokenKey),
  user: null,
  setAuth: (payload) => {
    localStorage.setItem(tokenKey, payload.token);
    set({ token: payload.token, user: payload.user });
  },
  logout: () => {
    localStorage.removeItem(tokenKey);
    set({ token: null, user: null });
  }
}));

export default useAuthStore;
