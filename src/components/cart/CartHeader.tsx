"use client";

import useCartStore from "@/store/useCartStore";
import styles from "./Cart.module.css";

const CartHeader = () => {
  // 스토어에서 필요한 데이터와 액션만 선택 (Selector 사용으로 최적화)
  const items = useCartStore((state) => state.items);
  const toggleAllItems = useCartStore((state) => state.toggleAllItems); 

  // 전체 선택 여부 계산 (아이템이 있고, 모든 아이템이 선택된 상태인지)
  const isAllChecked = items.length > 0 && items.every((item) => item.checked);

  return (
    <div className={styles.cartHeader}>
      <label className="flex items-center gap-2 cursor-pointer font-medium text-gray-700">
        <input
          type="checkbox"
          className="w-5 h-5 accent-orange-500 cursor-pointer"
          checked={isAllChecked}
          onChange={(e) => toggleAllItems(e.target.checked)}
        />
        <span>전체 선택</span>
        <span className="text-sm text-gray-400 font-normal">
          ({items.length}개)
        </span>
      </label>
    </div>
  );
};

export default CartHeader;