// src/types/notice.ts
export interface Notice {
  id: number;
  user_id: string;
  title: string;
  content: string;
  date: string; // Supabase date는 보통 string(YYYY-MM-DD)로 옴
  img: string[] | null;
  created_at: string | null;
}
