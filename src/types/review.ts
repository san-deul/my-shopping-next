// types/review.ts

/** reviews 테이블(Row) 기준 */
export interface Review {
  id: number;                // bigserial -> number
  product_id: number;        // integer
  user_id: string;           // text
  title: string;             // text
  content: string;           // text
  date: string;              // date (Supabase에서는 보통 "YYYY-MM-DD" string)
  img: string | null;        // text nullable
}

/** products 테이블에서 후기게시판에 필요한 최소 필드 */
export interface ProductForReview {
  id: number;
  name: string;
  image: string | null;
}

/** Supabase 조인 결과 형태: reviews + products */
export type ReviewWithProductJoin = Review & {
  products?: ProductForReview | null;
};

/** 후기게시판(UI)에서 바로 쓰기 좋은 형태 (너 기존 코드 호환) */
export type ReviewListItem = Review & {
  product_name: string;
  product_img: string;
};

/** (선택) 프로필 조인용: 기존 서비스에서 쓰던 형태가 있으면 맞춰 사용 */
export interface ProfileForReview {
  display_name: string | null;
  avatar_url: string | null;
}

export type ReviewWithProfile = Review & {
  profiles?: ProfileForReview | null;
};
