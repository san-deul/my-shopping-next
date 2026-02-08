import { productService } from "@/api/services/productService";
import { reviewService } from "@/api/services/reviewService";
import PrdList from "@/components/ProductList/PrdList";
import ReviewSlider from "@/components/ProductList/ReviewSlider";
import Visual from "@/components/visual/Visual";
import getQueryClient from "@/lib/getQueryClient";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Metadata } from "next"; // Metadata 타입 임포트

// 1. Metadata 타입 정의
export const metadata: Metadata = {
  title: "포트폴리오 쇼핑몰",
  description: "쇼핑몰 첫 화면",
  keywords: ["쇼핑몰", "화장품"],
};

// 2. async 함수인 서버 컴포넌트 타입 (Next.js는 기본적으로 JSX.Element를 반환하는 함수로 인식)
export default async function HomePage() {
  const queryClient = getQueryClient();

  // 제품 데이터 프리페칭
  await queryClient.prefetchQuery({
    queryKey: ["products", "all"],
    queryFn: () => productService.getProductList(), // 화살표 함수 형태로 명시 권장
  });

  // 리뷰 데이터 프리페칭
  await queryClient.prefetchQuery({
    queryKey: ["reviews", "all"],
    queryFn: () => reviewService.getReviewList(),
  });

  return (
    // dehydrate 결과값을 HydrationBoundary에 전달
    <HydrationBoundary state={dehydrate(queryClient)}>
      <main>
        <Visual />
        {/* PrdList 컴포넌트가 PrdListProps 인터페이스를 가지고 있으므로 타입 체크가 작동합니다. */}
        <PrdList 
          title="Best Seller" 
          type="best" 
          showMore={true} 
          moreLink="/shop/best" 
        />
        <PrdList 
          title="New Item" 
          type="new" 
          showMore={true} 
          moreLink="/shop/new" 
        />
        <ReviewSlider 
          title="Review" 
          showMore={true} 
          moreLink="/review" 
        />
      </main>
    </HydrationBoundary>
  );
}