import Link from "next/link";
import styles from "./navMenus.module.scss";
import useHeaderStore from "../../../store/useHeaderStore";
import { MenuItem } from "../../../types/menu";

interface NavMenusProps{
  menus: MenuItem[];
  isMain :boolean;
}


export default function NavMenus({ menus, isMain } : NavMenusProps) {

  const { openNavMenu, setOpenNavMenu } = useHeaderStore();

  return (
    <ul className={`${styles.pc_menu} ${isMain ? "" :styles.on}`}>
      {menus.map((menu) => (
        <li
          key={menu.key}
          onMouseEnter={menu.children ? () => setOpenNavMenu(menu.key as string) : undefined}
          onMouseLeave={menu.children ? () => setOpenNavMenu(null) : undefined}
        >
          <Link href={menu.href}>{menu.label}</Link>

          {menu.children && (
            <ul
              className={styles.pc_sub_menu}
              style={{ display: openNavMenu === menu.key ? "block" : "none" }}
            >
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
  );
}
