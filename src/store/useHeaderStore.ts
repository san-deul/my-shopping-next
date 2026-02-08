import { create } from "zustand";

// 1. 스토어의 규격 정의 (자바의 Interface 역할)
interface HeaderState {
  // 상태 (Fields)
  isAllMenuOpen: boolean;
  openNavMenu: string | null;
  openUtilMenu: string | null;
  isMobileOpen: boolean;
  openSubMenus: (string | number)[]; // 문자열이나 숫자가 섞인 배열

  // 액션 (Methods)
  toggleAllMenu: () => void;
  toggleMobile: () => void;
  toggleSubMenu: (key: string | number) => void;
  setOpenNavMenu: (key: string | null) => void;
  setopenUtilMenu: (key: string | null) => void;
  closeAll: () => void;
}

// 2. 실제 스토어 생성 (자바의 Implementation 역할)
// create<HeaderState> 처럼 제네릭을 붙여주는 게 핵심입니다!
const useHeaderStore = create<HeaderState>((set) => ({
  // 초기값 설정
  isAllMenuOpen: false,
  openNavMenu: null,
  openUtilMenu: null,
  isMobileOpen: false,
  openSubMenus: [],

  // 로직 구현
  toggleAllMenu: () => set((state) => ({ isAllMenuOpen: !state.isAllMenuOpen })),
  
  toggleMobile: () => set((state) => ({ isMobileOpen: !state.isMobileOpen })),
  
  toggleSubMenu: (key) => set((state) => ({
    openSubMenus: state.openSubMenus.includes(key)
      ? state.openSubMenus.filter((k) => k !== key)
      : [...state.openSubMenus, key]
  })),

  setOpenNavMenu: (key) => set({ openNavMenu: key }),
  
  setopenUtilMenu: (key) => set({ openUtilMenu: key }),
  
  closeAll: () => set({ 
    isAllMenuOpen: false, 
    isMobileOpen: false, 
    openSubMenus: [] 
  }),
}));

export default useHeaderStore;