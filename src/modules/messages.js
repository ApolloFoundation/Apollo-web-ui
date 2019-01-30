
import axios from 'axios';
import {getMessages} from '../actions/messager'

const initState  = {}

const SET_MESSAGES = 'SET_MESSAGES';

export default (state = initState, action)  => {
    switch(action.type) {
        case SET_MESSAGES: 
            return {
                ...state,
                messages: action.payload
            }
        default: return state;
    }
}

const formatMessages = () => {
    return (dispatch, getState) => {

    }
}

export const getMessagesPerpage = (reqPrams) => {
    console.log(reqPrams)
    return async (dispatch, getState) => {
        const {account: {account}} = getState();

        const messages = await dispatch(getMessages({...reqPrams, account}));

        console.log(messages)
    }
}