import { reviewService } from '@/api/services/reviewService';
import { Review, ReviewWithProfile } from '@/types/schema';
import { useQuery } from '@tanstack/react-query';


// 1. 전체 리뷰 목록 조회 훅 (관리자 페이지나 메인 피드용)
export const useAllReviews = () => {
  return useQuery<ReviewWithProfile[]>({
    queryKey: ['reviews', 'all'],
    queryFn: () => reviewService.getReviewList(),
  });
};

// 2. 특정 상품의 리뷰 목록 조회 훅 (상품 상세 페이지용)
export const useProductReviews = (productId:number) => {
  return useQuery<ReviewWithProfile[]>({
    queryKey: ['reviews', 'product', productId],
    queryFn: () => reviewService.getReviewsByProductId(productId),
    enabled: !!productId, // productId가 있을 때만 실행하는 안전장치
  });
};