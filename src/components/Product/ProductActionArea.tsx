'use client';
import { useOrderStore } from "@/store/useOrderStore";
import { useRouter } from "next/navigation";
import { useState } from "react";
import styles from "./Product.module.css";

export default function ProductActionArea({ product }) {
  const [quantity, setQuantity] = useState(1);
  const total = product.price * quantity;
  const setOrder = useOrderStore((state) => state.setOrder);
  const router = useRouter();

  const handleBuyNow = () => {
    
    setOrder(product, quantity);

   
    router.push('/order');
  };

  const handleAddToCart = () => {
    
  };


  return (
    <>
      {/* 이미지 속 수량 조절 UI */}
      <div className={styles.quantitySection}>
        <div className={styles.quantityBtns}>
          <button onClick={() => setQuantity(q => Math.max(1, q - 1))}>-</button>
          <span>{quantity}</span>
          <button onClick={() => setQuantity(q => q + 1)}>+</button>
          
        </div>
        <div className={styles.quantityTotal}>{total.toLocaleString()}원</div>
      </div>

      <div className={styles.totalPrice}>
          <strong>총 금액:</strong> {total.toLocaleString()}원
        </div>
      <div className={styles.buttonsArea}>
        <button onClick={handleAddToCart}>장바구니</button>
        <button onClick={handleBuyNow}>구매하기</button>
      </div>
    </>
  );
}