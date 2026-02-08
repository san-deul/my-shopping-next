import Link from "next/link";
import moreBtn from "../../../assets/images/menu_open.png";
import closeBtn from "../../../assets/images/menu_close.png";
import styles from "./mobileMenus.module.scss";

import Image from "next/image";
import useHeaderStore from "../../../store/useHeaderStore";
import { MenuItem } from "../../../types/menu";

interface MobileMenusProps {
  menus:MenuItem[];
}


export default function MobileMenus({
  menus
} : MobileMenusProps) {

  const openSubMenus = useHeaderStore((state) => state.openSubMenus);
  const toggleSubMenu = useHeaderStore((state) => state.toggleSubMenu);
  const closeMobileMenu = useHeaderStore((state) => state.closeAll); // 혹은 toggleMobile

  
  return (
    <ul className={styles.mobile_menu}>
      {menus.map((menu) => {
        const isOpen = openSubMenus.includes(menu.key);
        const hasChildren = !!menu.children;

        return (
          <li key={menu.key}>
            <div
              className={styles.mobile_menu_item}
              onClick={() => hasChildren && toggleSubMenu(menu.key as string)}
            >
              {/* 
                hasChildren이 있으면 단순 텍스트 + 아이콘만,
                없으면 Link로 이동 가능
              */}
              {hasChildren ? (
                <>
                  <span className={styles.menu_label}>{menu.label}</span>
                  <span className={`${styles.more_img} ${isOpen ? "on" : ""}`}>
                    {/*<img
                      src={isOpen ? closeBtn : moreBtn}
                      alt="토글 버튼"
                    />*/}

                    <Image 
                      src={isOpen ? closeBtn : moreBtn}
                      alt="토글버튼"
                    />
                  </span>
                </>
              ) : (
                <Link href={menu.href || "#"} onClick={closeMobileMenu}>
                  {menu.label}
                </Link>
              )}
            </div>

            {/* 서브 메뉴 목록 */}
            {hasChildren && (
              <ul className={`${styles.mobile_sub_menu} ${isOpen ? styles.active : ""}`}>
                {menu.children.map((child) => (
                  <li key={child.label}>
                    <Link href={child.href} onClick={closeMobileMenu}>
                      {child.label}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </li>
        );
      })}
    </ul>
  );
}
