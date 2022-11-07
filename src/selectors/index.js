export const getAccountSelector = state => state.account.account;
export const getAccountRsSelector = state => state.account.account;
export const getPassPhraseSelector = state => state.account.passPhrase;
export const getMessagesSelector = state => state.messages.messages;
export const getDecimalsSelector = state => state.account.decimals;
export const getTickerSelector = state => state.account.ticker;
export const getSettingsSelector = state => state.accountSettings;
export const get2FASelector = state => state.account.is2FA;
export const getIsLocalhostSelector = state => state.account.isLocalhost;
export const getMdalsSelector = state => state.modals;
export const getAccountInfoSelector = state => state.account;
export const getAdminPasswordSelector = state => state.account.adminPassword;
export const getBlockTimeSelector = state => state.account.blockchainStatus
  ? state.account.blockchainStatus.blockTime : null;
export const getForgedBalanceSelector = state => state.account.forgedBalanceATM;
export const getBalanceATMSelector = state => state.account.balanceATM;
export const getAssetBalanceSelector = state => state.account.assetBalances;
export const getModalDataSelector = state => state.modals.modalData;
export const getModalHistorySelector = state => state.modals.modalsHistory;
export const getAccountPublicKey = state => state.account.publicKey;