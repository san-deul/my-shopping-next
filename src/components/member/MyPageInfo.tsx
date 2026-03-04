"use client";

import type { User } from "@supabase/supabase-js";
import type { Member } from "@/types/member";
import useAuthStore from "@/store/useAuthStore";
import styles from "../member/MyPage.module.scss"
import CommonBtn from "../common/CommonBtn";


export default function MyPageInfo() {

  const user = useAuthStore((state) => state.user);
  const member = useAuthStore((state) => state.member);
  const loading = useAuthStore((state) => state.loading)

  if (loading) return <div>로딩중...</div>;
  if (!member) return <div>회원 정보 없음</div>;
  console.log('member-->', member)

  //const levelLabel = member.level === 10 ? "관리자" : "일반회원";

  return (
    <section className={styles.mypageHeader}>
      <div className={styles.mypageInfo}>
        <div className={styles.mypageProfile}>
          <p>{member.name} 님의 마이페이지입니다</p>
          <p>ID: {user.email}</p>
          <p>
            회원등급: {
              member?.level === 1
                ? "일반회원"
                : member?.level === 10
                  ? "관리자"
                  : "일반회원"  // 기본값
            }

          </p>
        </div>

        <CommonBtn 
          href="/mypage/modify" 
          label="내 정보 변경" />
      </div>
    </section>
  );
}
