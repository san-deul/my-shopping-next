"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";

// 하위 컴포넌트들 (이미 TSX로 변환됨)
import AllMenus from "./AllMenus";
import NavMenus from "./NavMenus";
import UtilMenus from "./UtilMenus";
import MobileMenus from "./MobileMenus";
import MobileUtil from "./MobileUtil";

// 데이터 및 스토어


 // 인터페이스 가져오기

import styles from "./header.module.scss";
import useAuthStore from "../../../store/useAuthStore";
import useHeaderStore from "../../../store/useHeaderStore";
import { MenuItem } from "../../../types/menu";
import { allMenus, mobileMenus, navMenus, utilMenus } from "../../../data/menuData";

export default function Header() {
  const pathname = usePathname();
  const isMainPage = pathname === "/";
  
  // AuthStore 타입 적용됨
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  // HeaderStore 타입 적용됨
  const isAllMenuOpen = useHeaderStore((state) => state.isAllMenuOpen);
  const isMobileOpen = useHeaderStore((state) => state.isMobileOpen);
  const toggleAllMenu = useHeaderStore((state) => state.toggleAllMenu);
  const toggleMobile = useHeaderStore((state) => state.toggleMobile);
  const closeAll = useHeaderStore((state) => state.closeAll);

  const [scrolled, setScrolled] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    closeAll();
  }, [pathname, closeAll]);

  useEffect(() => {
    if (isMobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.removeProperty("overflow");
    }
  }, [isMobileOpen]);

  useEffect(() => {
    if (!isMainPage) {
      setScrolled(false);
      return;
    }
    const handleScroll = () => {
      setScrolled(window.scrollY > 120);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isMainPage]);

  const handleLogout = async () => {
    if (confirm("로그아웃 하시겠습니까?")) {
      await logout();
      alert("로그아웃 되었습니다.");
    }
  };

  // 1. 유저 상태에 따른 유틸 메뉴 동적 생성 (타입 지정 필수!)
  const dynamicUtilMenus: MenuItem[] = useMemo(() => {
    return utilMenus.map((menu) => {
      if (menu.key !== "my") return menu;
      return {
        ...menu,
        children: !user
          ? [
              { key: "join", label: "회원가입", href: "/join" },
              { key: "login", label: "로그인", href: `/login?from=${pathname}` },
            ]
          : [
              { key: "mypage", label: "마이페이지", href: "/mypage" },
              { key: "logout", label: "로그아웃", href: "#", onClick: handleLogout },
            ],
      };
    });
  }, [user, pathname]);

  const headerToneClass = useMemo(() => {
    if (!isMainPage || scrolled || isAllMenuOpen || isHovered) return styles.subHeader;
    return styles.mainHeader;
  }, [isMainPage, scrolled, isAllMenuOpen, isHovered]);

  const isMain = headerToneClass === styles.mainHeader;

  return (
    <header
      className={`${styles.pc_header} ${headerToneClass}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={styles.header_in}>
        {/* 모바일 햄버거 버튼 */}
        <div
          className={`${styles.mobile_btn} ${isMobileOpen ? styles.on : ""}`}
          onClick={toggleMobile}
        >
          <span className={styles.b}></span>
          <span className={styles.t}></span>
          <span className={styles.n}></span>
        </div>

        <Link href="/" className={styles.logo}>
          <h1>
            <Image src="/images/logo.png" alt="logo" width={180} height={60} priority />
          </h1>
        </Link>

        <div className={styles.pc_header_nav}>
          <div
            className={`${styles.pc_btn} ${isAllMenuOpen ? styles.on : ""}`}
            onClick={toggleAllMenu}
          >
            <span className={styles.b}></span>
            <span className={styles.t}></span>
            <span className={styles.n}></span>
          </div>

          {/* 2. 하위 컴포넌트들에 메뉴 데이터 전달 (이미 인터페이스로 보호받고 있음) */}
          <NavMenus menus={navMenus} isMain={isMain} />
          <UtilMenus menus={dynamicUtilMenus} isMain={isMain} />
        </div>

        <div className={`${styles.mobile_open} ${isMobileOpen ? styles.active : ""}`}>
          <div className={styles.open_in}>
            <MobileMenus menus={mobileMenus} />
            <MobileUtil closeMobileMenu={closeAll} />
          </div>
        </div>
      </div>

      <AllMenus menus={allMenus} />
    </header>
  );
}