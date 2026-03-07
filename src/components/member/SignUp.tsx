"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDaumPostcodePopup, Address } from "react-daum-postcode";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";
import { joinSchema, JoinFormData } from "@/types/member";
import styles from "./SignUp.module.css";
import useAuthStore from "@/store/useAuthStore";

export default function SignUp() {
  const router = useRouter();
  const openPostcode = useDaumPostcodePopup();
  const [isEmailChecked, setIsEmailChecked] = useState(false);
  const setAuth = useAuthStore((state) => state.setAuth);


  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<JoinFormData>({
    resolver: zodResolver(joinSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      name: "",
      phone: "",
      zipcode: "",
      basic_address: "",
      detail_address: "",
    },
  });

  const passwordMatch = watch("password") === watch("confirmPassword");

  const handleEmailCheck = async () => {
    const email = getValues("email");
    if (!email || errors.email) {
      alert("올바른 이메일 형식을 먼저 입력해주세요.");
      return;
    }

    try {
      const { data, error } = await supabase
        .from("member")
        .select("email")
        .eq("email", email)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        alert("⚠️ 이미 사용 중인 이메일입니다.");
        setIsEmailChecked(false);
      } else {
        alert("✅ 사용 가능한 이메일입니다!");
        setIsEmailChecked(true);
      }
    } catch (err) {
      alert("중복 체크 중 오류가 발생했습니다.");
    }
  };

  const handleAddressComplete = (data: Address) => {
    let fullAddress = data.address;
    let extraAddress = "";
    if (data.addressType === "R") {
      if (data.bname !== "") extraAddress += data.bname;
      if (data.buildingName !== "") {
        extraAddress += extraAddress !== "" ? `, ${data.buildingName}` : data.buildingName;
      }
      fullAddress += extraAddress !== "" ? ` (${extraAddress})` : "";
    }
    setValue("zipcode", data.zonecode);
    setValue("basic_address", fullAddress);
    setValue("detail_address", "");
  };

  const onSubmit = async (data: JoinFormData) => {
    if (!isEmailChecked) {
      alert("이메일 중복 체크를 완료해주세요.");
      return;
    }

    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error("인증 계정 생성 실패");
      

      const { error: dbError } = await supabase.from("member").insert({
        id: authData.user.id,
        email: data.email,
        name: data.name,
        phone: data.phone,
        zipcode: data.zipcode,
        basic_address: data.basic_address,
        detail_address: data.detail_address,
        level: 1,
      });

      const newMember = { id: authData.user.id, email: data.email, name: data.name, level: 1 as 1, };
      setAuth(authData.user, newMember);

      if (dbError) throw dbError;
      alert(`🎉 회원가입을 축하합니다, ${data.name}님!`);
      router.push("/");
    } catch (err: any) {
      alert(`회원가입 실패: ${err.message}`);
    }
  };

  return (
    <form className={styles.joinForm} onSubmit={handleSubmit(onSubmit)}>
      <span className={styles.pp}>* 필수입력</span>

      {/* 이메일 섹션 */}
      <div className={styles.formGroup}>
        <label htmlFor="email">
          <span className={styles.point}>*</span> 아이디 (이메일)
        </label>
        <div className={styles.idCheckWrap}>
          <input
            {...register("email")}
            type="email"
            id="email"
            className={styles.inputField}
            placeholder="example@domain.com"
          />
          <button type="button" className={styles.btnSmall} onClick={handleEmailCheck}>
            중복체크
          </button>
        </div>
        {errors.email && <p className={styles.errorText}>{errors.email.message}</p>}
      </div>

      {/* 비밀번호 섹션 */}
      <div className={styles.formGroup}>
        <label htmlFor="password"><span className={styles.point}>*</span> 비밀번호</label>
        <input {...register("password")} type="password" id="password" className={styles.inputField} />
        {errors.password && <p className={styles.errorText}>{errors.password.message}</p>}
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="confirmPassword"><span className={styles.point}>*</span> 비밀번호 확인</label>
        <input {...register("confirmPassword")} type="password" id="confirmPassword" className={styles.inputField} />
        {errors.confirmPassword && (
          <p className={styles.errorText}>{errors.confirmPassword.message}</p>
        )}
        {!errors.confirmPassword && !passwordMatch && watch("confirmPassword") && (
          <p className={styles.errorText}>비밀번호가 일치하지 않습니다.</p>
        )}
      </div>

      {/* 사용자 정보 섹션 */}
      <div className={styles.formGroup}>
        <label htmlFor="name"><span className={styles.point}>*</span> 이름</label>
        <input {...register("name")} type="text" id="name" className={styles.inputField} />
        {errors.name && <p className={styles.errorText}>{errors.name.message}</p>}
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="phone">휴대폰번호</label>
        <input
          {...register("phone")}
          type="tel"
          id="phone"
          className={styles.inputField}
          placeholder="010-1234-5678"
          onChange={(e) => {
            const formatted = e.target.value
              .replace(/[^0-9]/g, "")
              .replace(/^(\d{2,3})(\d{3,4})(\d{4})$/, "$1-$2-$3");
            setValue("phone", formatted);
          }}
        />
        {errors.phone && <p className={styles.errorText}>{errors.phone.message}</p>}
      </div>

      {/* 주소 섹션 */}
      <div className={styles.formGroup}>
        <label>주소</label>
        <div className={styles.addressWrap}>
          <input {...register("zipcode")} type="text" readOnly placeholder="우편번호" className={styles.inputField} style={{ width: '150px' }} />
          <button
            type="button"
            className={styles.btnSmall}
            onClick={() => openPostcode({ onComplete: handleAddressComplete })}
          >
            주소검색
          </button>
        </div>
        <input {...register("basic_address")} type="text" readOnly placeholder="기본주소" className={styles.inputField} style={{ width: '100%', marginBottom: '8px' }} />
        <input
          {...register("detail_address")}
          type="text"
          placeholder="상세주소"
          className={styles.inputField}
          style={{ width: '100%' }}
        />
      </div>

      {/* 제출 버튼 */}
      <div className={styles.joinBtnWrap}>
        <button type="button" className={styles.btnCancel} onClick={() => router.back()}>
          취소
        </button>
        <button type="submit" className={styles.btnSubmit} disabled={isSubmitting}>
          {isSubmitting ? "처리 중..." : "회원가입"}
        </button>
      </div>
    </form>
  );
}