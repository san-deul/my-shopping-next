import { supabase } from "@/lib/supabase";
import { memberSchema, type Member } from "@/types/member"; // 경로는 너 프로젝트에 맞춰 수정

export const memberService = {
  async getCurrentUser() {
    const { data, error } = await supabase.auth.getUser();
    if (error) throw error;
    return data.user; // User | null
  },

  async getMemberById(id: string): Promise<Member> {
    const { data, error } = await supabase
      .from("member")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;

    // ✅ zod로 런타임 검증 + 타입 확정
    return memberSchema.parse(data);
  },


  async getMemberByEmail(email: string): Promise<Member | null> {
    const { data, error } = await supabase
      .from("member")
      .select("*")
      .eq("email", email)
      .single();

    if (error) return null;

    return memberSchema.parse(data);
  },
  async updateMember(
    id: string,
    updateData: Partial<Member>
  ): Promise<Member> {
    const { data, error } = await supabase
      .from("member")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    return memberSchema.parse(data);
  },


};

