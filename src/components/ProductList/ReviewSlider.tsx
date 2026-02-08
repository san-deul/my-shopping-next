"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";

// Swiper 스타일
import "swiper/css";
import "swiper/css/pagination";

import { useAllReviews } from "@/hooks/useReviewQuery";
import noimage from "@/assets/images/noimage.jpg"; 
import moreBtn from "@/assets/images/plus_btn.png";
import styles from "./reviewSlider.module.scss";

// 1. Props 타입 정의
interface ReviewSliderProps {
  title: string;
  showMore?: boolean;
  moreLink?: string;
}

export default function ReviewSlider({ 
  title, 
  showMore = false, 
  moreLink = "#" 
}: ReviewSliderProps) {
  
  // useAllReviews 훅에서 반환하는 데이터는 ReviewWithProfile[] 타입입니다.
  const { data: reviews = [] } = useAllReviews();

  // 2. 아이디 마스킹 함수 타입 지정
  const maskId = (id: string | null): string => {
    if (!id) return "****";
    const visibleLength = 2;
    if (id.length <= visibleLength) return id + "*";
    return id.substring(0, visibleLength) + "*".repeat(id.length - visibleLength);
  };

  return (
    <div className="section_in">
      <div className={styles.swiperWrap}>
        <div className={styles.titleArea}> {/* styles 적용 확인 */}
           <p className="title">{title}</p>
           {showMore && (
            <div className={styles.mainMore}>
              <Link href={moreLink}>
                <Image src={moreBtn} alt="더보기" width={16} height={16} />
              </Link>
            </div>
           )}
        </div>

        <section className={styles.reviewSliderWrap}>
          <Swiper
            slidesPerView={3}
            spaceBetween={30}
            pagination={{ clickable: true }}
            modules={[Pagination]}
            className="review-slider"
            breakpoints={{
              320: { slidesPerView: 1, spaceBetween: 16 },
              768: { slidesPerView: 2, spaceBetween: 24 },
              1200: { slidesPerView: 4, spaceBetween: 30 },
            }}
          >
            {reviews.map((review) => (
              <SwiperSlide key={review.id}>
                <div className={styles.reviewCard}>
                  <div className={styles.reviewImage} style={{ position: 'relative', height: '200px' }}>
                    <Image 
                      src={review.img || noimage} 
                      alt={review.title || "리뷰 이미지"}
                      fill 
                      style={{ objectFit: 'cover' }}
                      sizes="(max-width: 768px) 100vw, 25vw"
                    />
                  </div>
                  <div className={styles.reviewContent}>
                    <h3 className={styles.reviewTitle}>{review.title}</h3>
                    <p className={styles.reviewText}>{review.content}</p>
                    <div className={styles.reviewFooter}>
                      <span className={styles.reviewWriter}>
                        {/* profiles 조인 데이터를 쓴다면 아래처럼 활용 가능합니다 */}
                        {review.profiles?.display_name || maskId(review.user_id)}
                      </span>
                      <span className={styles.reviewDate}>
                        {review.date}
                      </span>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </section>
      </div>
    </div>
  );
}