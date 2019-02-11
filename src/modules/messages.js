
const initState  = {}

const SET_MESSAGES      = 'SET_MESSAGES';
const SET_CHAT_MESSAGES = 'SET_CHAT_MESSAGES';
const SET_CHATS         = 'SET_CHATS';

export default (state = initState, action)  => {
    switch(action.type) {
        case SET_MESSAGES: 
            return {
                ...state,
                messages: action.payload
            }
        case SET_CHAT_MESSAGES: 
            return {
                ...state,
                chatMessages: action.payload
            }
        case SET_CHATS: 
            return {
                ...state,
                chats: action.payload
            }
            
        default: return state;
    }
}

