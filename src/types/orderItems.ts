export interface OrderItem {
  id: number;
  order_id: number;
  product_id: number | null;
  product_name: string;
  product_image: string | null;
  price: number;
  quantity: number;
  subtotal: number; // DB에서 (price * quantity)로 계산됨
}

// 주문 항목 생성 시 필요한 데이터
export type CreateOrderItemInput = Omit<OrderItem, 'id' | 'subtotal'>;