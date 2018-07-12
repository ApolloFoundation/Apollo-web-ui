import { getAccountDataAction } from '../actions/login/index';

export const LOAD_ACCOUNT = 'LOAD_ACCOUNT';

const initialState = {
	account: null,
    accountRS: null,
    balanceATM: null,
    description: null,
    forgedBalanceATM: null,
    name: null,
    publicKey: null,
    requestProcessingTime: null,
    unconfirmedBalanceATM: null
};

export default (state = initialState, action) => {
	switch (action.type) {
        case LOAD_ACCOUNT:
            const serverRes = action.payload;
            return {
                ...state,
                ...serverRes
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


// async getServerData() {
//
// }