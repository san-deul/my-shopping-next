import { supabase } from '@/lib/supabase';
import { Review, ReviewWithProfile } from '@/types/schema';

export const reviewService = {
  // 전체 리뷰 불러오기
  async getReviewList(): Promise<ReviewWithProfile[]> {
    const { data, error } = await supabase
      .from("reviews")
      .select("*")
      .order("id", { ascending: false });

    if (error) throw error;
    return (data as ReviewWithProfile[]) || [];
  },

  // 1. 특정 상품의 리뷰 불러오기 (프로필 조인)
  async getReviewsByProductId(productId: number): Promise<ReviewWithProfile[]> {
    const { data, error } = await supabase
      .from('reviews')
      .select(`
        *,
        profiles ( display_name, avatar_url )
      `) // 주의: 문자열 내부에 절대 주석(//)을 넣지 마세요!
      .eq('product_id', productId)
      .order('id', { ascending: false });

    if (error) throw error;
    // unknown을 거쳐서 우리가 정의한 확장 타입으로 단언합니다.
    return (data as unknown as ReviewWithProfile[]) || [];
  },

  // 2. 리뷰 등록
  // reviewData는 id를 제외한 나머지 필드임을 Omit으로 정의
  async createReview(reviewData: Omit<Review, 'id' | 'created_at'>): Promise<Review> {
    const { data, error } = await supabase
      .from('reviews')
      .insert([reviewData])
      .select();

    if (error) throw error;
    return data[0] as Review;
  },

  // 3. 리뷰 수정
  // updateData는 Review의 필드 중 일부만 있어도 되므로 Partial 사용
  async updateReview(reviewId: number, updateData: Partial<Review>): Promise<Review> {
    const { data, error } = await supabase
      .from('reviews')
      .update(updateData)
      .eq('id', reviewId)
      .select();

    if (error) throw error;
    return data[0] as Review;
  },

  // 4. 리뷰 삭제
  async deleteReview(reviewId: number): Promise<boolean> {
    const { error } = await supabase
      .from('reviews')
      .delete()
      .eq('id', reviewId);

    if (error) throw error;
    return true;
  }
};