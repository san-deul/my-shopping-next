import { create } from "zustand";

import { User } from "@supabase/supabase-js"; // 수파베이스 제공 기본 유저 타입
import { supabase } from "../lib/client";
import useCartStore from "./useCartStore";
import { Member } from "@/types/member";
import { memberService } from "@/api/services/memberService";

// 1. 멤버 테이블 데이터 타입 (DTO)


// 2. 스토어 전체 규격 (Interface)
interface AuthState {
  user: User | null;
  member: Member | null;
  loading: boolean;
  setAuth: (user: User | null, member: Member | null) => void;
  setMember: (member: Member | null) => void; 
  initAuth: () => Promise<{ unsubscribe: () => void }>; // 구독 해제 함수 리턴용
  logout: () => Promise<void>;
}

const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  member: null,
  loading: true,

  setAuth: (user, member) => set({ user, member, loading: false }),
  setMember: (member) => set({ member }),

  initAuth: async () => {
    set({ loading: true });

    const { data: { session } } = await supabase.auth.getSession();
    const currentUser = session?.user ?? null;
    
    let memberData: Member | null = null;

    if (currentUser?.email) {
      memberData = await memberService.getMemberByEmail(currentUser.email)
      //await useCartStore.getState().fetchCart(currentUser.id);
    }

    set({ user: currentUser, member: memberData, loading: false });

    const { data: listener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const newUser = session?.user ?? null;
      let newMember: Member | null = null;

      if (newUser?.email) {
        newMember = await memberService.getMemberByEmail(newUser.email);
      }

      set({ user: newUser, member: newMember, loading: false });
    });

    return listener.subscription;
  },

  logout: async () => {
    await supabase.auth.signOut();
    set({ user: null, member: null });
  },
}));

export default useAuthStore;