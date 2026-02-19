// src/app/notice/[id]/page.tsx

import { noticeService } from "@/api/services/noticeService";
import NoticeDetail from "@/components/board/NoticeDetail";
import { useNoticeList } from "@/hooks/useNoticeQuery";



export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  /* 
  서버에서 실행됨.. Reqcut Query 없음. 훅 사용불가 
  */
  const { id } = await params;
  const notices = await noticeService.getNoticeList();
  const notice = notices.find(n => n.id === Number(id))
  return {
    title: `${notice?.title || "공지사항"} -`,
    description: notice?.title,
  };
}

type PageProps = {
  params: Promise<{ id: string }>;
};
export default async function NoticeDetailPage({ params }: PageProps) {
  const { id } = await params;
  return <NoticeDetail id={id} />;
}
