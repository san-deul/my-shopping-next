// 주문 페이지로 넘어가기전에 임시주문상태를 보관하는 전역 저장소

import { create } from "zustand";
import type { CreateOrderInput } from "@/types/order";


export type OrderItem = {
  productId: number;
  quantity: number;
};


// store에서 productId만 저장.., DB에서 최신 product정보 조회
interface OrderState { // 스토어 전체 구조
  orderItems: OrderItem[]; // 주문할 상품 목록
  orderInfo: CreateOrderInput; // 주문자정보+배송정보
  isFromCart: boolean; // 상세페이지, 장바구니 구분

  setOrder: (productId: number, quantity: number) => void;
  setCartOrder: (items: OrderItem[]) => void;

  updateOrderInfo: (info: Partial<CreateOrderInput>) => void;
  clearOrder: () => void;

}

const initialOrderInfo: CreateOrderInput = {
  member_id: null,
  total_price: 0,
  status: "pending",
  payment_method: "card",
  order_name: "",
  order_phone: "",
  zipcode: "",
  basic_address: "",
  detail_address: "",
  extra_info: "",
};

export const useOrderStore = create<OrderState>((set) => ({
  orderItems: [],
  orderInfo: initialOrderInfo,
  isFromCart: false,

  // [상세페이지] 단일 상품 주문
  setOrder: (productId, quantity) => {
    set({
      orderItems: [{ productId, quantity }],
      isFromCart: false,
      orderInfo: { ...initialOrderInfo }, // total은 /order에서 계산
    });
  },

  // [장바구니] 여러 상품 주문
  setCartOrder: (items) => {
    set({
      orderItems: items,
      isFromCart: true,
      orderInfo: { ...initialOrderInfo },
    });
  },

  updateOrderInfo: (info) =>
    set((state) => ({
      orderInfo: { ...state.orderInfo, ...info },
    })),

  clearOrder: () =>
    set({
      orderItems: [],
      orderInfo: initialOrderInfo,
      isFromCart: false,
    }),
}));
