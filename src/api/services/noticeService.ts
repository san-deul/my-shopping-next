// src/api/services/noticeService.ts
import { supabase } from "@/lib/supabase";
import type { Notice } from "@/types/notice";

export const noticeService = {
  async getNoticeList(): Promise<Notice[]> {
    const { data, error } = await supabase
      .from("notices")
      .select("*")
      .order("id", { ascending: false });

    if (error) throw error;

    // ✅ 정규화: DB응답을 그대로 쓰지 않고 타입에 맞게 가공
    return (data ?? []).map((n: any) => ({
      id: Number(n.id),
      user_id: String(n.user_id),
      title: String(n.title),
      content: String(n.content),
      date: String(n.date),
      img: Array.isArray(n.img) ? n.img.map(String) : null,
      created_at: n.created_at ?? null,
    }));
  },
  async getNoticeDetail(id: number): Promise<Notice> {
    const { data, error } = await supabase
      .from("notices")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;

    // ✅ 정규화
    return {
      id: Number(data.id),
      user_id: String(data.user_id),
      title: String(data.title),
      content: String(data.content),
      date: String(data.date),
      img: Array.isArray(data.img) ? data.img.map(String) : null,
      created_at: data.created_at ?? null,
    };
  },
};
