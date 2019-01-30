/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'
import account from './account'
import modals from './modals'
import messages from './messages'
import settings from "./settings"
import accountSettings from "./accountSettings"
import currencies from "./currencies"

export default combineReducers({
	routing: routerReducer,
    account,
    messages,
    modals,
    settings,
    currencies,
    accountSettings,
})