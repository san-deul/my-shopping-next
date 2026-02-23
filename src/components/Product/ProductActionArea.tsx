'use client';
import { useOrderStore } from "@/store/useOrderStore";
import { useRouter } from "next/navigation";
import { useState } from "react";
import styles from "./Product.module.css";
import useAuthStore from "@/store/useAuthStore";
import useCartStore from "@/store/useCartStore";




type ProductActionAreaProps = {
  productId: number;
  price: number;
};
export default function ProductActionArea({ productId, price }) {
  const [quantity, setQuantity] = useState(1);
  const total = price * quantity;
  const setOrder = useOrderStore((state) => state.setOrder);
  const router = useRouter();
  const addCartItem = useCartStore((state) => state.addCartItem)
  const user = useAuthStore((state) => state.user)

  const handleBuyNow = () => {
    if (!user) {
      alert("로그인 후 이용 가능합니다.");
      router.push("/login");
      return;
    }
    //console.log('productId==>' ,productId  , 'quantity',quantity)
    setOrder(productId, quantity);
    router.push('/order');



  };

  const handleAddToCart = async () => {

    //로그인체크
    if (!user) {
      alert("로그인이 필요한 서비스입니다.");
      router.push("/login"); // 로그인 페이지로 리다이렉트
      return;
    }

    try {
      console.log('수량', quantity)
      await addCartItem(user.id, productId, quantity);
      if (confirm("장바구니에 담겼습니다. 장바구니로 이동하시겠습니까?")) {
        router.push('/cart');
      }
    } catch (error) {
      console.error("장바구니 담기 실패:", error);
      alert("장바구니 담기에 실패했습니다.");
    }

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