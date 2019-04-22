/******************************************************************************
 * Copyright © 2019 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/

export const SET_CURRENT_CURRENCY = "SET_CURRENT_CURRENCY";
export const SET_BUY_ORDERS = "SET_BUY_ORDERS";
export const SET_SELL_ORDERS = "SET_SELL_ORDERS";
export const SET_MY_ORDERS = "SET_MY_ORDERS";
export const SET_MY_ORDER_HISTORY = "SET_MY_ORDER_HISTORY";

const initState = {
    currencies: ['btc', 'eth', 'pax'],
    currentCurrency: {
        currency: 'eth',
    },
    buyOrders: {},
    sellOrders: {},
    myOrders: {},
    myOrderHistory: {},
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
                }
            };
        case SET_SELL_ORDERS:
            return {
                ...state,
                sellOrders: {
                    ...state.sellOrders,
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
                myOrderHistory: {
                    ...state.myOrderHistory,
                    [payload.currency]: payload.orders,
                }
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

export const setBuyOrdersAction = (currency, orders) => dispatch => {
    dispatch({
        type: SET_BUY_ORDERS,
        payload: {
            currency,
            orders,
        }
    })
};

export const setSellOrdersAction = (currency, orders) => dispatch => {
    dispatch({
        type: SET_SELL_ORDERS,
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

export const setMyOrderHistoryAction = (currency, orders) => dispatch => {
    dispatch({
        type: SET_MY_ORDER_HISTORY,
        payload: {
            currency,
            orders,
        }
    })
};
