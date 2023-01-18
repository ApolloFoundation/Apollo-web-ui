export const getAccountSelector = state => state.account.account;
export const getAccountRsSelector = state => state.account.accountRS;
export const getPassPhraseSelector = state => state.account.passPhrase;
export const getMessagesSelector = state => state.messages.messages; // array
export const getDecimalsSelector = state => state.account.decimals;
export const getTickerSelector = state => state.account.ticker;
export const getSettingsSelector = state => state.accountSettings;
export const get2FASelector = state => state.account.is2FA;
export const getIsLocalhostSelector = state => state.account.isLocalhost;
export const getModalsSelector = state => state.modals;
export const getAccountInfoSelector = state => state.account;
export const getAdminPasswordSelector = state => state.account.adminPassword;
export const getBlockTimeSelector = state => state.account.blockchainStatus
  ? state.account.blockchainStatus.blockTime : null;
export const getForgedBalanceSelector = state => state.account.forgedBalanceATM;
export const getBalanceATMSelector = state => state.account.balanceATM;
export const getAssetBalanceSelector = state => state.account.assetBalances; // array
export const getModalDataSelector = state => state.modals.modalData;  // object or string
export const getModalHistorySelector = state => state.modals.modalsHistory; // array of object
export const getAccountPublicKeySelector = state => state.account.publicKey;
export const getModalCallbackSelector = state => state.modals.modalCallback; // function or null
export const getConstantsSelector = state => state.account.constants; // object of contants data
export const getBlockchainStatusSelector = state => state.account.blockchainStatus
export const getActualBlockSelector = state => state.account.actualBlock;
export const getAssetsSelector = state => state.assets; // object
export const getDashboardInfoSelector = state => state.dashboard; // object
export const getExchangeInfoSelector = state => state.exchange; // object
export const getTotalPurchasedProductsSelector = state =>
  state.marketplace.marketplaceGeneral?.totalPurchasedProducts ?? null; // Array or null
export const getChainIdSelector = state => state.account.blockchainStatus.chainId;