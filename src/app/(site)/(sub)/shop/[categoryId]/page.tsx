
import { productService } from "@/api/services/productService";
import ShopBoard from "@/components/board/ShopBoard";
import getQueryClient from "@/lib/getQueryClient";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";


export default async function Page({ params }: { params: Promise<{ categoryId: string }> }) {
  const { categoryId } = await params;

  const qc = getQueryClient();

  // 제품 데이터 프리페칭
  await qc.prefetchQuery({
    queryKey: ["products", "all"],
    queryFn: () => productService.getProductList(), // 화살표 함수 형태로 명시 권장
  });

  // 카테고리 프리페칭
  await qc.prefetchQuery({
    queryKey: ["categories", "all"],
    queryFn: () => productService.getCategoryList(), // 화살표 함수 형태로 명시 권장
  });


  return (
    <HydrationBoundary state={dehydrate(qc)}>
      <div className="section">
        <ShopBoard categoryId={categoryId} />
      </div>
    </HydrationBoundary>
  );
}
