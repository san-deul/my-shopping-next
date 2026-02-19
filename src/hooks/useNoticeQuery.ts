// src/hooks/useNoticeQuery.ts
import { useQuery } from "@tanstack/react-query";
import { noticeService } from "@/api/services/noticeService";
import type { Notice } from "@/types/notice";

export const noticesQueryKey = ["notices"] as const;

export function useNoticeList() {
  return useQuery<Notice[]>({
    // ※ 반환되는건 UseQueryResult<Notice[]> 객체
    /*
      {
      data:Notice[] | undefined,
      isLoading: boolean,
      isError: boolean,
      error: unknown,
      refetch: () => void,
      ...
      }
      Notice 배열이 아니라 Notice 배열을 포함한 상태객체
    */
    queryKey: noticesQueryKey,
    queryFn: noticeService.getNoticeList,
    staleTime: 30 * 1000, // 공지는 자주 안 바뀌면 더 늘려도 됨 (ex 5분)
  });
}

//상세보기
export function useNoticeDetail(id: string) {
  return useQuery<Notice>({
    queryKey: ["notice", id],
    queryFn: () => noticeService.getNoticeDetail(Number(id)),
    enabled: !!id,            // id 있을 때만 실행
    staleTime: 30 * 1000,
  });
}