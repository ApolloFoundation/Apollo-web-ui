/** ****************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ***************************************************************************** */

import store from '../store';

export const SET_MODAL_TYPE = 'SET_MODAL_TYPE';
export const SET_MODAL_DATA = 'SET_MODAL_DATA';
export const SET_MODAL_VALUE = 'SET_MODAL_VALUE';
export const SET_BODY_MODAL_DATA = 'SET_BODY_MODAL_DATA';
export const SET_MODAL_CALLBACK = 'SET_MODAL_CALLBACK';
export const SET_ALERT_DATA = 'SET_ALERT_DATA';

export const SET_SELECTED_BUY_ORDER_INFO = 'SET_SELECTED_BUY_ORDER_INFO';
export const SET_SELECTED_SELL_ORDER_INFO = 'SET_SELECTED_SELL_ORDER_INFO';
export const SET_TYPE_OF_TRADE = 'SET_TYPE_OF_TRADE';
export const RESET_TRADE_OFFER = 'RESET_TRADE_OFFER';

export const SET_AMOUNT_WARNING = 'SET_AMOUNT_WARNING';
export const SET_FEE_WARNING = 'SET_FEE_WARNING';
export const SET_ASSET_WARNING = 'SET_ASSET_WARNING';
export const SET_CURRENCY_WARNING = 'SET_CURRENCY_WARNING';

export const SAVE_SED_MODAL_STATE = 'SAVE_SED_MODAL_STATE';
export const GO_BACK = 'GO_BACK';
export const CLEAR_GO_BACK = 'CLEAR_GO_BACK';

export const CLOSE_MODAL = 'CLOSE_MODAL';

export const OPEN_PREV_MODAL = 'OPEN_PREV_MODAL';
export const SET_DASHBOARD_FORM = 'SET_DASHBOARD_FORM';
export const IS_MODAL_PROCESSING = 'IS_MODAL_PROCESSING';


const initialState = {
  modalType: null,
  bodyModalType: null,
  modalData: {},
  modalCallback: null,
  alertStatus: null,
  alertMessage: null,
  maxAmountWarningStage: 0,
  maxFeeWarningStage: 0,
  maxAssetTransferWarningStage: 0,
  maxCurrencyTransferWarningStage: 0,
  savedValues: {},
  backClicked: false,
  modalsHistory: [],
  infoSelectedBuyOrder: null,
  infoSelectedSellOrder: null,
  typeOfTrade: 'BUY',
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_MODAL_CALLBACK:
      return {
        ...state,
        modalCallback: action.payload,
      };
    case SET_MODAL_TYPE:
      const newArray = state.modalsHistory;
      if (state.modalsHistory.length > 0) {
        newArray[state.modalsHistory.length - 1].value = state.savedValues;
      }
      return {
        ...state,
        modalsHistory: [...newArray, { modalName: action.payload }],
        modalType: action.payload,
      };
    case SET_MODAL_VALUE:
      state.modalsHistory[state.modalsHistory.length - 1].value = action.payload;
      return { ...state };
    case CLOSE_MODAL:
      return {
        ...state,
        modalsHistory: [],
        modalType: null,
        modalData: null,
      };

    case OPEN_PREV_MODAL:
      const modalsHistory = state.modalsHistory.splice(0, state.modalsHistory.length - 1);
      return {
        ...state,
        modalsHistory,
        modalType: modalsHistory[modalsHistory.length - 1].modalName,
        modalData: modalsHistory[modalsHistory.length - 1].modalData,
      };

    case SET_MODAL_DATA:
      const element = state.modalsHistory.pop();
      element.modalData = action.payload;

      // state.modalsHistory.pop();
      return {
        ...state,
        modalData: action.payload,
        modalsHistory: [...state.modalsHistory, element],
      };
    case SET_BODY_MODAL_DATA:
      return {
        ...state,
        bodyModalType: action.payload,
      };
    case SET_AMOUNT_WARNING:
      return {
        ...state,
        maxAmountWarningStage: action.payload,
      };
    case SET_FEE_WARNING:
      return {
        ...state,
        maxFeeWarningStage: action.payload,
      };
    case SET_ASSET_WARNING:
      return {
        ...state,
        maxAssetTransferWarningStage: action.payload,
      };
    case SET_CURRENCY_WARNING:
      return {
        ...state,
        maxCurrencyTransferWarningStage: action.payload,
      };


    case SET_ALERT_DATA:
      return {
        ...state,
        alertStatus: action.payload.status,
        alertMessage: action.payload.message,
      };

    case SAVE_SED_MODAL_STATE:
      return {
        ...state,
        savedValues: action.payload,
      };

    case GO_BACK:
      return {
        ...state,
        backClicked: true,
      };

    case CLEAR_GO_BACK:
      return {
        ...state,
        backClicked: false,
      };

    case SET_DASHBOARD_FORM:
      return {
        ...state,
        dashboardForm: action.payload,
      };

    case IS_MODAL_PROCESSING:
      return {
        ...state,
        isModalProcessing: action.payload,
      };

    case SET_SELECTED_BUY_ORDER_INFO:
      return {
        ...state,
        typeOfTrade: 'BUY',
        infoSelectedBuyOrder: action.payload,
      };

    case SET_SELECTED_SELL_ORDER_INFO:
      return {
        ...state,
        typeOfTrade: 'SELL',
        infoSelectedSellOrder: action.payload,
      };

    case SET_TYPE_OF_TRADE:
      return {
        ...state,
        typeOfTrade: action.payload,
      };

    case RESET_TRADE_OFFER:
      return {
        ...state,
        infoSelectedBuyOrder: {
          pairRate: '',
          offerAmount: '',
          total: 0,
          range: 0,
        },
        infoSelectedSellOrder: {
          pairRate: '',
          offerAmount: '',
          total: '',
          range: 0,
        },
      };

    default:
      return state;
  }
};

