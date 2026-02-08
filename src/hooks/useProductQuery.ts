import { productService } from '@/api/services/productService';
import { Product } from '@/types/schema';
import { useQuery } from '@tanstack/react-query';


// 1. 전체 리뷰 목록 조회 훅 (관리자 페이지나 메인 피드용)
export const useAllProducts = () => {
  return useQuery<Product[]>({
    queryKey: ['products', 'all'],
    queryFn: () => productService.getProductList(),
  });
};

