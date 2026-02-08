// lib/getQueryClient.js
import { QueryClient } from '@tanstack/react-query';
import { cache } from 'react';

// cache()를 사용하여 요청당 하나의 QueryClient만 생성되도록 합니다.
const getQueryClient = cache(() => new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1분 동안은 데이터를 신선한 것으로 간주
    },
  },
}));

export default getQueryClient;