"use client";

import React, { useRef, useMemo, useState } from "react";
import Link from "next/link";
import Image, { StaticImageData } from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation } from 'swiper/modules';
import type { Swiper as SwiperCore } from 'swiper';

import "swiper/css";
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import styles from "./prdList.module.scss";

// 이미지들
import moreBtn from "@/assets/images/plus_btn.png";
import btnLeft from "@/assets/images/slide_left2.png";
import btnRight from "@/assets/images/slide_right2.png";
import noimage from "@/assets/images/noimage.jpg";

import { useAllProducts } from "@/hooks/useProductQuery";
import { Product } from "@/types/schema";

// 1. Props 타입 정의
interface PrdListProps {
  title: string;
  type?: "best" | "new" | "all"; // 특정 타입만 허용
  useSwiper?: boolean;
  showMore?: boolean;
  moreLink?: string;
}

// 2. 내부 컴포넌트 ProductItem의 Props 타입
interface ProductItemProps {
  item: Product;
  noimage: StaticImageData;
}

// 내부 상품 아이템 컴포넌트
const ProductItem = ({ item, noimage }: ProductItemProps) => {
  // src가 null일 수 있으므로 string | StaticImageData 타입 허용
  const [imgSrc, setImgSrc] = useState<string | StaticImageData>(item.image?.trim() || noimage);

  return (
    <div>
      <div className={styles.itemImg}>
        <Link href={`/item/${item.id}`}>
          <Image
            src={imgSrc}
            alt={item.name}
            width={300}
            height={400}
            className="object-cover"
            onError={() => setImgSrc(noimage)}
          />
        </Link>
      </div>
      <div className={styles.itemTxt}>
        <p className={styles.iTitle}>
          <Link href={`/item/${item.id}`}>{item.name}</Link>
        </p>
        <div className={styles.iPrice}>
          {item.originalPrice && (
            <div className={styles.iPrice1}>
              <span>{item.originalPrice.toLocaleString()}</span>원
            </div>
          )}
          <div className={styles.iPrice2}>
            <span>{item.price.toLocaleString()}</span>원
          </div>
        </div>
      </div>
    </div>
  );
};

export default function PrdList({ 
  title, 
  type = "all", 
  useSwiper = false, 
  showMore = false, 
  moreLink = "#" 
}: PrdListProps) {

  const { data: products = [] } = useAllProducts();
  const [_, setInit] = useState(false);

  // 필터링 로직에 타입 적용
  const filteredProducts = useMemo(() => {
    if (type === "best") return products.filter(p => p.isBest);
    if (type === "new") return products.filter(p => p.isNew);
    return products;
  }, [products, type]);

  // 3. Swiper Dom Ref 타입 지정 (HTMLDivElement)
  const prevRef = useRef<HTMLDivElement>(null);
  const nextRef = useRef<HTMLDivElement>(null);
  const paginationRef = useRef<HTMLDivElement>(null);

  return (
    <section className="section_in">
      <div className={styles.title_area}>
        <p className="title">{title}</p>
        {showMore && (
          <div className={styles.mainMore}>
            <Link href={moreLink}>
              <Image src={moreBtn} alt="더보기" width={16} height={16} />
            </Link>
          </div>
        )}
      </div>

      {useSwiper ? (
        <div className={styles.swiper_wrap}>
          <Swiper
            modules={[Pagination, Navigation]}
            slidesPerView={1.5}
            spaceBetween={10}
            breakpoints={{
              768: { slidesPerView: 3.8, spaceBetween: 20 },
              1023: { slidesPerView: 4, spaceBetween: 20 },
            }}
            onInit={(swiper: SwiperCore) => {
              // 커스텀 네비게이션 연결 (타입 안전성 확보)
              if (swiper.params.navigation && typeof swiper.params.navigation !== 'boolean') {
                swiper.params.navigation.prevEl = prevRef.current;
                swiper.params.navigation.nextEl = nextRef.current;
              }
              if (swiper.params.pagination && typeof swiper.params.pagination !== 'boolean') {
                swiper.params.pagination.el = paginationRef.current;
              }

              swiper.navigation.destroy();
              swiper.navigation.init();
              swiper.navigation.update();

              swiper.pagination.destroy();
              swiper.pagination.init();
              swiper.pagination.render();
              swiper.pagination.update();

              setInit(true);
            }}
          >
            {filteredProducts.map((item) => (
              <SwiperSlide key={item.id}>
                <ProductItem item={item} noimage={noimage} />
              </SwiperSlide>
            ))}
          </Swiper>

          <div className={styles.custom_controls}>
            <div ref={paginationRef} className="custom-pagination"></div>
            <div ref={prevRef} className="prev-btn">
              <Image src={btnLeft} alt="prev" />
            </div>
            <div ref={nextRef} className="next-btn">
              <Image src={btnRight} alt="next" />
            </div>
          </div>
        </div>
      ) : (
        <ul className={styles.sectionLists}>
          {filteredProducts.slice(0, 8).map((item) => (
            <li key={item.id} className={styles.list}>
              <ProductItem item={item} noimage={noimage} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}