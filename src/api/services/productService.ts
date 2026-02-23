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

    }));
  },

  async getProductById(id: number | string): Promise<Product | null> {
    const numericId = typeof id === 'string' ? Number(id) : id;

    if (isNaN(numericId)) {
      console.error("Invalid ID passed to getProductById:", id);
      return null;
    }
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("id", numericId)
      .single();

    if (error) {
      console.error("Error fetching product by ID:", error.message);
      return null;
    }
    return {
      ...data,
      id: Number(data.id),
      category: data.category == null ? null : Number(data.category),
    };
  },

  async getProductsByIds(ids: number[]): Promise<Product[]> {
    if (ids.length === 0) return [];

    const { data, error } = await supabase
      .from("products")
      .select("*")
      .in("id", ids);

    if (error) throw error;

    return (data ?? []).map((p: any) => ({
      ...p,
      id: Number(p.id),
      category: p.category == null ? null : Number(p.category),
    }));
  },



};
