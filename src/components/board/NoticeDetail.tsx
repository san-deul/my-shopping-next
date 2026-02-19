// src/components/board/NoticeDetail.tsx
"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
//import BoardButton from "@/components/board/BoardButton";
import styles from "./Notice.module.css";
import type { Notice } from "@/types/notice";
import { useNoticeDetail } from "@/hooks/useNoticeQuery";

interface NoticeDetailProps {
  id: string;
}

export default function NoticeDetail({ id }: NoticeDetailProps) {
  const { data: notice, isLoading, isError } = useNoticeDetail(id);



  if (isLoading) return <p>공지사항을 불러오는 중입니다...</p>;
  if (isError || !notice) return <p>공지사항을 불러오지 못했어요.</p>;

  return (
    <div className="section notice_detail">
      <div className="section_in">
        <table className={styles.noticeViewTable}>
          <tbody>
            <tr>
              <th className={styles.noticeViewHead}>제목</th>
              <td>{notice.title}</td>
            </tr>
            <tr>
              <th className={styles.noticeViewHead}>작성일</th>
              <td>{notice.date}</td>
            </tr>
            <tr>
              <th className={styles.noticeViewHead}>글쓴이</th>
              <td>{notice.user_id || "관리자"}</td>
            </tr>
          </tbody>
        </table>

        <div className="notice_content">
          {Array.isArray(notice.img) && notice.img.length > 0 && (
            <div className="notice_image_wrap">
              {notice.img.map((url, index) => (
                <img
                  key={index}
                  src={url}
                  alt={`${notice.title} 이미지 ${index + 1}`}
                  className="notice_image"
                />
              ))}
            </div>
          )}

          <div className="notice_text">{notice.content}</div>
        </div>

        <div className={styles.btnArea}>

        </div>
      </div>
    </div>
  );
}
