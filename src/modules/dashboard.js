const initialState = { dashboardTransactions: null, ledgerId: null };

export default (state = initialState, action) => {
  switch (action.type) {
    case "SET_DASHBOARD_TRANSACTIONS":
      return {
        ...state,
        dashboardTransactions: action.payload,
      };
    case "SET_DASHBOARD_ASSETS":
      return {
        ...state,
        dashboardAssets: action.payload,
      };
    case "SET_DASHBOARD_CURRENCIES":
      return {
        ...state,
        dashboardCurrencies: action.payload,
      };
    case "SET_DASHBOARD_ALIASES_COUNT":
      return {
        ...state,
        dashboardAliasesCount: action.payload,
      };
    case "SET_DASHBOARD_DGS_GOODS":
      return {
        ...state,
        dashboardDgsGoods: action.payload,
      };
    case "SET_DASHBOARD_MESSAGES_COUNT":
      return {
        ...state,
        dashboardMessagesCount: action.payload,
      };
    case "SET_DASHBOARD_TAGGEDDATA":
      return {
        ...state,
        dashboardTaggedData: action.payload,
      };
    case "SET_DASHBOARD_ACTIVE_SHUFFLING":
      return {
        ...state,
        dashboardActiveSuffling: action.payload,
      };
    case "SET_DASHBOARD_POSSL":
      return {
        ...state,
        dashboardActivePolls: action.payload,
      };
    case "SET_DASHBOARD_ACCOUNT_INFO":
      return {
        ...state,
        dashboardAccoountInfo: action.payload,
      };
    case "SET_LEDGER_ID":
      return {
        ...state,
        ledgerId: action.payload,
      };
    default:
      return state;
  }
};

export const setDashboardTransactions = (dispatch) => (transactions) => {
  dispatch({
    type: "SET_DASHBOARD_TRANSACTIONS",
    payload: transactions,
  });
};

export const setLedgerTransactions = (legerId) => (dispatch) => {
  dispatch({
    type: "SET_LEDGER_ID",
    payload: legerId,
  });
};
