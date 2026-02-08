import { supabase } from '@/lib/supabase';
import { Product } from '@/types/schema';

export const productService = {
  /**
   * 전체 상품 목록 불러오기
   * @returns Promise<Product[]> - 상품 배열을 반환함을 명시
   */
  async getProductList(): Promise<Product[]> {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      

    if (error) {
      console.error("상품 로드 에러:", error.message);
      throw error;
    }

    // Supabase의 data는 기본적으로 Product[] | null 타입이므로 
    // 빈 배열을 기본값으로 주어 안정성을 높입니다.
    return (data as Product[]) || [];
  }
};