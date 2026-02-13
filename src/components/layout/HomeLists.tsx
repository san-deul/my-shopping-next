"use client";

import { useAllProducts } from "@/hooks/useProductQuery";
import { useAllReviews } from "@/hooks/useReviewQuery";
import PrdList from "../ProductList/PrdList";
import ReviewSlider from "../ProductList/ReviewSlider";




export default function HomeLists() {


  const { data: products = [] } = useAllProducts(); //✔️ 프리페치로 리액트쿼리에캐시에 올려둔 데이터를 가져옴 
  const { data: reviews = [] } = useAllReviews();


  const bestProducts = products.filter((p) => p.isBest)
  const newProducts = products.filter((p) => p.isNew)


  return (
    <>
      <PrdList
        title="Best Seller"
        products={bestProducts}
        
        showMore
        moreLink="/shop/best"
      />

      <PrdList
        title="New Item"
        products={newProducts}
        showMore
        moreLink="/shop/new"
      />

      <ReviewSlider
        title="Review"
        showMore
        reviews={reviews}
        moreLink="/review"
      // reviews={reviews}  // (ReviewSlider를 UI 전용으로 바꾸면 이렇게)
      />
    </>
  )

}