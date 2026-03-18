"use client";

import useCartStore from "@/store/useCartStore";
import CartItem from "./CartItem";
import styles from "./Cart.module.css";

const CartList = () => {
  // 스토어에서 아이템 목록만 
  const items = useCartStore((state) => state.items);

  if (items.length === 0) return <p className="empty">장바구니가 비어 있습니다.</p>;

  return (
    <ul className={styles.cartList}>
      {items.map((item) => (
        <CartItem key={item.id} item={item} />
      ))}
    </ul>
  );
};

export default CartList;