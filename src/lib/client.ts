// src/lib/supabase.ts
// client 용 
import { createBrowserClient } from "@supabase/ssr";


// 1. 환경 변수를 가져오되, TypeScript에게 "이건 무조건 문자열이야"라고 확신을 줍니다.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

// 2. 런타임 체크 (이미 잘 작성하셨습니다!)
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase URL과 ANON KEY를 .env 파일에 설정해주세요.');
}

// 3. 클라이언트 생성
export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);

// 4. 개발 환경 로그 (process.env.NODE_ENV 타입도 자동으로 추론됩니다)
if (process.env.NODE_ENV === 'development') { 
  console.log('🔗 Supabase 연결 정보:');
  console.log('URL:', supabaseUrl);
  console.log('환경:', supabaseUrl.includes('localhost') ? '로컬' : '실서버');
}