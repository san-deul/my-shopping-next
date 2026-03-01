'use client';

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useOrderStore } from "@/store/useOrderStore";
import useAuthStore from "@/store/useAuthStore";
import { supabase } from "@/lib/supabase";
import type { Product } from "@/types/schema";

import OrderProductList from "./OrderProductList";
import OrderMemberInfo from "./OrderMemberInfo";
import OrderDeliveryInfo from "./OrderDeliveryInfo";
import styles from "./Order.module.css";
import { productService } from "@/api/services/productService";
import { CreateOrderInput } from "@/types/order";
import { orderService } from "@/api/services/orderService";



export default function OrderForm() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { orderItems, orderInfo, clearOrder } = useOrderStore();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  console.log("orderItems111:", orderItems);
  const orderItemsKey = JSON.stringify(orderItems.map(i => i.productId));


  // ✅ 주문 없이 /order 들어오면 튕기기

  useEffect(() => {
    if (orderItems.length === 0) {
      alert("올바른 경로로 접근해주세요.")
      router.replace("/");
    }
  }, [orderItems.length, router]);

  const productIds = useMemo(() => orderItems.map(i => i.productId), [orderItems]);

  // ✅ 주문 상품 조회
  useEffect(() => { // product 정보 가져옴
    const fetchProducts = async () => {
      if (productIds.length === 0) {
        return;
      }
      setLoading(true);

      try {
        console.log('try!!')
        const data = await productService.getProductsByIds(productIds);
        setProducts(data);
      } catch (e) {
        console.error(e);
        alert("상품 정보를 불러오지 못했습니다.");
        router.replace("/cart");
        return;
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [orderItemsKey, router]);

  // productId → product 매핑
  const productMap = useMemo(() => {
    const m = new Map<number, Product>();
    for (const p of products) m.set(Number(p.id), p);
    return m;
  }, [products]);

  // ✅ 최신 상품정보 기준 totalPrice
  const totalPrice = useMemo(() => {
    return orderItems.reduce((sum, it) => {
      const p = productMap.get(it.productId);
      if (!p) return sum;
      //return sum + p.price * it.quantity;
      return p ? sum + p.price * it.quantity : sum;
    }, 0);
  }, [orderItems, productMap]);

  const handleOrderSubmit = async () => {
    if (!user) {
      alert("로그인이 필요합니다.");
      router.push("/login");
      return;
    }

    if (!orderInfo.order_name || !orderInfo.order_phone || !orderInfo.basic_address) {
      alert("주문 정보를 모두 입력하고 '저장'을 눌러주세요.");
      return;
    }

    // 혹시 조회 실패/누락 방지
    const missing = orderItems.some((it) => !productMap.get(it.productId));
    if (missing) {
      alert("주문 상품 정보를 불러오는 중입니다. 잠시 후 다시 시도해주세요.");
      return;
    }

    const orderData = {
      member_id: user.id,
      total_price: totalPrice,
      status: "pending",
      payment_method: "card",
      order_name: orderInfo.order_name,
      order_phone: orderInfo.order_phone,
      zipcode: orderInfo.zipcode,
      basic_address: orderInfo.basic_address,
      detail_address: orderInfo.detail_address,
      extra_info: orderInfo.extra_info ?? null,
    } satisfies CreateOrderInput;

    const items = orderItems.map((it) => ({
      product: productMap.get(it.productId)!, // Product
      quantity: it.quantity,
    }));


    try {

      // 1) orders insert
      const result = await orderService.createCompleteOrder(orderData, items, true);

      if (!result.success) {
        alert(result.error ?? "주문 처리 중 오류가 발생했습니다.");
        return;
      }

      clearOrder();
      alert("주문이 완료되었습니다!");
      router.push("/mypage");

    } catch (error) {
      console.error(error);
      alert("주문 처리 중 오류가 발생했습니다.");
    }
  };


  if (loading) return <div className={styles.loading}>상품 정보를 불러오는 중...</div>;
  if (orderItems.length === 0) return null; // 튕겨내기 전 잠깐의 빈 화면 처리


  return (
    <div className={styles.orderContainer}>
      <OrderProductList productMap={productMap} />
      <OrderMemberInfo />
      <OrderDeliveryInfo />

      <div className={styles.orderButtons}>
        <button type="button" className={styles.btnPay} onClick={handleOrderSubmit}>
          구매하기
        </button>
        <button type="button" className={styles.btnCancel} onClick={() => router.back()}>
          취소하기
        </button>
      </div>
    </div>
  );
}
