/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import axios from 'axios';
import config from '../config'

export const SET_MODAL_TYPE = 'SET_MODAL_TYPE';
export const SET_MODAL_DATA = 'SET_MODAL_DATA';
export const SET_BODY_MODAL_DATA = 'SET_BODY_MODAL_DATA';
export const SET_MODAL_CALLBACK = 'SET_MODAL_CALLBACK';
export const SET_ALERT_DATA = 'SET_ALERT_DATA';



export const SET_AMOUNT_WARNING = 'SET_AMOUNT_WARNING';
export const SET_FEE_WARNING = 'SET_FEE_WARNING';
export const SET_ASSET_WARNING = 'SET_ASSET_WARNING';
export const SET_CURRENCY_WARNING = 'SET_CURRENCY_WARNING';

export const SAVE_SED_MODAL_STATE = 'SAVE_SED_MODAL_STATE';
export const GO_BACK = 'GO_BACK';
export const CLEAR_GO_BACK = 'CLEAR_GO_BACK';

export const CLOSE_MODAL = 'CLOSE_MODAL';

export const OPEN_PREV_MODAL = 'OPEN_PREV_MODAL';

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
	modalsHistory: []
};

export default (state = initialState, action) => {
    switch (action.type) {
        case SET_MODAL_CALLBACK:
            return {
                ...state,
                modalCallback: action.payload
            };
        case SET_MODAL_TYPE:
            const newArray = state.modalsHistory;
            if(state.modalsHistory.length > 0){
	            newArray[state.modalsHistory.length-1].value = state.savedValues;
            }
            return {
                ...state,
	            modalsHistory: [...newArray, {modalName: action.payload}],
	            modalType: action.payload,
            };

        case CLOSE_MODAL:
            return {
                ...state,
	            modalsHistory: []
            };

        case OPEN_PREV_MODAL:
            const modalsHistory = state.modalsHistory.splice(0,state.modalsHistory.length-1);
            return {
                ...state,
	            modalsHistory: modalsHistory,
	            modalType: modalsHistory[modalsHistory.length-1].modalName,
	            modalData: modalsHistory[modalsHistory.length-1].modalData,
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
                alertMessage: action.payload.message
            };

        case SAVE_SED_MODAL_STATE:
	        return {
		        ...state,
		        savedValues: action.payload
	        };

        case GO_BACK:
	        return {
		        ...state,
		        backClicked: true
	        };

        case CLEAR_GO_BACK:
	        return {
		        ...state,
		        backClicked: false
	        };

        default:
            return state
    }
}


export const saveSendModalState = (stateValues) => dispatch => {
	dispatch({
		type: SAVE_SED_MODAL_STATE,
		payload: stateValues
	});
};

export const goBack = () => dispatch => {
	dispatch({
		type: GO_BACK
	});
};

export const openPrevModal = () => dispatch => {
	dispatch({
		type: OPEN_PREV_MODAL
	});
};

export const clearGoBack = () => dispatch => {
	dispatch({
		type: CLEAR_GO_BACK
	});
};

export const closeModal = () => dispatch => {
	dispatch({
		type: CLOSE_MODAL
	});
};



export const setModalType = (reqParams) => {
    return dispatch => {
        if (reqParams) {
            document.querySelector('.modal-window').classList.add('active');
        }

        dispatch({
            type: SET_MODAL_TYPE,
            payload: reqParams
        });
    }
};

export const setModalCallback = (modalCallback) => {
    return dispatch => {
        dispatch({
            type: SET_MODAL_CALLBACK,
            payload: modalCallback
        });
    }
};

export const setBodyModalType = (reqParams) => {
    return dispatch => {
        dispatch({
            type: SET_BODY_MODAL_DATA,
            payload: reqParams
        });
    }
};

export const setBodyModalParamsAction = (type, data) => {
    return dispatch => {
        dispatch({
            type: SET_MODAL_TYPE,
            payload: type
        });
        dispatch({
            type: SET_MODAL_DATA,
            payload: data
        });
    }
};

export const setModalData = (data, callback, params) => {
    return (dispatch, getState) => {
        const { modals } = getState();

        if (!data) {
            document.querySelector('.modal-window').classList.remove('active');
            setTimeout(() => {
                dispatch({
                    type: SET_MODAL_TYPE,
                    payload: null
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
    }
};

export const setAlert = (status, message) => {
    return dispatch => {
        dispatch({
            type: SET_ALERT_DATA,
            payload: {
                status: status,
                message: message
            }
        });

        setTimeout(() => {
            dispatch({
                type: SET_ALERT_DATA,
                payload: {
                    status: null,
                    message: message
                }
            })
        }, 4000)
    }
};