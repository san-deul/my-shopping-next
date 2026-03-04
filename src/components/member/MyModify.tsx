"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDaumPostcodePopup } from "react-daum-postcode";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import useAuthStore from "@/store/useAuthStore";
import styles from "./MyModify.module.scss"
import { memberService } from "@/api/services/memberService";

/* =========================
   1️⃣ Zod 스키마
========================= */

const schema = z
  .object({
    email: z.string().email(),
    currentPassword: z.string().optional(),
    
    confirmPassword: z.string().optional(),
    name: z.string().min(1, "이름을 입력해주세요."),
    phone: z
      .string()
      .regex(/^01[0-9]-\d{3,4}-\d{4}$/, "휴대폰번호 형식이 올바르지 않습니다."),
    zipcode: z.string().min(1, "우편번호를 입력해주세요."),
    basic_address: z.string().min(1, "기본주소를 입력해주세요."),
    detail_address: z.string().optional(),
  })



type FormValues = z.infer<typeof schema>;

/* =========================
   2️⃣ 컴포넌트
========================= */

export default function MyModify() {
  const router = useRouter();
  const open = useDaumPostcodePopup();


  const { user, member, setMember } = useAuthStore();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  /* =========================
     3️⃣ 로그인 유저 없으면 차단
  ========================= */

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }

    if (!member) return

    // 기본값 세팅
    reset({
      email: user.email ?? "",
      name: member.name ?? "",
      phone: member.phone ?? "",
      zipcode: member.zipcode ?? "",
      basic_address: member.basic_address ?? "",
      detail_address: member.detail_address ?? "",
      //currentPassword: "",
      //newPassword: "",
      //confirmPassword: "",
    });
  }, [user, member, reset, router]);

  /* =========================
     4️⃣ 전화번호 자동 하이픈
  ========================= */

  const phoneValue = watch("phone");

  useEffect(() => {
    if (!phoneValue) return;

    const numbersOnly = phoneValue.replace(/[^0-9]/g, "");
    let formatted = numbersOnly;

    if (numbersOnly.length >= 4 && numbersOnly.length < 8) {
      formatted = `${numbersOnly.slice(0, 3)}-${numbersOnly.slice(3)}`;
    } else if (numbersOnly.length >= 8) {
      formatted = `${numbersOnly.slice(0, 3)}-${numbersOnly.slice(
        3,
        7
      )}-${numbersOnly.slice(7, 11)}`;
    }

    setValue("phone", formatted);
  }, [phoneValue, setValue]);

  /* =========================
     5️⃣ 주소검색
  ========================= */

  const handlePostcodeComplete = (data: any) => {
    let fullAddress = data.address;
    let extraAddress = "";

    if (data.addressType === "R") {
      if (data.bname) extraAddress += data.bname;
      if (data.buildingName) {
        extraAddress += extraAddress
          ? `, ${data.buildingName}`
          : data.buildingName;
      }
    }

    if (extraAddress) fullAddress += ` (${extraAddress})`;

    setValue("zipcode", data.zonecode);
    setValue("basic_address", fullAddress);
    setValue("detail_address", "");
  };

  const handleOpenPostcode = () => {
    open({ onComplete: handlePostcodeComplete });
  };



  const onValidSubmit = async (data: FormValues) => {
    if (!user || !member) return;
    try {
      const updatedMember = await memberService.updateMember(member.id, {
        name: data.name,
        phone: data.phone,
        zipcode: data.zipcode,
        basic_address: data.basic_address,
        detail_address: data.detail_address,
      });

      // ✅ store 갱신

      setMember(updatedMember);

      alert("정보가 수정되었습니다.");
    } catch (error) {
      console.error(error);
      alert("수정 중 오류가 발생했습니다.");
    }

  };

  if (!user) return null; // 로그인 체크 중일 때 렌더 방지

  return (
    <form onSubmit={handleSubmit(onValidSubmit)} className={styles.joinForm}>
      <div className={styles.formGroup}>
        <label>이메일</label>
        <input {...register("email")} disabled />
      </div>

    {/*
      <div className={styles.formGroup}>
        <label>현재 비밀번호</label>
        <input type="password" {...register("currentPassword")} />
      </div>

      <div className={styles.formGroup}>
        <label>새 비밀번호</label>
        <input type="password" {...register("newPassword")} />
        {errors.newPassword && <p>{errors.newPassword.message}</p>}
      </div>
      

      <div className={styles.formGroup}>
        <label>새 비밀번호 확인</label>
        <input type="password" {...register("confirmPassword")} />
        {errors.confirmPassword && <p>{errors.confirmPassword.message}</p>}
      </div>*/}

      <div className={styles.formGroup}>
        <label>이름</label>
        <input {...register("name")} />
        {errors.name && <p>{errors.name.message}</p>}
      </div>

      <div className={styles.formGroup}>
        <label>휴대폰번호</label>
        <input {...register("phone")} />
        {errors.phone && <p>{errors.phone.message}</p>}
      </div>

      <div className={styles.formGroup}>

        <label>주소</label>
        <div className={styles.addressWrap}>
          <input {...register("zipcode")} readOnly />
          <button
            type="button"
            onClick={handleOpenPostcode}
            className={styles.btnSmall}>
            주소검색
          </button>
        </div>

      </div>

      <div className={styles.formGroup}>
        <input {...register("basic_address")} readOnly />
        <input {...register("detail_address")} />
      </div>

      <div className={styles.joinBtnWrap}>
        <button type="button" className={styles.btnCancel}>취소</button>
        <button type="submit" className={styles.btnSubmit}>정보수정</button>
      </div>

    </form>
  );
}