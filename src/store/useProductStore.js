import { create } from "zustand";

export const useProductStore = create((set) => ({
  isMobile: false,
  setIsMobile: (val) => set({ isMobile: val }),
}));