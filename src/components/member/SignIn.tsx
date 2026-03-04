"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "@/lib/supabase";


// CSS Module import
import styles from "./SignIn.module.css";
import { LoginInput, loginSchema } from "@/types/member";
import Link from "next/link";
import useAuthStore from "@/store/useAuthStore";

export default function SignIn() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const setAuth = useAuthStore((state) => state.setAuth);
  // const fetchMemberData = useAuthStore((state) => state.fetchMemberData);


  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginInput) => {
    setIsLoading(true);
    try {
      const { data: authData, error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (error) {
        alert("아이디 또는 비밀번호가 잘못되었습니다.");
        return;
      }

 
      alert(`${authData.user?.email}님, 반갑습니다!`);
      const redirectTo = searchParams.get("next") || "/";
      router.push(redirectTo);
      router.refresh();
    } catch (err) {
      console.error(err);
      alert("로그인 중 서버 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.loginContainer}>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.inputWrap}>
          <input
            {...register("email")}
            type="email"
            placeholder="이메일"
            className={errors.email ? styles.inputError : ""}
          />
          {errors.email && <p className={styles.errorMsg}>{errors.email.message}</p>}
        </div>

        <div className={styles.inputWrap}>
          <input
            {...register("password")}
            type="password"
            placeholder="비밀번호"
            className={errors.password ? styles.inputError : ""}
          />
          {errors.password && <p className={styles.errorMsg}>{errors.password.message}</p>}
        </div>

        <button
          type="submit"
          className={styles.loginBtn}
          disabled={isLoading}
        >
          {isLoading ? "로그인 중..." : "로그인"}
        </button>
      </form>

      <div className={styles.loginLinks}>
        <Link href="/find-pw">비밀번호 찾기</Link>
        <span>|</span>
        <Link href="/singup">회원가입</Link>
      </div>
    </div>
  );
}