import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

import { productService } from "@/api/services/productService";
import styles from "./Product.module.css"
import Image from "next/image";
import { Product } from "@/types/schema";


type ProductImgViewerProps = {
  name: string;
  image: string;
  // images?: string[];
};

export default async function ProductImgViewer({ name, image }: ProductImgViewerProps) {

  return (
    <div className={styles.productDetailLeft}>

      <div className={styles.mainImage}>
        <Image src={image} alt={name} width={400} height={400} />
      </div>
    </div>
  );
}
