import Link from "next/link";
import styles from "./MyPage.module.scss"

const MENUS = [
  { label: "🧾 주문내역", path: "/mypage/orders" },
  { label: "🛒 장바구니", path: "/cart" },
  { label: "✍️ 작성후기", path: "/mypage/reviews" },
  { label: "📩 문의내역", path: "/mypage/inquiries" },
] as const;

export default function MyPageMenu() {
  return (
    <section className={styles.mypageMenu}>
      <ul>
        {MENUS.map((menu) => (
          <li key={menu.path}>
            <Link href={menu.path}>{menu.label}</Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
