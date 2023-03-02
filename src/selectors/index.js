import { bigIntDivision, bigIntFormat } from "helpers/util/bigNumberWrappers";

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
export const getBlockchainStatusSelector = state => state.account.blockchainStatus // object
export const getActualBlockSelector = state => state.account.actualBlock;
export const getAssetsSelector = state => state.assets; // object
export const getDashboardInfoSelector = state => state.dashboard; // object
export const getExchangeInfoSelector = state => state.exchange; // object
export const getTotalPurchasedProductsSelector = state =>
  state.marketplace.marketplaceGeneral?.totalPurchasedProducts ?? null; // Array or null
export const getChainIdSelector = state => state.account.blockchainStatus.chainId;
export const getExchangeCurrencySelector = state => state.exchange.currentCurrency.currency; // object
export const getFollowedPollsSelector = state => state.polls.followedPolls; //Array
export const getUnconfirmedBalanceATMSelector = state => state.account.unconfirmedBalanceATM;
export const getChatMessagesSelector = state => state.messages.chatMessages;
export const getChatsSelector = state => state.messages.chats;
export const getLoadingSelector = state => state.account.loading;
export const getBlockPageBodySelector = state => state.account.blockPageBody;
export const getModalTypeSelector = state => state.modals.modalType;
export const getBodyModalTypeSelector = state => state.modals.bodyModalType;
export const getAccountControlsSelector = state => state.account.accountControls;
export const getLoginProblemSelector = state => state.account.loginProblem;
export const getNotificationSelector = state => state.account.notifications;
export const getForgingStatusSelector = state => state.account.forgingStatus;
export const getEffectiveBalanceAplSelector = state => state.account.effectiveBalanceAPL;
export const getAccountNameSelector = state => state.account.name;
export const getCurrentLesseeSelector = state => state.account.currentLessee;
export const getCurrentLeasingHeightFromSelector = state => state.account.currentLeasingHeightFrom;
export const getCurrentLeasingHeightToSelector = state => state.account.currentLeasingHeightTo;
export const getIsModalProcessingSelector = state => state.modals.isModalProcessing;

export const getEffectiveBalanceCalculateSelector = state => {
  const { dashboardAccoountInfo } = getDashboardInfoSelector(state);
  const decimals = getDecimalsSelector(state);
  return dashboardAccoountInfo.unconfirmedBalanceATM 
    ? bigIntFormat(bigIntDivision(dashboardAccoountInfo.unconfirmedBalanceATM, decimals)) : 0;
}