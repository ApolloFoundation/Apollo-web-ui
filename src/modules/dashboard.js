const initialState = { dashboardTransactions: null };

export const SET_DASHBOARD_POLLS = 'SET_DASHBOARD_POLLS';
export const SET_DASHBOARD_ACCOUNT_INFO = 'SET_DASHBOARD_ACCOUNT_INFO';
export const SET_DASHBOARD_ASSETS = 'SET_DASHBOARD_ASSETS';
export const SET_DASHBOARD_TRANSACTIONS = 'SET_DASHBOARD_TRANSACTIONS';
export const SET_DASHBOARD_CURRENCIES = 'SET_DASHBOARD_CURRENCIES';
export const SET_DASHBOARD_ALIASES_COUNT = 'SET_DASHBOARD_ALIASES_COUNT';
export const SET_DASHBOARD_DGS_GOODS = 'SET_DASHBOARD_DGS_GOODS';
export const SET_DASHBOARD_MESSAGES_COUNT = 'SET_DASHBOARD_MESSAGES_COUNT';
export const SET_DASHBOARD_TAGGEDDATA = 'SET_DASHBOARD_TAGGEDDATA';
export const SET_DASHBOARD_ACTIVE_SHUFFLING = 'SET_DASHBOARD_ACTIVE_SHUFFLING';

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_DASHBOARD_TRANSACTIONS:
      return {
        ...state,
        dashboardTransactions: action.payload,
      };
    case SET_DASHBOARD_ASSETS:
      return {
        ...state,
        dashboardAssets: action.payload,
      };
    case SET_DASHBOARD_CURRENCIES:
      return {
        ...state,
        dashboardCurrencies: action.payload,
      };
    case SET_DASHBOARD_ALIASES_COUNT:
      return {
        ...state,
        dashboardAliasesCount: action.payload,
      };
    case SET_DASHBOARD_DGS_GOODS:
      return {
        ...state,
        dashboardDgsGoods: action.payload,
      };
    case SET_DASHBOARD_MESSAGES_COUNT:
      return {
        ...state,
        dashboardMessagesCount: action.payload,
      };
    case SET_DASHBOARD_TAGGEDDATA:
      return {
        ...state,
        dashboardTaggedData: action.payload,
      };
    case SET_DASHBOARD_ACTIVE_SHUFFLING:
      return {
        ...state,
        dashboardActiveSuffling: action.payload,
      };
    case SET_DASHBOARD_POLLS:
      return {
        ...state,
        dashboardActivePolls: action.payload,
      };
    case SET_DASHBOARD_ACCOUNT_INFO:
      return {
        ...state,
        dashboardAccoountInfo: action.payload,
      };
    default:
      return state;
  }
};

export const dashboardTransactionsAction =transactions => ({
    type: SET_DASHBOARD_TRANSACTIONS,
    payload: transactions,
});

export const dashboardCurrenciesAction = (currencies) => ({
  type: SET_DASHBOARD_CURRENCIES,
  payload: currencies,
});

export const dashboardAliasCountAction = (aliasCount) => ({
  type: SET_DASHBOARD_ALIASES_COUNT,
  payload: aliasCount,
});

export const dashboardDGSGoodsAction = (data) => ({
  type: SET_DASHBOARD_DGS_GOODS,
  payload: data,
});

export const dashbaordMessageCountAction = (count) => ({
  type: SET_DASHBOARD_MESSAGES_COUNT,
  payload: count,
});

export const dashboardTagDataAction = (count) => ({
  type: SET_DASHBOARD_TAGGEDDATA,
  payload: count,
});

export const dashbaordActiveShufflinfAction = (data) => ({
  type: SET_DASHBOARD_ACTIVE_SHUFFLING,
  payload: data
});

export const dashboardPollsAction = (polls) => ({
  type: SET_DASHBOARD_POLLS,
  payload: polls,
});

export const dashboardAccountInfoAction = (accountInfo) => ({
  type: SET_DASHBOARD_ACCOUNT_INFO,
  payload: accountInfo, 
});

export const dashboardAssetsAction = (data) => ({
  type: SET_DASHBOARD_ASSETS,
  payload: data
});