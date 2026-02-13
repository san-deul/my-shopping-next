"use client";

import React, { useRef, useMemo, useState } from "react";
import Link from "next/link";
import Image, { StaticImageData } from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation } from "swiper/modules";
import type { Swiper as SwiperCore } from "swiper";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "../../app/styles/swiperReset.css"
import styles from "./prdList.module.scss";

import moreBtn from "@/assets/images/plus_btn.png";
import btnLeft from "@/assets/images/slide_left2.png";
import btnRight from "@/assets/images/slide_right2.png";
import noimage from "@/assets/images/noimage.jpg";

import type { Product } from "@/types/schema";

// ✅ Props: products를 반드시 받음
interface PrdListProps {
  title: string;
  products: Product[];
  useSwiper?: boolean;
  showMore?: boolean;
  moreLink?: string;
  limit?: number; // 리스트 모드에서 몇 개만 보여줄지
}

interface ProductItemProps {
  item: Product;
  fallback: StaticImageData;
}

const ProductItem = ({ item, fallback }: ProductItemProps) => {
  const [imgSrc, setImgSrc] = useState<string | StaticImageData>(
    item.image?.trim() || fallback
  );

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
            onError={() => setImgSrc(fallback)}
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
  products,
  useSwiper = false,
  showMore = false,
  moreLink = "#",
  limit = 8,
}: PrdListProps) {
  const [_, setInit] = useState(false);

  // 리스트 모드일 때만 limit 적용
  const viewProducts = useMemo(() => {
    return useSwiper ? products : products.slice(0, limit);
  }, [products, useSwiper, limit]);

  const prevRef = useRef<HTMLDivElement>(null);
  const nextRef = useRef<HTMLDivElement>(null);
  const paginationRef = useRef<HTMLDivElement>(null);

  return (
    <section className="section_in">

      <p className="title">{title}</p>
      {showMore && (
        <div className={styles.mainMore}>
          <Link href={moreLink}>
            <Image src={moreBtn} alt="더보기" width={16} height={16} />
          </Link>
        </div>
      )}


      {useSwiper ? (
        <div className={styles.swiperWrap}>
          <Swiper
            className={`${styles.mySwiper} ${styles.prdSwiper}`}
            modules={[Pagination, Navigation]}

            navigation={{
              prevEl: prevRef.current,
              nextEl: nextRef.current,
            }}

            pagination={{
              type: "progressbar",
              el: paginationRef.current,
            }}

            slidesPerView={1.5}
            spaceBetween={10}
            breakpoints={{
              768: { slidesPerView: 3.8, spaceBetween: 20 },
              1023: { slidesPerView: 4, spaceBetween: 20 },
            }}
            onBeforeInit={(swiper) => {
              if (typeof swiper.params.navigation !== "boolean" && swiper.params.navigation) {
                swiper.params.navigation.prevEl = prevRef.current;
                swiper.params.navigation.nextEl = nextRef.current;
              }
              if (typeof swiper.params.pagination !== "boolean" && swiper.params.pagination) {
                swiper.params.pagination.el = paginationRef.current;
              }
            }}

            onSwiper={(swiper) => {
              swiper.navigation?.update();
              swiper.pagination?.render();
              swiper.pagination?.update();
            }}
          >
            {viewProducts.map((item) => (
              <SwiperSlide key={item.id}>
                <ProductItem item={item} fallback={noimage} />
              </SwiperSlide>
            ))}
          </Swiper>

          <div className={styles.customArea}>
            <div ref={paginationRef} className={styles.customPagination} />
            <div className={styles.customButton}>
              <div ref={prevRef} className={styles.customPrev}>
                <Image src={btnLeft} alt="prev" />
              </div>
              <div ref={nextRef} className={styles.customNext}>
                <Image src={btnRight} alt="next" />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <ul className={styles.sectionLists}>
          {viewProducts.map((item) => (
            <li key={item.id} className={styles.list}>
              <ProductItem item={item} fallback={noimage} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
