// store/useOrderStore.ts
import { create } from 'zustand';
import { Product } from '@/types/schema';

interface OrderState {
  orderItem: {
    product: Product | null;
    quantity: number;
  } | null;
  setOrder: (product: Product, quantity: number) => void;
  clearOrder: () => void;
}

export const useOrderStore = create<OrderState>((set) => ({
  orderItem: null,
  setOrder: (product, quantity) => set({ orderItem: { product, quantity } }),
  clearOrder: () => set({ orderItem: null }),
}));