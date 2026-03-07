import SubTitle from "@/components/layout/SubTitle/SubTitle";
import SignUp from "@/components/member/SignUp";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "회원가입",
  description: "회원가입 화면",
  keywords: ["회원가입",],
};



export default function Page({ }: {}) {
  return (
    <>
      <SubTitle title="회원가입" />
      <SignUp />
    </>

  )


}