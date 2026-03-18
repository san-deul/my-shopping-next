"use client";

import React, { useMemo } from "react";
import useCartStore from "@/store/useCartStore";
import { useRouter } from "next/navigation";
import useAuthStore from "@/store/useAuthStore";
import { useOrderStore } from "@/store/useOrderStore";

const CartFooter = () => {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const setCartOrder = useOrderStore((s) => s.setCartOrder);

  // ✅ 각각 가져오기
  const items = useCartStore((state) => state.items);
  const deleteCheckedItems = useCartStore((state) => state.deleteCheckedItems);
  const clearCart = useCartStore((state) => state.clearCart);



  // 2. 계산된 값들 (useMemo를 사용하여 items가 변할 때만 재계산)
  const { checkedItems, totalPrice, isAllEmpty } = useMemo(() => {
    const selected = items.filter((item) => item.checked);
    const total = selected.reduce((acc, item) => acc + item.products.price * item.quantity, 0);
    return {
      checkedItems: selected,
      totalPrice: total,
      isAllEmpty: items.length === 0,
    };
  }, [items]);

  // 3. 비즈니스 로직 핸들러
  const handleCheckedDelete = async () => {
    if (checkedItems.length === 0) return alert("삭제할 상품을 선택해주세요.");
    if (window.confirm("선택한 상품을 장바구니에서 삭제할까요?")) {
      await deleteCheckedItems();
    }
  };

  const handleAllDelete = async () => {
    if (isAllEmpty) return;
    if (window.confirm("장바구니를 완전히 비우시겠습니까?")) {
      const memberId = user?.id;
      if (!memberId) {
        alert("로그인이 필요합니다.");
        router.push("/login");
        return;
      }
      await clearCart(memberId);
    }
  };

  const handleOrder = () => {

    if (!user) {
      alert("로그인 후 이용 가능합니다.");
      router.push("/login");
      return;
    }

    if (checkedItems.length === 0) return alert("주문할 상품을 선택해주세요.");
    // 주문 페이지 이동 로직 (예: router.push('/order'))


    const orderItems = checkedItems.map((item) => ({
      productId: item.products.id, // cart item 안에 product가 products로 들어있으니
      quantity: item.quantity,
    }));

    setCartOrder(orderItems);

    router.push("/order");
  };

  if (isAllEmpty) return null; // 장바구니가 비었으면 푸터를 보여주지 않음

  return (
    <div className="mt-10 p-6 bg-white border border-gray-100 rounded-xl shadow-sm">
      {/* 액션 버튼 그룹 */}
      <div className="flex gap-3 mb-8">
        <button
          onClick={handleCheckedDelete}
          className="text-sm text-gray-500 hover:text-red-500 transition-colors"
        >
          선택 삭제
        </button>
        <span className="text-gray-200">|</span>
        <button
          onClick={handleAllDelete}
          className="text-sm text-gray-500 hover:text-red-500 transition-colors"
        >
          전체 삭제
        </button>
      </div>

      {/* 결제 정보 요약 */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div className="space-y-1">
          <p className="text-sm text-gray-500">
            총 <span className="font-semibold text-gray-900">{checkedItems.length}</span>개의 상품 선택
          </p>
          <div className="flex items-baseline gap-2">
            <span className="text-gray-600">결제 예정 금액</span>
            <span className="text-3xl font-extrabold text-orange-600">
              {totalPrice.toLocaleString()}
            </span>
            <span className="text-lg font-bold text-orange-600">원</span>
          </div>
        </div>

        {/* 주문 버튼 */}
        <button
          onClick={handleOrder}
          disabled={checkedItems.length === 0}
          className={`px-12 py-4 rounded-lg font-bold text-lg transition-all ${checkedItems.length > 0
            ? "bg-orange-500 text-white hover:bg-orange-600 shadow-md active:scale-95"
            : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
        >
          {checkedItems.length}개 상품 주문하기
        </button>
      </div>
    </div>
  );
};

export default CartFooter;