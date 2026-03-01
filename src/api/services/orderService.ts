import { supabase } from "@/lib/supabase";
import { CreateOrderInput } from "@/types/order";
import { Product } from "@/types/schema";

interface OrderItemInput {
  product: Product;
  quantity: number;
}

export const orderService = {
  /**
   * 1. 전체 주문 프로세스 실행
   * - 주문서 생성 (orders)
   * - 주문 상품 상세 등록 (order_items)
   * - 장바구니 비우기 (선택사항)
   */
  async createCompleteOrder(
    orderData: CreateOrderInput,
    items: OrderItemInput[],
    isFromCart: boolean = false
  ) {
    try {
      // [A] 주문서(orders 테이블) 생성
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert([orderData])
        .select()
        .single();

      if (orderError) throw orderError;

      // [B] 주문 상품 상세(order_items 테이블) 등록
      // DB 구조에 맞게 매핑 (order_id 포함)
      const orderItems = items.map((item) => ({
        order_id: order.id,
        product_id: item.product.id,
        product_name:item.product.name,
        product_image:item.product.image,
        price: item.product.price, 
        quantity: item.quantity,
        
      }));

      const { error: itemsError } = await supabase
        .from("order_items")
        .insert(orderItems);

      if (itemsError) throw itemsError;

      // [C] 장바구니에서 온 주문일 경우, 해당 유저의 장바구니 비우기
      if (isFromCart && orderData.member_id) {
        await this.clearUserCart(orderData.member_id);
      }

      return { success: true, orderId: order.id };
    } catch (error: any) {
      console.error("Order Service Error:", error.message);
      return { success: false, error: error.message };
    }
  },

  /**
   * 2. 장바구니 비우기 (내부 로직)
   */
  async clearUserCart(memberId: string) {
    const { error } = await supabase
      .from("cart")
      .delete()
      .eq("member_id", memberId);
    
    if (error) console.error("Cart Clear Error:", error.message);
  },

  /**
   * 3. 특정 유저의 주문 내역 가져오기
   */
  async getMyOrders(memberId: string) {
    const { data, error } = await supabase
      .from("orders")
      .select(`
        *,
        order_items (
          *,
          product (*)
        )
      `)
      .eq("member_id", memberId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data;
  }
};