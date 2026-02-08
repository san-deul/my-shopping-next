// types/menu.ts
import { StaticImageData } from "next/image"; // 이미지 타입을 위한 라이브러리

export interface MenuItem {
  // 1. key는 문자열일 수도, 숫자일 수도 있음 (자바의 Object 같은 느낌)
  key?: string | number; 
  
  // 2. label은 어떤 건 있고 어떤 건 없으니 '?' (Optional)
  label?: string; 
  
  // 3. 반드시 있어야 하는 값
  href?: string; 
  
  // 4. 아이콘 (Import한 이미지 파일 타입)
  icon?: StaticImageData; 
  
  // 5. 장바구니 숫자 같은 특수 데이터
  badge?: number; 
  
  // 6. 자식 메뉴 (자바의 Recursive 구조: List<MenuItem> children)
  children?: MenuItem[]; 
  
  // 7. 로그아웃처럼 클릭 시 실행할 함수
  onClick?: () => void; 
}