import { useCallback, useState } from "react";

export const useLoading = (defaultValue = false) => {
  const [isLoading, setIsLoading] = useState(defaultValue);

  const setLoadingTrue = useCallback(() => {
    setIsLoading(true);
  }, [setIsLoading]);

  const setLoadingFalse = useCallback(() => {
    setIsLoading(false);
  }, [setIsLoading]);

  return {
    isLoading,
    setLoadingTrue,
    setLoadingFalse,
  }
};
