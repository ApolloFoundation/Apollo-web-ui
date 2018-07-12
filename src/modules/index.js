import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'
import account from './account'

export default combineReducers({
	routing: routerReducer,
    account
})