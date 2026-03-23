import { z } from "zod";

/**
 * 1. 기초가 되는 Member 스키마 (DB 구조와 일치)
 * null 허용 여부 등 DB 제약 조건을 반영합니다.
 */
export const memberSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  name: z.string(),
  phone: z.string().nullable(),
  zipcode: z.string().nullable(),
  basic_address: z.string().nullable(),
  detail_address: z.string().nullable(),
  extra_info: z.string().nullable(),
  level: z.union([z.literal(1), z.literal(10)]),
});

// 로그인 정보나 프로필 조회 시 사용할 타입
export type Member = z.infer<typeof memberSchema>;

/**
 * 2. 회원가입 전용 스키마 (memberSchema를 확장)
 * password, confirmPassword 등 DB에는 없지만 입력 폼에 필요한 필드 추가
 */
export const joinSchema = memberSchema
  .omit({ id: true, level: true, extra_info: true }) // DB 자동생성/기본값 필드 제외
  .extend({
    // Member 스키마의 필드에 검증 로직 강화
    email: z.string().min(1, "이메일을 입력해주세요.").email("올바른 이메일 형식이 아닙니다."),
    password: z.string().min(6, "비밀번호는 6자 이상이어야 합니다.").regex(/[0-9]/, "숫자를 포함하세요."),
    confirmPassword: z.string().min(1, "비밀번호 확인을 입력해주세요."),
    name: z.string().min(2, "이름은 2글자 이상이어야 합니다."),
    phone: z.string().regex(/^01[0-9]-\d{3,4}-\d{4}$/, "형식을 확인해주세요."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "비밀번호가 일치하지 않습니다.",
    path: ["confirmPassword"],
  });

export type JoinFormData = z.infer<typeof joinSchema>;




export const loginSchema = z.object({
  email: z.string().email("유효한 이메일 형식이 아닙니다."),
  password: z.string().min(6, "비밀번호는 최소 6자 이상이어야 합니다."),
});

// 타입 추론
export type LoginInput = z.infer<typeof loginSchema>;