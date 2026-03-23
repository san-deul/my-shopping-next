"use client";

import Link from "next/link";
import Image from "next/image";
import noimage from "@/assets/images/noimage.jpg";
import { Order, OrderStatus } from "@/types/order";
import styles from "./Order.module.scss"

function getStatusLabel(status: OrderStatus) {
  const statusMap: Record<OrderStatus, string> = {
    pending: "주문대기",
    processing: "처리중",
    shipped: "배송중",
    completed: "배송완료",
    cancelled: "취소됨",
  };
  return statusMap[status] ?? status;
}

interface Props {
  order: Order;
}

export default function OrderRow({ order }: Props) {
  return (
    <>
      {order.order_items.map((item) => (
        <tr key={item.id}>
          <td>
            <div>{new Date(order.created_at).toLocaleDateString()}</div>
            <div className={styles.ordeId}>{order.id}</div>
          </td>
          <td className={styles.productInfo}>
            <Link href={`/item/${item.product_id}`}>
              <Image
                src={item.product_image || noimage}
                alt={item.product_name || "이미지 없음"}
                width={60}
                height={60}
              />
              <span>{item.product_name}</span>
            </Link>
          </td>
          <td>
            {item.price.toLocaleString()}원 / {item.quantity}개
          </td>
          <td>{order.status === "completed" ? "입금완료" : order.status}</td>
          <td>
            <button
              onClick={() => alert(`주문상세(${order.id})`)}
              className={styles.orderDetailBtn}
            >
              주문상세
            </button>
          </td>
        </tr>
      ))}
    </>
  );
}