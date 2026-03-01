'use client';

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import useAuthStore from "@/store/useAuthStore";
import { useOrderStore } from "@/store/useOrderStore";
import { orderMemberSchema, OrderMemberFormData } from "@/types/order";
import styles from "./Order.module.css";

export default function OrderMemberInfo() {
  const { member, user } = useAuthStore();
  const { orderInfo, updateOrderInfo } = useOrderStore();
  const [isEditing, setIsEditing] = useState(false);

  //  React Hook Form 설정 
  const {
    register,
    reset,
    watch,
    formState: { errors },
  } = useForm<OrderMemberFormData>({
    resolver: zodResolver(orderMemberSchema),
    mode: "onChange",
    // 초기값을 Zustand의 현재 값으로 설정하여 정합성 유지
    defaultValues: {
      order_name: orderInfo.order_name,
      order_phone: orderInfo.order_phone,
      email: user?.email || "",
    }
  });

  // Auth 정보가 로드되었을 때 폼 초기화 (최초 1회 실행 위주)
  useEffect(() => {
    if (member && user) {
      const initialData = {
        order_name: member.name || "",
        order_phone: member.phone || "", // 필요 시 member.phone
        email: user.email || "",
      };
      reset(initialData);
      updateOrderInfo(initialData);
    }
  }, [member, user, reset, updateOrderInfo]);

  // 3. 실시간 동기화 (Infinite Loop 방지형)
  const watchedName = watch("order_name");
  const watchedPhone = watch("order_phone");

  useEffect(() => {
    // Zustand에 저장된 값과 현재 입력값이 다를 때만 업데이트 호출
    if (watchedName !== orderInfo.order_name || watchedPhone !== orderInfo.order_phone) {
      updateOrderInfo({
        order_name: watchedName,
        order_phone: watchedPhone,
      });
    }
  }, [watchedName, watchedPhone, updateOrderInfo, orderInfo.order_name, orderInfo.order_phone]);

  if (!user) return <div className={styles.loading}>로그인이 필요합니다.</div>;

  return (
    <section className={styles.orderSection}>
      <div className={styles.header}>
        <h3>주문자 정보</h3>
        <button
          type="button"
          onClick={() => setIsEditing(!isEditing)}
          className={isEditing ? styles.btn_done : styles.btn_edit}
        >
          {isEditing ? "저장" : "수정"}
        </button>
      </div>

      <div className={styles.form_container}>
        <div className={styles.input_group}>
          <label>이름</label>
          <input
            {...register("order_name")}
            readOnly={!isEditing}
            className={!isEditing ? styles.readOnly : ""}
            placeholder="성함을 입력해주세요"
          />
          {errors.order_name && <p className={styles.error}>{errors.order_name.message}</p>}
        </div>

        <div className={styles.inputGroup}>
          <label>전화번호</label>
          <input
            {...register("order_phone")}
            readOnly={!isEditing}
            className={!isEditing ? styles.readOnly : ""}
            placeholder="010-0000-0000"
          />
          {errors.order_phone && <p className={styles.error}>{errors.order_phone.message}</p>}
        </div>

        <div className={styles.input_group}>
          <label>이메일</label>
          <input
            value={user.email || ""}
            readOnly
            className={styles.readOnly}
            disabled
          />
        </div>
      </div>
    </section>
  );
}