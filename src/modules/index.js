/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'
import account from './account'
import modals from './modals'
import fee from './fee'
import messages from './messages'
import settings from "./settings"
import accountSettings from "./accountSettings"
import currencies from "./currencies"
import ledger from "./ledger"
import dashboard from "./dashboard"

export default combineReducers({
	routing: routerReducer,
    account,
    messages,
    modals,
    fee,
    settings,
    currencies,
    dashboard,
    ledger,
    accountSettings,
})