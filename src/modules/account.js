import { getAccountDataAction } from '../actions/login/index';

export const LOAD_ACCOUNT = 'account/LOAD_ACCOUNT';

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
            let loadedAccountData = Promise.resolve(getAccountDataAction(action.reqParams));
            loadedAccountData
                .then((data) => {
                    console.log(data);
                });

            console.log(loadedAccountData);
            // account:               res.data.account,
            // accountRS:             res.data.accountRS,
            // balanceATM:            res.data.balanceATM,
            // description:           res.data.description,
            // forgedBalanceATM:      res.data.forgedBalanceATM,
            // name:                  res.data.name,
            // publicKey:             res.data.publicKey,
            // requestProcessingTime: res.data.requestProcessingTime,
            // unconfirmedBalanceATM: res.data.unconfirmedBalanceATM

		default:
			return state
	}
}


export const login = (reqParams) => {
	return dispatch => {
		dispatch({
			type: LOAD_ACCOUNT,
            reqParams: reqParams
		});

	}
};


// async getServerData() {
//
// }