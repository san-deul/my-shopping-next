// src/types/cart.ts

import { Product } from "./schema";

// 1. DB의 cart 테이블 구조와 1:1 매칭되는 타입
export interface Cart {
  id: number;
  member_id: string;
  product_id: number;
  quantity: number;
  created_at: string;
  updated_at: string;
}

// 2. 실제 장바구니 페이지에서 사용할 타입 (상품 정보 Join + UI 상태)
export interface CartItem extends Cart {
  // Supabase에서 .select('*, products(*)')로 가져올 때 포함되는 데이터
  products: Product;
  checked: boolean;  

}