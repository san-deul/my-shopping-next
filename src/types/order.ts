import { z } from "zod";


export interface Order {
  id: number;
  member_id: string | null;
  total_price: number;
  status: OrderStatus;
  payment_method: PaymentMethod;
  // 스키마와 필드명을 맞춰주는 것이 좋습니다 (order_name, order_phone)
  order_name: string;
  order_phone: string;
  zipcode: string;
  basic_address: string;
  detail_address: string;
  extra_info?: string | null;
  created_at: string; 
  updated_at: string;
}


/* --------------------------------------- */
export type CreateOrderInput = Omit<Order, 'id' | 'created_at' | 'updated_at'>;

// Omit :: 기존 타입을 기반으로 새 타입을 변형해서 만드는 유틸리티 타입
/*
 Order에 있는 필드 중에서
 id, created_at, updated_at 3개만 뺀 나머지 전부를 가진 타입
*/


// 1. 주문자 정보 스키마 (주문 폼에서 사용)
export const orderMemberSchema = z.object({
  order_name: z.string().min(2, "이름은 2글자 이상 입력해주세요."),
  order_phone: z
    .string()
    .regex(/^01([0|1|6|7|8|9])-?([0-9]{3,4})-?([0-9]{4})$/, "올바른 휴대폰 번호를 입력해주세요."),
  email: z.string().email(), 
});

export const orderDeliverySchema = z.object({
  zipcode: z.string().min(1, "우편번호를 입력해주세요."),
  basic_address: z.string().min(1, "기본 주소를 입력해주세요."),
  detail_address: z.string().min(1, "상세 주소를 입력해주세요."),
  extra_info: z.string().optional(),
});

// Zod에서 타입 추출
export type OrderMemberFormData = z.infer<typeof orderMemberSchema>;
export type OrderDeliveryFormData = z.infer<typeof orderDeliverySchema>;





// 2. 주문 관련 리터럴 타입
export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'completed' | 'cancelled';
export type PaymentMethod = 'card' | 'transfer' | 'vbank' | 'kakao_pay';

// 3. 전체 주문 인터페이스


// 4. 주문 생성용 타입 (Utility Type 활용)


