'use client';

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDaumPostcodePopup } from "react-daum-postcode";
import useAuthStore from "@/store/useAuthStore";
import { useOrderStore } from "@/store/useOrderStore";
import { orderDeliverySchema } from "@/types/order"; // 이전에 만든 배송용 스키마
import styles from "./Order.module.css";

export default function OrderDeliveryInfo() {
  const { member } = useAuthStore(); // 보내주신 Member 타입 데이터
  const { orderInfo, updateOrderInfo } = useOrderStore();
  const [isEditing, setIsEditing] = useState(false);
  const open = useDaumPostcodePopup();

  const {
    register,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    // orderDeliverySchema는 보내주신 memberSchema의 주소 필드와 형식을 맞춰야 합니다.
    mode: "onChange",
  });

  // 1. DB(member) 데이터 로드 시 초기값 설정
  useEffect(() => {
    if (member) {
      const initialAddress = {
        zipcode: member.zipcode || "",
        basic_address: member.basic_address || "",
        detail_address: member.detail_address || "",
        extra_info: member.extra_info || "", // 배송 메모 혹은 참고항목
      };
      console.log('initialAddress-->', initialAddress)
      reset(initialAddress);
      
      // Zustand 스토어도 즉시 동기화
      updateOrderInfo(initialAddress);
    }
  }, [member, reset, updateOrderInfo]);

  // 2. 필드 감시 및 무한 루프 방지형 업데이트
  const wZip = watch("zipcode");
  const wBasic = watch("basic_address");
  const wDetail = watch("detail_address");
  const wExtra = watch("extra_info");

  useEffect(() => {
    if (
      wZip !== orderInfo.zipcode ||
      wBasic !== orderInfo.basic_address ||
      wDetail !== orderInfo.detail_address ||
      wExtra !== orderInfo.extra_info
    ) {
      updateOrderInfo({
        zipcode: wZip,
        basic_address: wBasic,
        detail_address: wDetail,
        extra_info: wExtra,
      });
    }
  }, [wZip, wBasic, wDetail, wExtra, updateOrderInfo, orderInfo]);

  const handleComplete = (data: any) => {
    let fullAddress = data.address;
    let extra = "";
    if (data.addressType === "R") {
      if (data.bname) extra += data.bname;
      if (data.buildingName) extra += (extra ? `, ${data.buildingName}` : data.buildingName);
      fullAddress += extra ? ` (${extra})` : "";
    }

    setValue("zipcode", data.zonecode);
    setValue("basic_address", fullAddress);
    // 상세주소(detail_address)로 포커스 이동은 별도 처리 가능
  };

  return (
    <section className={styles.order_section}>
      <div className={styles.header}>
        <h3>배송 정보</h3>
        <button type="button" 
         className={isEditing ? styles.btn_done : styles.btn_edit}
        onClick={() => setIsEditing(!isEditing)}>
          {isEditing ? "저장" : "수정"}
        </button>
      </div>

      <div className={styles.form_container}>
        {/* 우편번호 */}
        <div className={styles.input_group}>
          <label>우편번호</label>
          <div className={styles.zipcode_wrapper}>
            <input
              {...register("zipcode")}
              readOnly
              className={styles.readOnly}
            />
            {isEditing && (
              <button type="button"
              className={styles.btn_done}
              onClick={() => open({ onComplete: handleComplete })}>
                주소 찾기
              </button>
            )}
          </div>
        </div>

        {/* 기본주소 */}
        <div className={styles.input_group}>
          <label>기본주소</label>
          <input
            {...register("basic_address")}
            readOnly
            className={styles.readOnly}
          />
        </div>

        {/* 상세주소 */}
        <div className={styles.input_group}>
          <label>상세주소</label>
          <input
            {...register("detail_address")}
            readOnly={!isEditing}
            className={!isEditing ? styles.readOnly : ""}
            placeholder="상세 주소를 입력해주세요"
          />
        </div>

        {/* 배송 메모 (extra_info 활용) */}
        <div className={styles.input_group}>
          <label>배송 메모</label>
          <input
            {...register("extra_info")}
            readOnly={!isEditing}
            className={!isEditing ? styles.readOnly : ""}
            placeholder="예: 문 앞에 놓아주세요"
          />
        </div>
      </div>
    </section>
  );
}