
const initState = {
    page: 1,
    ledger: null
}

const SET_PAGE = 'SET_PAGE';
const SET_LEGDER = 'SET_LEGDER';

export default (state = initState, action) => {
    switch (action.type) {
        case SET_PAGE: 
            return {
                ...state,
                page: action.payload
            }
        case SET_LEGDER: 
            return {
                ...state,
                ledger: action.payload
            }
        default: return state;
    }
}
