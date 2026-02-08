// app/(home)/layout.tsx
"use client"; // 💡 CSR

import { usePathname } from "next/navigation"; // useLocation 대신 사용
import { useEffect, useState } from "react";
//import Header from "@/components/Header/Header";
//import SubTitle from "@/components/SubTitle/SubTitle";
import { LoadingProvider } from "@/context/LoadingContext";
import  SubTitle  from "@/components/layout/SubTitle/SubTitle";
import  Footer  from "@/components/layout/Footer/Footer";
import Header from "@/components/layout/Header/Header";

 
export default function HomeLayout({children}) {
  const pathname = usePathname();
  const isMainPage = pathname === '/';

  const [scrolled, setScrolled] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isAllMenuOpen, setIsAllMenuOpen] = useState(false);

  // 스크롤 핸들러는 기존과 동일하게 유지
  /*
  const handleScroll = () => {
    if (window.scrollY > 120) setScrolled(true);
    else setScrolled(false);
  };

  useEffect(() => {
    if (isMainPage) {
      window.addEventListener('scroll', handleScroll);
    }
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isMainPage]);

  let dynamicClass = isMainPage 
    ? (scrolled || isAllMenuOpen || isHovered ? "" : "main-header") 
    : "sub-header";
    
  const contentClass = isMainPage ? 'main-content' : 'subpage-content';*/

  return (
    <LoadingProvider>
      <Header
        //className={dynamicClass}
        //nMouseEnter={() => setIsHovered(true)}
        //onMouseLeave={() => setIsHovered(false)} 
        // onAllMenuToggle={setIsAllMenuOpen} 
      />

      <main className={`content-area `}>
        {<SubTitle />}
        {children} {/* 💡 Outlet 대신 children이 들어옵니다! */}
      </main>

     <Footer />
    </LoadingProvider>
  );
}