import { useCallback } from "react";

export const useExchangeWalletConverts = () => {
  const converWallets = useCallback((data) => {
    return data.currencies.reduce((acc,item) => {
      acc[item.currency] = item.wallets.map(walletItem => walletItem.address); 
      return acc;
    }, {});
  }, []);
  
  return { converWallets };
} 