'use client';

import { createContext, useContext, useState } from 'react';
import Spinner from '@/components/common/Spinner';

const LoadingContext = createContext(null);

export function LoadingProvider({ children }) {
  const [loading, setLoading] = useState(false);

  return (
    <LoadingContext.Provider value={{ loading, setLoading }}>
      {loading && <Spinner />}
      {children}
    </LoadingContext.Provider>
  );
}

export function useLoading() {
  return useContext(LoadingContext);
}
