/******************************************************************************
 * Copyright © 2019 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/

export const SET_CURRENT_CURRENCY = "SET_CURRENT_CURRENCY";
export const SET_BUY_ORDERS = "SET_BUY_ORDERS";
export const SET_SELL_ORDERS = "SET_SELL_ORDERS";
export const SET_PLOT_BUY_ORDERS = "SET_PLOT_BUY_ORDERS";
export const SET_PLOT_SELL_ORDERS = "SET_PLOT_SELL_ORDERS";
export const SET_MY_ORDERS = "SET_MY_ORDERS";
export const SET_MY_TRADE_HISTORY = "SET_MY_TRADE_HISTORY";
export const SET_MY_ORDER_HISTORY = "SET_MY_ORDER_HISTORY";
export const SET_CONTRACT_STATUS = "SET_CONTRACT_STATUS";
export const SET_ALL_CONTRACT_STATUS = "SET_ALL_CONTRACT_STATUS";

const initState = {
    currencies: ['btc', 'eth', 'pax'],
    currentCurrency: {
        currency: 'eth',
    },

    buyOrders: {},
    buyOrdersPagination: {
        page: 1,
        firstIndex: 0,
        lastIndex: 15,
    },

    sellOrders: {},
    sellOrdersPagination: {
        page: 1,
        firstIndex: 0,
        lastIndex: 15,
    },

    plotBuyOrders: {},
    plotSellOrders: {},
    myOrders: {},
    myOrderHistory: null,
    myTradeHistory: {},
    contractStatus: null,
    allContractStatus: null,
};

export default (state = initState, {type, payload}) => {
    switch (type) {
        case SET_CURRENT_CURRENCY:
            return {
                ...state,
                currentCurrency: {
                    currency: payload
                }
            };
        case SET_BUY_ORDERS:
            return {
                ...state,
                buyOrders: {
                    ...state.buyOrders,
                    [payload.currency]: payload.orders,
                },
                buyOrdersPagination: {
                    ...state.buyOrdersPagination,
                    ...payload.pagination,
                }
            };
        case SET_SELL_ORDERS:
            return {
                ...state,
                sellOrders: {
                    ...state.sellOrders,
                    [payload.currency]: payload.orders,
                },
                sellOrdersPagination: {
                    ...state.sellOrdersPagination,
                    ...payload.pagination,
                }
            };
        case SET_PLOT_BUY_ORDERS:
            return {
                ...state,
                plotBuyOrders: {
                    ...state.plotBuyOrders,
                    [payload.currency]: payload.orders,
                }
            };
        case SET_PLOT_SELL_ORDERS:
            return {
                ...state,
                plotSellOrders: {
                    ...state.plotSellOrders,
                    [payload.currency]: payload.orders,
                }
            };
        case SET_MY_ORDERS:
            return {
                ...state,
                myOrders: {
                    ...state.myOrders,
                    [payload.currency]: payload.orders,
                }
            };
        case SET_MY_ORDER_HISTORY:
            return {
                ...state,
                myOrderHistory: payload.orders,
            };
        case SET_MY_TRADE_HISTORY:
            return {
                ...state,
                myTradeHistory: {
                    ...state.myTradeHistory,
                    [payload.currency]: payload.orders || [],
                }
            };

        case SET_CONTRACT_STATUS:
            return {
                ...state,
                contractStatus: payload.statusInfo,
            };

        case SET_ALL_CONTRACT_STATUS:
            return {
                ...state,
                allContractStatus: payload.allStatusInfo,
            };
        default:
            return state;
    }
}

export const setCurrentCurrencyAction = (currency) => dispatch => {
    dispatch({
        type: SET_CURRENT_CURRENCY,
        payload: currency
    })
};

export const setBuyOrdersAction = (currency, orders, pagination) => dispatch => {
    dispatch({
        type: SET_BUY_ORDERS,
        payload: {
            currency,
            orders,
            pagination,
        }
    })
};

export const setSellOrdersAction = (currency, orders, pagination) => dispatch => {
    dispatch({
        type: SET_SELL_ORDERS,
        payload: {
            currency,
            orders,
            pagination,
        }
    })
};

export const setPlotBuyOrdersAction = (currency, orders) => dispatch => {
    dispatch({
        type: SET_PLOT_BUY_ORDERS,
        payload: {
            currency,
            orders,
        }
    })
};

export const setPlotSellOrdersAction = (currency, orders) => dispatch => {
    dispatch({
        type: SET_PLOT_SELL_ORDERS,
        payload: {
            currency,
            orders,
        }
    })
};

export const setMyOrdersAction = (currency, orders) => dispatch => {
    dispatch({
        type: SET_MY_ORDERS,
        payload: {
            currency,
            orders,
        }
    })
};

export const setMyOrderHistoryAction = (orders) => dispatch => {
    dispatch({
        type: SET_MY_ORDER_HISTORY,
        payload: {
            orders,
        }
    })
};

export const setMyTradeHistoryAction = (currency, orders) => dispatch => {
    dispatch({
        type: SET_MY_TRADE_HISTORY,
        payload: {
            currency,
            orders,
        }
    })
};

export const setContractStatus = (statusInfo) => dispatch => {
    dispatch({
        type: SET_CONTRACT_STATUS,
        payload: {
            statusInfo,
        }
    })
};

export const setAllContractStatus = (allStatusInfo) => dispatch => {
    dispatch({
        type: SET_ALL_CONTRACT_STATUS,
        payload: {
            allStatusInfo,
        }
    })
};
