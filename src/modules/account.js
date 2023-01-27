/** ****************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ***************************************************************************** */

import { readFromLocalStorage } from "actions/localStorage";

export const LOAD_ACCOUNT = 'LOAD_ACCOUNT';
export const RESET_ACCOUNT = 'RESET_ACCOUNT';
export const SET_CONSTANTS = 'SET_CONSTANTS';
export const START_LOAD = 'START_LOAD';
export const END_LOAD = 'END_LOAD';
export const SET_LOGIN_PROBLEM = 'SET_LOGIN_PROBLEM';
export const CHANGE_PAGE_BODY_EVENTS = 'CHANGE_PAGE_BODY_EVENTS';
export const SET_SETTINGS = 'SET_SETTINGS';
export const UPDATE_NOTIFICATIONS = 'UPDATE_NOTIFICATIONS';
export const SET_PASSPHRASE = 'SET_PASSPHRASE';
export const LOAD_BLOCKCHAIN_STATUS = 'LOAD_BLOCKCHAIN_STATUS';
export const GET_FORGING = 'GET_FORGING';
export const SET_CURRENT_BLOCK = 'SET_CURRENT_BLOCK';
export const SET_ADMIN_PASSWORD = 'SET_ADMIN_PASSWORD';
export const SET_WALLETS = 'SET_WALLETS';
export const SET_BLOCKCHAIN_SETTINGS = 'SET_BLOCKCHAIN_SETTINGS';

const initialState = {
  blockchainStatus: {},
  settings: null,
  constants: {},
  passPhrase: null,
  account: null,
  accountRS: null,
  assetBalances: null,
  balanceATM: null,
  description: null,
  forgedBalanceATM: null,
  name: null,
  gasTransactionMultiply: 6,
  publicKey: null,
  requestProcessingTime: null,
  unconfirmedBalanceATM: null,
  loading: true,
  blockPageBody: false,
  isShareMessage: false,
  shareMessageTransaction: '',
  isLocalhost: window.location.hostname === 'localhost',
  mobileSettings: {
    is_check_remember_me: false,
    is_store_remembered_passphrase: (window.cordova !== undefined), // too early to use feature detection
    is_simulate_app: false,
    is_testnet: false,
    remote_node_address: '',
    remote_node_port: 7876,
    is_remote_node_ssl: false,
    validators_count: 3,
    bootstrap_nodes_count: 5,
  },
  wallets: null,
  ticker: 'APL',
  decimals: 100000000,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case LOAD_ACCOUNT:
      const serverRes = action.payload;
      return {
        ...state,
        ...serverRes,
      };
    case RESET_ACCOUNT:
      return {
        ...state,
        ...initialState,
        ticker: state.ticker,
        decimals: state.decimals,
      };
    case SET_CONSTANTS:
      return {
        ...state,
        constants: action.payload,
      };

    case START_LOAD:
      return {
        ...state,
        loading: true,
      };
    case END_LOAD:
      return {
        ...state,
        loading: false,
      };
    case SET_LOGIN_PROBLEM:
      return {
        ...state,
        loginProblem: action.payload,
      };
    case CHANGE_PAGE_BODY_EVENTS:
      return {
        ...state,
        blockPageBody: action.payload,
      };
    case SET_SETTINGS:
      return {
        ...state,
        settings: action.payload,
      };

    case UPDATE_NOTIFICATIONS:
      return {
        ...state,
        notifications: action.payload,
      };

    case SET_PASSPHRASE:
      return {
        ...state,
        passPhrase: action.payload,
      };
    case GET_FORGING:
      return {
        ...state,
        forgingStatus: action.payload,
      };
    case SET_BLOCKCHAIN_SETTINGS:
      return {
        ...state,
        ticker: action.payload.ticker,
        decimals: action.payload.decimals,
      };
    case SET_CURRENT_BLOCK:
      return {
        ...state,
        currentBlock: action.payload,
      };
    case SET_ADMIN_PASSWORD:
      const adminPassword = readFromLocalStorage('adminPassword');
      const parsed = JSON.parse(adminPassword);
      if (parsed && parsed.adminPassword) {
        return {
          ...state,
          adminPassword: parsed.adminPassword,
        };
      }
      return state;

    case LOAD_BLOCKCHAIN_STATUS:
      return {
        ...state,
        blockchainStatus: action.payload,
      };
    case 'SET_ACTUAL_BLOCK':
      return {
        ...state,
        actualBlock: action.payload.actualBlock,
        timestamp: action.payload.timestamp,
      };

    case SET_WALLETS:
      return {
        ...state,
        wallets: action.payload,
      };

    default:
      return state;
  }
};

export const setTicker = reqParams => dispatch => {
  dispatch({
    type: SET_BLOCKCHAIN_SETTINGS,
    payload: reqParams,
  });
};

export const login = reqParams => dispatch => {
  dispatch({
    type: LOAD_ACCOUNT,
    payload: reqParams,
  });
};
export const logout = () => dispatch => {
  dispatch({ type: RESET_ACCOUNT });
};

export const loadConstants = constants => ({
  type: SET_CONSTANTS,
  payload: constants,
});

export const setSetings = settings => dispatch => {
  dispatch({
    type: SET_SETTINGS,
    payload: settings,
  });
};

export const updateStoreNotifications = notifications => dispatch => {
  dispatch({
    type: UPDATE_NOTIFICATIONS,
    payload: notifications,
  });
};

export const startLoad = () => dispatch => {
  dispatch({
    type: START_LOAD,
    payload: null,
  });
};

export const endLoad = () => dispatch => {
  dispatch({
    type: END_LOAD,
    payload: null,
  });
  dispatch({ type: SET_ADMIN_PASSWORD });
};

/*
* @prevent -> boolean  |
* */
export const setPageEvents = prevent => dispatch => {
  dispatch({
    type: CHANGE_PAGE_BODY_EVENTS,
    payload: prevent,
  });
};

export const setAccountPassphrase = passPhrase => dispatch => {
  dispatch({
    type: SET_PASSPHRASE,
    payload: passPhrase,
  });
};

export const getState = () => (dispatch, getStore) => {
  const { account } = getStore();
  return account;
};

export const setWallets = wallets => dispatch => {
  dispatch({
    type: SET_WALLETS,
    payload: wallets,
  });
};
