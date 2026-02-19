// src/app/notice/page.tsx

import NoticeBoard from "@/components/board/NoticeBoard";
import { Metadata } from "next";


export const metadata: Metadata = {
  title: "공지게시판",
  description: "공지게시판 화면",
  keywords: ["공지",],
};


export default function NoticePage() {
  return <NoticeBoard />;
}
