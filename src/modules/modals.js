import axios from 'axios';
import config from '../config'

export const SET_MODAL_TYPE = 'SET_MODAL_TYPE';
export const SET_MODAL_DATA = 'SET_MODAL_DATA';
export const SET_BODY_MODAL_DATA = 'SET_BODY_MODAL_DATA';

const initialState = {
    modalType: null,
    bodyModalType: null,
    modalData: {}
};

export default (state = initialState, action) => {
    switch (action.type) {
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

export const setBodyModalType = (reqParams) => {
    return dispatch => {
        dispatch({
            type: SET_BODY_MODAL_DATA,
            payload: reqParams
        });
    }
};

export const setModalData = (data) => {
    return dispatch => {
        console.log(data);

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
            dispatch({
                type: SET_MODAL_DATA,
                payload: data
            })
        }
    }
}