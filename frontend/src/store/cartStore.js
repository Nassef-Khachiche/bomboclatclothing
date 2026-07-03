import { create } from "zustand";
import api from "../api/client";

const sessionIdKey = "bomboclat-session-id";

function getSessionId() {
  const fromStorage = localStorage.getItem(sessionIdKey);
  if (fromStorage) {
    return fromStorage;
  }
  const generated = `guest-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  localStorage.setItem(sessionIdKey, generated);
  return generated;
}

const useCartStore = create((set, get) => ({
  cart: null,
  loading: false,
  sessionId: null,

  init: async () => {
    const sessionId = getSessionId();
    set({ sessionId, loading: true });
    const { data } = await api.get(`/cart?sessionId=${sessionId}`);
    set({ cart: data, loading: false });
  },

  addToCart: async (productId, quantity = 1) => {
    const { sessionId } = get();
    const { data } = await api.post("/cart", { sessionId, productId, quantity });
    set({ cart: data });
  },

  updateQuantity: async (itemId, quantity) => {
    await api.put(`/cart/item/${itemId}`, { quantity });
    await get().init();
  },

  removeItem: async (itemId) => {
    await api.delete(`/cart/item/${itemId}`);
    await get().init();
  },

  clear: async () => {
    const { sessionId } = get();
    await api.delete(`/cart/clear/${sessionId}`);
    await get().init();
  }
}));

export default useCartStore;
