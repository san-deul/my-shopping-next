import { create } from "zustand";

// 

interface ShopState {
  currentPage: number;
  setCurrentPage: (page: number) => void;
}

export const useShopStore = create<ShopState>((set) => ({
  currentPage: 1,
  setCurrentPage: (page) => set({ currentPage: page }),
}));