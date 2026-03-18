"use client";

import useCartStore from "@/store/useCartStore";
import Image from "next/image";
import { CartItem as CartItemType } from "@/types/cart";
import styles from "./Cart.module.css"
import Link from "next/link";

import noimage from "@/assets/images/noimage.jpg"
import { useState } from "react";

interface CartItemProps {
  item: CartItemType;
}

const CartItem = ({ item }: CartItemProps) => {

  const [imgSrc, setImgSrc] = useState(item.products.image || noimage);

  const updateCartItem = useCartStore((state) => state.updateCartItem);
  const deleteCartItem = useCartStore((state) => state.deleteCartItem);
  const toggleItem = useCartStore((state) => state.toggleItem);

  const handleQtyChange = (newQty: number) => {
    if (newQty < 1) return;
    updateCartItem(item.id, newQty); 
  };

  return (
    <li className={styles.cartItem}>
      
      <input
        type="checkbox"
        checked={item.checked || false}
        onChange={() => toggleItem(item.id)}
        className="w-5 h-5 accent-orange-500"
      />

      {/* 2. 상품 이미지 (Next.js Image 활용) */}
      <div className="w-20 h-20 bg-gray-100 rounded overflow-hidden relative">
        <Link href={`/item/${item.product_id}`}>
          <Image
            src={imgSrc}
            alt={item.products.name}
            fill
            className="cartImage"
            onError={() => setImgSrc(noimage)}  
          />
        </Link>
      </div>

      {/* 3. 상품 정보 및 수량 조절 */}
      <div className="flex-1">
        <Link href={`/item/${item.product_id}`}>
          <h4 className={styles.cartName}>{item.products.name}</h4>
          <p className={styles.cartPrice}>{item.products.price.toLocaleString()}원</p>
        </Link>
        <div className={styles.cartQuantity}>
          <button
            onClick={() => handleQtyChange(item.quantity - 1)}
            className="w-8 h-8 border rounded hover:bg-gray-100"
          >-</button>
          <span className="w-8 text-center">{item.quantity}</span>
          <button
            onClick={() => handleQtyChange(item.quantity + 1)}
            className="w-8 h-8 border rounded hover:bg-gray-100"
          >+</button>
        </div>
      </div>

      {/* 4. 삭제 버튼 */}
      <button
        onClick={() => deleteCartItem(item.id)}
        className={styles.cartDelete}
      >
        ✕
      </button>
    </li>
  );
};

export default CartItem;