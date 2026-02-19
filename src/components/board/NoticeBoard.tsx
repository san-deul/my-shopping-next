// src/components/board/Notice.tsx
"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import Pagination from "@/components/common/Pagination";
//import BoardButton from "@/components/board/BoardButton";
//import { useNoticeList } from "@/hooks/useNoticeQuery";
import styles from  "./Notice.module.css";
import useAuthStore from "@/store/useAuthStore";
import { useNoticeList } from "@/hooks/useNoticeQuery";

export default function NoticeBoard() {
  const { data: lists = [], isLoading, isError } = useNoticeList();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const { member } = useAuthStore();

  const totalPages = Math.ceil(lists.length / itemsPerPage);

  const currentLists = useMemo(() => {
    const indexOfLast = currentPage * itemsPerPage;
    const indexOfFirst = indexOfLast - itemsPerPage;
    return lists.slice(indexOfFirst, indexOfLast);
  }, [lists, currentPage]);

  const handlePageChange = (pageNum: number) => {
    setCurrentPage(pageNum);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (isLoading) return <div style={{ padding: 20 }}>로딩중...</div>;
  if (isError) return <div style={{ padding: 20 }}>공지사항을 불러오지 못했어요.</div>;

  return (
    <div className="section notice">
      <div className="section_in">
        <table className={styles.noticeTable}>
          <thead>
            <tr>
              <th>번호</th>
              <th>제목</th>
              <th>작성자</th>
              <th>작성일</th>
            </tr>
          </thead>

          <tbody>
            {currentLists.length > 0 ? (
              currentLists.map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td className="title_cell">
                    <Link href={`/notice/${item.id}`}>{item.title}</Link>
                  </td>
                  <td>{item.user_id === "admin" ? "관리자" : item.user_id}</td>
                  <td>{item.date}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4}>등록된 공지사항이 없습니다.</td>
              </tr>
            )}
          </tbody>
        </table>

        {member?.level === 10 && (
          <div className="btn_area" style={{ textAlign: "right", marginTop: 20 }}>
            
          </div>
        )}

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
}
