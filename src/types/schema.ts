// 1. 상품 타입 정의
export interface Product {
  id: number; // bigserial은 고유 번호이므로 number
  name: string;
  category: number | null; // null 허용(null) 처리
  sub_category: string | null;
  price: number;
  originalPrice: number | null; // 따옴표가 붙은 컬럼명은 그대로 사용
  discount: number | null;
  image: string | null;
  description: string | null;
  isNew: boolean | null;
  isBest: boolean | null;
  rating: number | null; // numeric(2, 1)은 소수점이 있는 number
  reviewCount: number | null;
  stock: number | null;
  created_at: string | null; // timestamp는 보통 ISO 문자열로 넘어옵니다.
}

// 2. 리뷰 타입 정의
export interface Review {
  id: number;
  product_id: number;
  user_id: string;
  title: string;
  content: string;
  date: string; // SQL date 타입도 문자열로 처리
  img: string | null;
}

export interface ReviewWithProfile extends Review {
  profiles: {
    display_name: string | null;
    avatar_url: string | null;
  } | null;
}