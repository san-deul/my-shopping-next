"use client";

import { useEffect, useState } from "react";
import useAuthStore from "@/store/useAuthStore";
import { orderService } from "@/api/services/orderService";
import OrderRow from "./OrderRow";
import styles from "./Order.module.scss"

export default function OrderListPage() {
  const { user, member } = useAuthStore();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (!user) return;
    orderService.getMyOrders(member.id)
      .then(setOrders)
      .catch(console.error);
  }, [user]);

  console.log('user-->?', user)
  console.log('member-->?', member)

  if (!orders || orders.length === 0) {
    return (
      <div className={styles.orderlistContainer}>
        <p>주문 내역이 없습니다.</p>
      </div>
    );
  }

  return (
    <div className={styles.orderlistContainer}>
      <table className={styles.orderTable}>
        <thead>
          <tr>
            <th>날짜/주문번호</th>
            <th>상품정보</th>
            <th>금액/수량</th>
            <th>주문상태</th>
            <th>확인/취소</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <OrderRow key={order.id} order={order} />
          ))}
        </tbody>
      </table>
    </div>
  );
}