import { create } from "zustand";

import { User } from "@supabase/supabase-js"; // 수파베이스 제공 기본 유저 타입
import { supabase } from "../lib/supabase";

// 1. 멤버 테이블 데이터 타입 (DTO)
interface MemberData {
  email: string;
  name: string;
  level: number;
}

// 2. 스토어 전체 규격 (Interface)
interface AuthState {
  user: User | null;
  member: MemberData | null;
  loading: boolean;
  setAuth: (user: User | null, member: MemberData | null) => void;
  fetchMemberData: (email: string) => Promise<MemberData | null>;
  initAuth: () => Promise<{ unsubscribe: () => void }>; // 구독 해제 함수 리턴용
  logout: () => Promise<void>;
}

const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  member: null,
  loading: true,

  setAuth: (user, member) => set({ user, member, loading: false }),

  fetchMemberData: async (email) => {
    const { data, error } = await supabase
      .from("member")
      .select("email, name, level")
      .eq("email", email)
      .single();

    if (!error && data) return data as MemberData; // 강제 형변환(Casting)
    return null;
  },

  initAuth: async () => {
    set({ loading: true });

    const { data: { session } } = await supabase.auth.getSession();
    const currentUser = session?.user ?? null;
    
    let memberData: MemberData | null = null;
    if (currentUser?.email) {
      memberData = await get().fetchMemberData(currentUser.email);
    }

    set({ user: currentUser, member: memberData, loading: false });

    const { data: listener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const newUser = session?.user ?? null;
      let newMember: MemberData | null = null;

      if (newUser?.email) {
        newMember = await get().fetchMemberData(newUser.email);
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