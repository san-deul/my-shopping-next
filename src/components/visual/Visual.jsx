"use client"; // 1. 필수: Swiper와 useRef는 브라우저 전용이므로 선언 필요

import React, { useRef } from 'react';
import Image from 'next/image'; // 2. 필수: Next.js 최적화 이미지 컴포넌트
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';

// 스타일 import
import 'swiper/css';
import 'swiper/css/navigation';
import styles from "./visual.module.scss"

// 3. 이미지 경로는 public 폴더에 넣고 절대 경로를 사용하는 것이 관리하기 편합니다.
// 만약 기존처럼 assets 폴더를 쓰신다면 import 형식을 유지하되 Image 컴포넌트에 할당합니다.
import v1 from "@/assets/images/visual1.png";
import v2 from "@/assets/images/visual2-1.png";
import btnLeft from "@/assets/images/slide_left.png";
import btnRight from "@/assets/images/slide_right.png";

const visualImages = [
  { id: 1, src: v1, alt: "비주얼 슬라이드 2" },
  { id: 2, src: v2, alt: "비주얼 슬라이드 3" },
];

export default function Visual() {
  const swiperRef = useRef(null); 

  return (
    <div className={`${styles.visual} ${styles.v_pc}`}>
      <Swiper
        modules={[Navigation, Autoplay]}
        navigation={false} 
        autoplay={{ delay: 2500, disableOnInteraction: false }} 
        loop={true}
        className={`${styles.mySwiper} ${styles.visualSwiper}`}
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
        }}
      >
        {visualImages.map((image) => (
          <SwiperSlide key={image.id}>
            {/* 4. img 태그 대신 Next.js <Image /> 사용 */}
            <Image 
              src={image.src} 
              alt={image.alt} 
              priority // LCP(가장 큰 이미지) 최적화를 위해 첫 슬라이드에 권장
              width={1920} // 원본 비율에 맞춰 설정
              height={600}
              style={{ width: '100%', height: 'auto' }}
            />
          </SwiperSlide>
        ))}
      </Swiper>

      <div className={styles.swiperButton}>
        <button className={styles.swiperButtonPrev} onClick={() => swiperRef.current?.slidePrev()}>
          <Image src={btnLeft} alt="이전 슬라이드" width={50} height={50} />
        </button>
        <button className={styles.swiperButtonNext} onClick={() => swiperRef.current?.slideNext()}>
          <Image src={btnRight} alt="다음 슬라이드" width={50} height={50} />
        </button>
      </div>
    </div>
  );
}