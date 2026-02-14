import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

import { productService } from "@/api/services/productService";
import styles from "./Product.module.css"
import Image from "next/image";
import { Product } from "@/types/schema";


interface ProductImgViewerProps {
  product: Product;
}


export default async function ProductImgViewer({ product }: ProductImgViewerProps) {

  return (
    <div className={styles.productDetailLeft}>

      <div className={styles.mainImage}>
        <Image src={product.image} alt={product.name} width={400} height={400} />
      </div>
    </div>
  );
}
