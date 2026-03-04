// app/mypage/MyPageClient.tsx (Client)
"use client";

import { useMyPageQuery } from "@/hooks/useMyPageQuery";
import MyPageInfo from "@/components/Auth/MyPageInfo";
import MyPageMenu from "@/components/Auth/MyPageMenu";

export default function MyPageWrapper() {
  const { data, isLoading } = useMyPageQuery();
  if (isLoading) return null;
  if (!data?.user || !data?.member) return null;

  return (
    <div className="mypage">
      <MyPageInfo user={data.user} member={data.member} />
      <MyPageMenu />
    </div>
  );
}
