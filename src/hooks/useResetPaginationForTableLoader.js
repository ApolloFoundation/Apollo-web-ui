import { useCallback, useEffect, useState } from 'react';

export const useResetPaginationForTableLoader = (condition) => {
  const [isResetPagination, setIsResetPagination] = useState(true);

  const onResetPagination = useCallback(() => setIsResetPagination(false), []);

  useEffect(() => {
    setIsResetPagination(true);
  }, [condition]);

  return {
    onResetPagination,
    isResetPagination,
  }
}