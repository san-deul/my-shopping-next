import { useQuery } from "@tanstack/react-query";
import { productService } from "@/api/services/productService";
import type { Category } from "@/types/schema";

export const categoriesQueryKey = ["categories"] as const;

export function useCategories() {
  return useQuery({
    queryKey: categoriesQueryKey,
    queryFn: productService.getCategoryList,
    staleTime: 5 * 60 * 1000,  // (5분)
  });
}


/*

staleTime  : 이 시간 동안은 서버에 다시 요청하지 않고, 기존 데이터를 그대로 사용함.



*
※ React Query는 데이터를 이렇게 관리.

데이터를 서버에서 가져옴
캐시에 저장함
일정 시간이 지나면 “오래된 데이터(stale)”로 판단
이때 기준이 되는 시간이 바로 staleTime.

staleTime = “이 시간 동안은 이 데이터를 최신 상태로 보고 서버에 다시 요청하지 않는다”

*/