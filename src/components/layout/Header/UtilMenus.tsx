"use client";

import Link from "next/link";
import styles from "./utilMenus.module.scss";
import Image from "next/image";
import useHeaderStore from "../../../store/useHeaderStore";
import { MenuItem } from "../../../types/menu";

// 2. 이 컴포넌트의 입구(Props) 규격 정하기
interface UtilMenusProps {
  menus: MenuItem[]; // 메뉴들의 배열
  isMain: boolean;   // 메인 페이지 여부
}

export default function UtilMenus({ menus, isMain }: UtilMenusProps) {
  // 3. Zustand 스토어 타입은 이미 useHeaderStore.ts에서 정의했으므로 자동완성됨
  const { openUtilMenu, setopenUtilMenu } = useHeaderStore();

  return (
    <ul className={`${styles.pc_util} ${isMain ? "" : styles.on}`}>
      {menus.map((menu) => (
        <li
          className={styles.pc_utilmy}
          key={menu.key}
          // menu.key가 string | number이므로 안전하게 전달 가능
          onMouseEnter={menu.children ? () => setopenUtilMenu(menu.key as string) : undefined}
          onMouseLeave={menu.children ? () => setopenUtilMenu(null) : undefined}
        >
          <Link href={menu.href}>
            {/* 4. menu.icon이 StaticImageData 타입임을 알기 때문에 에러 없이 렌더링 */}
            {menu.icon && (
              <Image
                src={menu.icon}
                alt={String(menu.key)}
                width={40}
                height={40}
                style={{ objectFit: "cover" }}
              />
            )}
          </Link>

          {menu.children && (
            <ul
              className={styles.pc_utilmy_in}
              style={{ display: openUtilMenu === menu.key ? "block" : "none" }}
            >
              {menu.children.map((child, idx) => (
                <li key={child.key || idx}>
                  {/* 5. onClick이 함수 타입인지 미리 정의했으므로 안전하게 호출 */}
                  {child.onClick ? (
                    <Link
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        child.onClick?.(); // Optional Chaining으로 안전하게 호출
                      }}
                    >
                      {child.label}
                    </Link>
                  ) : (
                    <Link href={child.href}>{child.label}</Link>
                  )}
                </li>
              ))}
            </ul>
          )}
        </li>
      ))}
    </ul>
  );
}