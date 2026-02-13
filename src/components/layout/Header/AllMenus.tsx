"use client";

import Link from "next/link";
import styles from "./allMenus.module.scss";
import { MenuItem } from "../../../types/menu";
import useHeaderStore from "../../../store/useHeaderStore";

// 1. 이 컴포넌트가 받는 데이터의 규격을 선언합니다.
interface AllMenusProps {
  menus: MenuItem[];
}

export default function AllMenus({ menus }: AllMenusProps) {
  // 2. Zustand 스토어에서 상태 추출 (이미 store에서 타입이 정의됨)
  const isAllMenuOpen = useHeaderStore((state) => state.isAllMenuOpen);

  console.log('isAllMenuOpen--->',isAllMenuOpen)

  if (!isAllMenuOpen) return null;

  return (
    <div className={`${styles.pc_allmenu} `}>
      <div className={styles.pc_allmenu_in}>
        <ul>
          {menus.map((menu) => (
            <li key={menu.key}>
              {/* menu.label이 있을 때만 렌더링되도록 처리 */}
              <Link href={menu.href}>{menu.label}</Link>

              {menu.children && (
                <ul>
                  {menu.children.map((child) => (
                    <li key={child.label}>
                      <Link href={child.href}>{child.label}</Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}