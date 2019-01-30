
import axios from 'axios';
import {getMessages} from '../actions/messager'

const initState  = {}

const SET_MESSAGES = 'SET_MESSAGES';

export default (state = initState, action)  => {
    switch(action.type) {
        case SET_MESSAGES: 
            console.log(action.payload)
            return {
                ...state,
                messages: action.payload
            }
        default: return state;
    }
}
