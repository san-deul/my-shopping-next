import { productService } from '@/api/services/productService';
import { Product } from '@/types/schema';
import { useQuery } from '@tanstack/react-query';

export const productsQueryKey = ["products", "all"] as const;

export const useAllProducts = () => {
  return useQuery<Product[]>({
    queryKey: productsQueryKey,
    queryFn: productService.getProductList,
  });
};

