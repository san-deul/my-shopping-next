import { productService } from "@/api/services/productService";
import { reviewService } from "@/api/services/reviewService";
import HomeLists from "@/components/layout/HomeLists";
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


/*
 서버에서 데이터 프리페칭을 통해 미리 데이터를 받아서 
 클라이언트 컴포넌트로 넘김.. (로딩..) 같은 것이 뜨지 않게끔.

*/



export default async function HomePage() {
  const qc = getQueryClient();

  // 제품 데이터 프리페칭
  await qc.prefetchQuery({
    queryKey: ["products", "all"],
    queryFn: () => productService.getProductList(), // 화살표 함수 형태로 명시 권장
  });

  // 리뷰 데이터 프리페칭
  await qc.prefetchQuery({
    queryKey: ["reviews", "all"],
    queryFn: () => reviewService.getReviewList(),
  });


  /*
   ✔️1. 서버에서 이미 데이터를 받아서 Reqct Query 캐시에 넣어둠 
  */

  return (
    //✔️ 2. 캐시를 클라이언트로 전달 
    <HydrationBoundary state={dehydrate(qc)}>  
      <main>
        <Visual />
        <HomeLists />
      </main>
    </HydrationBoundary>
  );
}


