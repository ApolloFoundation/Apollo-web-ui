import { getAccountDataAction } from '../actions/login/index';

export const LOAD_ACCOUNT = 'LOAD_ACCOUNT';
export const SET_CONSTANTS = 'SET_CONSTANTS';
export const START_LOAD = 'START_LOAD';
export const END_LOAD = 'END_LOAD';
export const CHANGE_PAGE_BODY_EVENTS = 'CHANGE_PAGE_BODY_EVENTS';
export const SET_SETTINGS = 'SET_SETTINGS';
export const UPDATE_NOTIFICATIONS = 'UPDATE_NOTIFICATIONS';
export const SET_PASSPHRASE = 'SET_PASSPHRASE';
export const LOAD_BLOCKCHAIN_STATUS = 'LOAD_BLOCKCHAIN_STATUS';
export const GET_FORGING = 'GET_FORGING';

const initialState = {
    settings: null,
    constants: null,
    passPhrase: null,
	account: null,
    accountRS: null,
    assetBalances: null,
    balanceATM: null,
    description: null,
    forgedBalanceATM: null,
    name: null,
    publicKey: null,
    requestProcessingTime: null,
    unconfirmedBalanceATM: null,
    loading: true,
    blockPageBody: false,
    mobileSettings: {
        is_check_remember_me: false,
        is_store_remembered_passphrase: (window["cordova"] !== undefined), // too early to use feature detection
        is_simulate_app: false,
        is_testnet: false,
        remote_node_address: "",
        remote_node_port: 7876,
        is_remote_node_ssl: false,
        validators_count: 3,
        bootstrap_nodes_count: 5
    }
};

export default (state = initialState, action) => {
	switch (action.type) {
        case LOAD_ACCOUNT:
            const serverRes = action.payload;
            return {
                ...state,
                ...serverRes
            };
        case SET_CONSTANTS:
            return {
                ...state,
                constants: action.payload
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
        case SET_SETTINGS:
            return {
                ...state,
                settings: action.payload
            };

        case UPDATE_NOTIFICATIONS:
            return {
                ...state,
                notifications: action.payload
            };

        case SET_PASSPHRASE:
            return {
                ...state,
                passPhrase: action.payload
            };
        case GET_FORGING:
            return {
                ...state,
                forgingStatus: action.payload
            };
        case LOAD_BLOCKCHAIN_STATUS:
            return {
                ...state,
                blockchainStatus: action.payload
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

export const loadConstants = (constants) => {
    return dispatch => {
        dispatch({
            type: SET_CONSTANTS,
            payload: constants
        });

    }
};

export const setSetings = (settings) => {
    return dispatch => {
        dispatch({
            type: SET_SETTINGS,
            payload: settings
        });

    }
};

export const updateStoreNotifications = (notifications) => {
    return dispatch => {
        dispatch({
            type: UPDATE_NOTIFICATIONS,
            payload: notifications
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
        dispatch({
            type: CHANGE_PAGE_BODY_EVENTS,
            payload: prevent
        })
    }
};

export const setAccountPassphrase = (passPhrase) => {
    return dispatch => {
        dispatch({
            type: SET_PASSPHRASE,
            payload: passPhrase
        });
    }
};

export const getState = () => {
    return (dispatch, getStore) => {
        const { account } = getStore();
        return account
    }
};
