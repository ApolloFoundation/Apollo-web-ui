import { getAccountDataAction } from '../actions/login/index';

export const LOAD_ACCOUNT = 'LOAD_ACCOUNT';
export const START_LOAD = 'START_LOAD';
export const END_LOAD = 'END_LOAD';
export const CHANGE_PAGE_BODY_EVENTS = 'CHANGE_PAGE_BODY_EVENTS';

const initialState = {
	account: null,
    accountRS: null,
    balanceATM: null,
    description: null,
    forgedBalanceATM: null,
    name: null,
    publicKey: null,
    requestProcessingTime: null,
    unconfirmedBalanceATM: null,
    loading: true,
    blockPageBody: false
};

export default (state = initialState, action) => {
	switch (action.type) {
        case LOAD_ACCOUNT:
            const serverRes = action.payload;
            return {
                ...state,
                ...serverRes
            };
        case START_LOAD:
            return {
                ...state,
                loading: true
            };
        case END_LOAD:
            return {
                ...state,
                loading: false
            };
        case CHANGE_PAGE_BODY_EVENTS:
            return {
                ...state,
                blockPageBody: action.payload
            };

		default:
			return state
	}
}


export const login = (reqParams) => {
	return dispatch => {
        dispatch({
			type: LOAD_ACCOUNT,
            payload: reqParams
		});

	}
};

export const startLoad = () => {
	return dispatch => {
        dispatch({
			type: START_LOAD,
            payload: null
		});

	}
};

export const endLoad = () => {
	return dispatch => {
        dispatch({
			type: END_LOAD,
            payload: null
		});
	}
};

/*
* @prevent -> boolean  |
* */
export const setPageEvents = (prevent) => {
    return dispatch => {
        console.log(prevent);
        dispatch({
            type: CHANGE_PAGE_BODY_EVENTS,
            payload: prevent
        })
    }
};