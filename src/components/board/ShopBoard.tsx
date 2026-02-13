'use client';

import { useCategories } from "@/hooks/useCategories";
import { useAllProducts } from "@/hooks/useProductQuery";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { useMemo, useRef, useEffect } from "react";

import PrdList from "@/components/ProductList/PrdList";
import CategoryList from "@/components/ProductList/Category";
import Pagination from "@/components/common/Pagination";

import type { Product, Category } from "@/types/schema";

const PRODUCTS_PER_PAGE = 8;

export default function ShopBoard({ categoryId }: { categoryId: string }) {


  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const pageParam = searchParams.get("page");
  const currentPage = Number(pageParam) || 1;

  const categoryNumericId =
    Number.isNaN(Number(categoryId)) ? null : Number(categoryId);

  const allProductsRef = useRef<HTMLDivElement>(null);

  // 1) 데이터 패칭
  const { data: products = [] } = useAllProducts();
  const { data: categories = [] } = useCategories();

  // 2) 카테고리 바뀌면 page 쿼리 제거(= 1페이지로 리셋 효과)
  useEffect(() => {

    replace(pathname, { scroll: false });

  }, [categoryId, pathname, replace]);

  // all 화면 전용 섹션 데이터 (빈 배열이면 렌더 안 하려고)
  const bestProducts = useMemo(
    () => products.filter((p) => p.isBest === true),
    [products]
  );
  const newProducts = useMemo(
    () => products.filter((p) => p.isNew === true),
    [products]
  );

  // 3) 필터링 + 페이지네이션
  const filteredData = useMemo(() => {
    let filtered: Product[] = [];
    let selected: Category | null = null;

    if (categoryId === "all") {
      filtered = products;
    } else if (categoryId === "best") {
      filtered = bestProducts;
    } else if (categoryId === "new") {
      filtered = newProducts;
    } else if (categoryNumericId != null) {
      selected = categories.find((c) => Number(c.id) === categoryNumericId) ?? null;

      if (selected) {
        const childIds = categories
          .filter((c) => Number(c.parent_id) === Number(selected!.id))
          .map((c) => Number(c.id));

        if (selected.parent_id == null) {
          filtered = products.filter(
            (p) => p.category != null && childIds.includes(Number(p.category))
          );
        } else {
          filtered = products.filter(
            (p) => Number(p.category) === Number(selected.id)
          );
        }
      }
    }

    // ✅ 원래 코드처럼 best/new는 페이지네이션 제외
    const isPaginatable = !["best", "new"].includes(categoryId);

    const totalPages = isPaginatable
      ? Math.max(1, Math.ceil(filtered.length / PRODUCTS_PER_PAGE))
      : 1;

    const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
    const displayProducts = isPaginatable
      ? filtered.slice(startIndex, startIndex + PRODUCTS_PER_PAGE)
      : filtered;

    return { displayProducts, currentCategory: selected, totalPages };
  }, [
    products,
    categories,
    categoryId,
    categoryNumericId,
    currentPage,
    bestProducts,
    newProducts,
  ]);



  const handlePageChange = (pageNumber: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", pageNumber.toString());
    replace(`${pathname}?${params.toString()}`, { scroll: false });

    if (categoryId === "all" && allProductsRef.current) {
      allProductsRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="section">
      <CategoryList
        categories={categories}
        currentCategory={filteredData.currentCategory}
      />

      {categoryId === "all" && bestProducts.length > 0 && (
        <PrdList title="Best Seller" products={bestProducts} useSwiper />
      )}

      {categoryId === "all" && newProducts.length > 0 && (
        <PrdList title="New" products={newProducts} useSwiper />
      )}

      <div ref={allProductsRef}>
        <PrdList
          title={
            categoryId === "best"
              ? "Best Seller"
              : categoryId === "new"
                ? "New"
                : filteredData.currentCategory?.name || "전체 목록"
          }
          products={filteredData.displayProducts}
          useSwiper={false}
        />
      </div>

      {<Pagination
        currentPage={currentPage}
        totalPages={filteredData.totalPages}
        onPageChange={handlePageChange}
      />}
    </div>
  );
}
