'use client';

import { useMemo } from "react";
import { useOrderStore } from "@/store/useOrderStore";
import type { Product } from "@/types/schema";
import styles from "./Order.module.css";

export default function OrderProductList({ productMap }: { productMap: Map<number, Product> }) {
  const { orderItems } = useOrderStore();

  const { totalQuantity, totalPrice } = useMemo(() => {
    return orderItems.reduce(
      (acc, item) => {
        const p = productMap.get(item.productId);
        if (!p) return acc;
        return {
          totalQuantity: acc.totalQuantity + item.quantity,
          totalPrice: acc.totalPrice + p.price * item.quantity,
        };
      },
      { totalQuantity: 0, totalPrice: 0 }
    );
  }, [orderItems, productMap]);

  if (orderItems.length === 0) return <p>주문할 상품이 없습니다.</p>;

  return (
    <section className={styles.order_section}>
      <h3 className={styles.title}>주문 상품 정보</h3>

      <div className={styles.product_list}>
        {orderItems.map(({ productId, quantity }) => {
          const product = productMap.get(productId);
          if (!product) return null;

          return (
            <div className={styles.order_product} key={product.id}>
              <div className={styles.image_wrapper}>
                <img
                  src={product.image || "/img/sample.jpg"}
                  alt={product.name}
                  className={styles.order_thumb}
                />
              </div>

              <div className={styles.order_info}>
                <p className={styles.prd_name}>{product.name}</p>
                <div className={styles.prd_detail}>
                  <span className={styles.prd_quantity}>수량: {quantity}개</span>
                  <span className={styles.prd_price}>
                    {(product.price * quantity).toLocaleString()}원
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className={styles.product_summary}>
        <div className={styles.summary_row}>
          <span>총 수량</span>
          <span>{totalQuantity}개</span>
        </div>
        <div className={`${styles.summary_row} ${styles.total}`}>
          <span>총 결제금액</span>
          <span className={styles.total_price}>{totalPrice.toLocaleString()}원</span>
        </div>
      </div>
    </section>
  );
}
