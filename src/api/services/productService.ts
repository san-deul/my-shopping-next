// productService.ts (예시)
import { supabase } from "@/lib/supabase";
import type { Category, Product } from "@/types/schema";

export const productService = {

  async getCategoryList(): Promise<Category[]> {
    const { data, error } = await supabase.from("category").select("*");
    if (error) throw error;

    return (data ?? []).map((c: any) => ({
      id: Number(c.id),
      name: c.name,
      parent_id: c.parent_id == null ? null : Number(c.parent_id),
    }));
  },

  async getProductList(): Promise<Product[]> {
    const { data, error } = await supabase.from("products").select("*");
    if (error) throw error;

    return (data ?? []).map((p: any) => ({
      ...p,
      id: Number(p.id),
      category: p.category == null ? null : Number(p.category),
      // isBest/isNew가 null일 수 있으니 아래에서 boolean 처리할 수도 있음(선택)
      // isBest: Boolean(p.isBest),
      // isNew: Boolean(p.isNew),
    }));
  },

  async getProductById(id: number | string): Promise<Product> {
    const numericId = typeof id === 'string' ? Number(id) : id;

    if (isNaN(numericId)) {
      console.error("Invalid ID passed to getProductById:", id);
      return null;
    }


    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("id", id) // 딱 필요한 것만 필터링!
      .single();

    if (error){
      console.error("Error fetching product by ID:", error.message);
      return null;
    }
    return {
      ...data,
      id: Number(data.id),
      category: data.category == null ? null : Number(data.category),
    };
  },



};
