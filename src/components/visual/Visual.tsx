"use client";

import React, { useRef } from 'react';
import Image, { StaticImageData } from 'next/image'; // StaticImageData 타입 추가
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import { Swiper as SwiperType } from 'swiper/types'; // Swiper 타입 임포트

// 스타일 import
import 'swiper/css';
import 'swiper/css/navigation';
import styles from "./visual.module.scss";

// 이미지 import
import v1 from "@/assets/images/visual1.png";
import v2 from "@/assets/images/visual2-1.png";
import btnLeft from "@/assets/images/slide_left.png";
import btnRight from "@/assets/images/slide_right.png";

// 1. 슬라이드 데이터 타입 정의
interface VisualSlide {
  id: number;
  src: StaticImageData; // Next.js 로컬 이미지 타입
  alt: string;
}

const visualImages: VisualSlide[] = [
  { id: 1, src: v1, alt: "비주얼 슬라이드 2" },
  { id: 2, src: v2, alt: "비주얼 슬라이드 3" },
];

export default function Visual() {
  // 2. Swiper 인스턴스를 위한 Ref 타입 지정
  // 초기값은 null이고, SwiperType이 담길 것임을 명시
  const swiperRef = useRef<SwiperType | null>(null); 

  return (
    <div className={`${styles.visual} ${styles.v_pc}`}>
      <Swiper
        modules={[Navigation, Autoplay]}
        navigation={false} 
        autoplay={{ delay: 2500, disableOnInteraction: false }} 
        loop={true}
        className={`${styles.mySwiper} ${styles.visualSwiper}`}
        onSwiper={(swiper) => {
          // Swiper가 초기화될 때 ref에 할당
          swiperRef.current = swiper;
        }}
      >
        {visualImages.map((image, index) => (
          <SwiperSlide key={image.id}>
            <Image 
              src={image.src} 
              alt={image.alt} 
              priority={index === 0} // 첫 번째 이미지만 우선순위 로딩 (LCP 최적화)
              width={1920}
              height={600}
              style={{ width: '100%', height: 'auto' }}
            />
          </SwiperSlide>
        ))}
      </Swiper>

      <div className={styles.swiperButton}>
        {/* 3. 옵셔널 체이닝(?.)을 사용하여 안전하게 메서드 호출 */}
        <button 
          className={styles.swiperButtonPrev} 
          onClick={() => swiperRef.current?.slidePrev()}
          aria-label="이전 슬라이드"
        >
          <Image src={btnLeft} alt="" width={50} height={50} />
        </button>
        <button 
          className={styles.swiperButtonNext} 
          onClick={() => swiperRef.current?.slideNext()}
          aria-label="다음 슬라이드"
        >
          <Image src={btnRight} alt="" width={50} height={50} />
        </button>
      </div>
    </div>
  );
}