import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'
import account from './account'
import modals from './modals'
import settings from "./settings"
import accountSettings from "./accountSettings"

export default combineReducers({
	routing: routerReducer,
    account,
    modals,
    settings,
    accountSettings,
})