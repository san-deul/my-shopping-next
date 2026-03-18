// src/api/services/cartService.ts
import { supabase } from "@/lib/client";
import { CartItem, Cart } from "@/types/cart"; // 타입 가져오기

export const cartService = {
  // 1. 목록 불러오기: 반환 타입은 UI용 checked가 없는 상태이므로 Omit 사용 혹은 그대로 반환 후 Store에서 가공
  async getCartItems(memberId: string): Promise<CartItem[]> {
    const { data, error } = await supabase
      .from("cart")
      .select("*, products(*)")
      .eq("member_id", memberId)
      .order('created_at', { ascending: false });


    if (error) throw error;
    // UI용 'checked' 필드는 여기서 넣지 않고 Store에서 fetch할 때 넣어주는 게 깔끔합니다.
    return data as unknown as CartItem[];
  },

  // 2. 장바구니 추가
  async addToCart(memberId: string, productId: number, quantity: number = 1): Promise<CartItem> {
    // 1. 먼저 해당 아이템이 이미 있는지 확인합니다.
    const { data: existingItem } = await supabase
      .from("cart")
      .select("*")
      .eq("member_id", memberId)
      .eq("product_id", productId)
      .maybeSingle();

    if (existingItem) {
      // 2. 이미 있다면? 수량만 더해줍니다.
      const { data, error } = await supabase
        .from("cart")
        .update({ quantity: existingItem.quantity + quantity })
        .eq("id", existingItem.id)
        .select("*, products(*)")
        .single();

      if (error) throw error;
      return data as unknown as CartItem;
    } else {
      // 3. 없다면? 새로 추가합니다.
      const { data, error } = await supabase
        .from("cart")
        .insert([{ member_id: memberId, product_id: productId, quantity }])
        .select("*, products(*)")
        .single();

      if (error) throw error;
      return data as unknown as CartItem;
    }
  },

  // 3. 수량 업데이트: 여기서는 product 정보가 굳이 필요 없으므로 CartRow 타입 활용 가능
  async updateQuantity(id: number, quantity: number): Promise<Cart> {
    const { data, error } = await supabase
      .from("cart")
      .update({ quantity })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // 4. 삭제
  async removeItems(ids: number[]) {
    const { error } = await supabase.from("cart").delete().in("id", ids);
    if (error) throw error;
  },
  async clearCart(memberId: string) {
    const { error } = await supabase.from("cart").delete().eq("member_id", memberId);
    if (error) throw error;
  }
};