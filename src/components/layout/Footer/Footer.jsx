"use client";

import Link from "next/link";
import styles from "./footer.module.scss";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footer_in}>
        {/* 왼쪽 영역 */}
        <div className={styles.f_left}>
        
          <div className={styles.f_num}>
            <strong>070 - 1234 - 1111</strong>
            <p>
              상담시간 09:00 - 18:00<br />
              점심시간 12:00 - 13:00<br />
              주말 및 공휴일 제외
            </p>
          </div>
        </div>

        {/* 오른쪽 영역 */}
        <div className={styles.f_right}>
          <ul className={styles.f_list}>
            <li><Link href="/brandstory">소개</Link></li>
            <li><Link href="/terms">이용약관</Link></li>
            <li><Link href="/product-guide">제품사용법</Link></li>
            <li><Link href="/privacy">개인정보 처리방침</Link></li>
            <li><Link href="/support">고객 지원 센터</Link></li>
          </ul>

          <address>
            <strong>회사명 : GLOWLY</strong> <span className={styles.line}>|</span><br />
            대표이사 : 김OO <span className="styles.line">|</span><br />
            사업자등록번호 : 188-85-01330<br />
            주소 : 서울특별시 중구 세종대로 67 (태평로2가 250)<br />
            통신판매업신고 : 제2025-OOOOO-1223호 <span className={styles.line}>|</span><br />
            개인정보보호 책임자 : <a href="mailto:seleang@naver.com">glowly@email.com</a>
          </address>
        </div>
      </div>

      <p className={styles.copy}>Copyright© GLOWLY. All Rights Reserved.</p>
    </footer>
  );
}
