// src/store/useCartStore.ts
import { create } from "zustand";
import { cartService } from "@/api/services/cartService";
import type { CartItem } from "@/types/cart";

interface CartState {
  items: CartItem[];
  loading: boolean;

  // Actions
  fetchCart: (memberId: string) => Promise<void>;
  addCartItem: (memberId: string, productId: number, quantity: number) => Promise<void>;
  updateCartItem: (id: number, quantity: number) => Promise<void>;
  deleteCartItem: (id: number) => Promise<void>;

  toggleItem: (id: number) => void;
  toggleAllItems: (checked: boolean) => void;

  clearCart: (memberId: string) => Promise<void>;
  deleteCheckedItems: () => Promise<void>;

  // Getters (Computed)
  getTotalCount: () => number;
}

const useCartStore = create<CartState>((set, get) => ({
  items: [],
  loading: false,

  // ✅ 장바구니 조회
  fetchCart: async (memberId) => {
    set({ loading: true });
    try {
      const data = await cartService.getCartItems(memberId);

      // ✅ UI용 checked 기본값 주입 (실수 주문 방지용으로 false 추천)
      const itemsWithChecked = (data ?? []).map((item: CartItem) => ({
        ...item,
        checked: item.checked ?? false,
      }));

      set({ items: itemsWithChecked });
    } catch (error) {
      console.error("장바구니 조회 실패:", error);
      alert("장바구니 정보를 불러오지 못했습니다.");
      set({ items: [] });
    } finally {
      set({ loading: false });
    }
  },

  // ✅ 장바구니 담기 (이미 있으면 수량 업데이트/없으면 추가)
  addCartItem: async (memberId, productId, quantity) => {
    try {
      const updatedOrNewItem = await cartService.addToCart(memberId, productId, quantity);

      set((state) => {
        const isExist = state.items.find((item) => item.product_id === productId);

        if (isExist) {
          return {
            items: state.items.map((item) =>
              item.product_id === productId
                ? { ...updatedOrNewItem, checked: item.checked ?? false } // 기존 체크 유지
                : item
            ),
          };
        }

        return {
          items: [{ ...updatedOrNewItem, checked: true }, ...state.items],
        };
      });
    } catch (error) {
      console.error("장바구니 담기 실패:", error);
      alert("장바구니 담기에 실패했습니다.");
    }
  },

  // ✅ 수량 변경 (Optimistic Update + 실패 시 롤백)
  updateCartItem: async (id, quantity) => {
    if (quantity < 1) return;

    const prevItems = get().items;

    // 1) UI 먼저 반영
    set((state) => ({
      items: state.items.map((item) =>
        item.id === id ? { ...item, quantity } : item
      ),
    }));

    try {
      // 2) 서버 반영
      await cartService.updateQuantity(id, quantity);
    } catch (error) {
      // 3) 실패하면 롤백
      set({ items: prevItems });
      console.error("수량 변경 실패:", error);
      alert("수량 변경에 실패했습니다.");
    }
  },

  // ✅ 개별 삭제
  deleteCartItem: async (id) => {
    const prevItems = get().items;

    // UI 먼저 반영(빠른 반응)
    set((state) => ({
      items: state.items.filter((item) => item.id !== id),
    }));

    try {
      await cartService.removeItems([id]);
    } catch (error) {
      // 실패 시 롤백
      set({ items: prevItems });
      console.error("삭제 실패:", error);
      alert("삭제에 실패했습니다.");
    }
  },

  // ✅ 전체 비우기
  clearCart: async (memberId) => {
    const prevItems = get().items;

    // UI 먼저 비움
    set({ items: [] });

    try {
      await cartService.clearCart(memberId);
    } catch (error) {
      // 실패 시 복구
      set({ items: prevItems });
      console.error("장바구니 비우기 실패:", error);
      alert("장바구니 비우기에 실패했습니다.");
    }
  },

  // ✅ 선택 삭제
  deleteCheckedItems: async () => {
    const items = get().items;
    const checkedIds = items.filter((item) => item.checked).map((item) => item.id);

    if (checkedIds.length === 0) {
      alert("삭제할 상품을 선택해주세요.");
      return;
    }

    const prevItems = items;

    // UI 먼저 반영
    set((state) => ({
      items: state.items.filter((item) => !item.checked),
    }));

    try {
      await cartService.removeItems(checkedIds);
    } catch (error) {
      // 실패 시 롤백
      set({ items: prevItems });
      console.error("선택 삭제 실패:", error);
      alert("선택 삭제 중 오류가 발생했습니다.");
    }
  },

  // ✅ 총 개수
  getTotalCount: () => {
    return get().items.length;
  },

  // ✅ 개별 체크 토글
  toggleItem: (id) =>
    set((state) => ({
      items: state.items.map((item) =>
        item.id === id ? { ...item, checked: !item.checked } : item
      ),
    })),

  // ✅ 전체 체크/해제
  toggleAllItems: (checked) =>
    set((state) => ({
      items: state.items.map((item) => ({ ...item, checked })),
    })),
}));

export default useCartStore;
