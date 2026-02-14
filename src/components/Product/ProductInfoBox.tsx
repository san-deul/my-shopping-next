import React from "react";
import QuantitySelector from "./ProductActionArea";
import { productService } from "@/api/services/productService";

import styles from "./Product.module.css";
import { Product } from "@/types/schema";
import ProductActionArea from "./ProductActionArea";

interface ProductInfoBoxProps {
  product: Product;
}


export default async function ProductInfoBox({
  product
}: ProductInfoBoxProps) {



  //const totalPrice = product.price * quantity;

  return (
    <div className={styles.productDetailRight}>

      <div className={styles.tags}>
        {product.isNew && <span className={`${styles.tag} ${styles.new}`}>NEW</span>}
        {product.isBest && <span className={`${styles.tag} ${styles.best}`}>BEST</span>}
      </div>
      <h2 className={styles.productName}>{product.name}</h2>

      

      <p className={styles.desc}>{product.description}</p>

      <div className={styles.priceBox}>
        <p className={styles.salePrice}>{product.price.toLocaleString()}원</p>
        {product.originalPrice && (
          <p className={styles.originalPrice}>
            {product.originalPrice.toLocaleString()}원
          </p>
        )}
      </div>

      <ProductActionArea product={product} />
      
    </div>
  );
}
