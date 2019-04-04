/******************************************************************************
 * Copyright © 2019 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/

export const SET_CURRENT_CURRENCY = "SET_CURRENT_CURRENCY";

const initState = {
    currencies: ['btc', 'eth', 'pax'],
    currentCurrency: {
        currency: 'eth',
    }
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