export const resetTrade = () => dispatch => {
  dispatch({ type: RESET_TRADE_OFFER });
};

export const setSelectedOrderInfo = stateValues => dispatch => {
  dispatch({
    type: stateValues.type === 'BUY' ? SET_SELECTED_BUY_ORDER_INFO : SET_SELECTED_SELL_ORDER_INFO,
    payload: stateValues,
  });
};

export const setTypeOfTrade = stateValues => dispatch => {
  dispatch({
    type: SET_TYPE_OF_TRADE,
    payload: stateValues,
  });
};

export const saveSendModalState = stateValues => dispatch => {
  dispatch({
    type: SAVE_SED_MODAL_STATE,
    payload: stateValues,
  });
};

export const goBack = () => dispatch => {
  dispatch({ type: GO_BACK });
};

export const openPrevModal = () => dispatch => {
  dispatch({ type: OPEN_PREV_MODAL });
};

export const clearGoBack = () => dispatch => {
  dispatch({ type: CLEAR_GO_BACK });
};

export const closeModal = () => dispatch => {
  dispatch({ type: CLOSE_MODAL });
};

export const setModalType = reqParams => dispatch => {
  if (reqParams) {
    document.querySelector('.modal-window').classList.add('active');
  }

  dispatch({
    type: SET_MODAL_TYPE,
    payload: reqParams,
  });
};

export const setModalCallback = modalCallback => dispatch => {
  dispatch({
    type: SET_MODAL_CALLBACK,
    payload: modalCallback,
  });
};

export const setBodyModalType = reqParams => dispatch => {
  dispatch({
    type: SET_BODY_MODAL_DATA,
    payload: reqParams,
  });
};

export const setBodyModalParamsAction = (type, data, valueForModal) => dispatch => {
  if (!type) {
    dispatch({
      type: CLOSE_MODAL,
      payload: false,
    });
  } else {
    dispatch({
      type: 'SET_FEE_ALERT',
      payload: false,
    });
    dispatch({
      type: SET_MODAL_TYPE,
      payload: type,
    });
    dispatch({
      type: SET_MODAL_DATA,
      payload: data,
    });
    dispatch({
      type: SET_MODAL_VALUE,
      payload: valueForModal,
    });
  }
};

export const setModalData = (data, callback, params) => (dispatch, getState) => {
  const { modals } = getState();

  if (!data) {
    document.querySelector('.modal-window').classList.remove('active');
    setTimeout(() => {
      dispatch({
        type: SET_MODAL_TYPE,
        payload: null,
      });
    }, 300);
  } else {
    document.querySelector('.modal-window').classList.remove('active');
    if (callback) {
      callback(params);
      return;
    }
    if (modals.modalCallback) modals.modalCallback(data);
  }
};

export const setAlert = (status, message) => dispatch => {
  dispatch({
    type: SET_ALERT_DATA,
    payload: {
      status,
      message,
    },
  });

  setTimeout(() => {
    dispatch({
      type: SET_ALERT_DATA,
      payload: {
        status: null,
        message,
      },
    });
  }, 4000);
};

export const clearDashboardForm = form => {
  const { dispatch } = store;

  dispatch({
    type: SET_DASHBOARD_FORM,
    payload: form,
  });
};
