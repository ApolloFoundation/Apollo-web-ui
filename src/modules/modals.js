import axios from 'axios';
import config from '../config'

export const SET_MODAL_TYPE = 'SET_MODAL_TYPE';
export const SET_MODAL_DATA = 'SET_MODAL_DATA';
export const SET_BODY_MODAL_DATA = 'SET_BODY_MODAL_DATA';
export const SET_MODAL_CALLBACK = 'SET_MODAL_CALLBACK';

const initialState = {
    modalType: null,
    bodyModalType: null,
    modalData: {},
    modalCallback: null
};

export default (state = initialState, action) => {
    switch (action.type) {
        case SET_MODAL_CALLBACK:
            return {
                ...state,
                modalCallback: action.payload
            };
        case SET_MODAL_TYPE:
            return {
                ...state,
                modalType: action.payload
            };
        case SET_MODAL_DATA:
            return {
                ...state,
                modalData: action.payload
            };
        case SET_BODY_MODAL_DATA:
            return {
                ...state,
                bodyModalType: action.payload
            };

        default:
            return state
    }
}

export const setMopalType = (reqParams) => {
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
        console.log('+++++++++++++++++++++++++++++++++');
        console.log(modalCallback);
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
        console.log(getState());

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
            console.log(data);
            if (callback) {
                callback(params);
                return;
            }
            if (modals.modalCallback) modals.modalCallback(data);
        }
    }
};