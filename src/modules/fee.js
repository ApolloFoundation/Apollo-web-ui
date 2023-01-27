const initState = {
    isFeeAlert: false,
    minFeeAmount: 1000
};

export const SET_FEE_ALERT        = 'SET_FEE_ALERT';
export const SET_MIN_ALERT_AMOUNT = 'SET_MIN_ALERT_AMOUNT';

export default (state = initState, action) => {
    switch (action.type) {
        case SET_FEE_ALERT: 
            return {
                ...state,
                isFeeAlert: action.payload
            }
        case SET_MIN_ALERT_AMOUNT: 
            return {
                ...state,
                minFeeAmount: action.payload
            }
        default: return state
    }
}