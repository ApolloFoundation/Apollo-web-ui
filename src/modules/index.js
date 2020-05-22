/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import { combineReducers } from 'redux'
import account from './account'
import modals from './modals'
import fee from './fee'
import messages from './messages'
import settings from "./settings"
import accountSettings from "./accountSettings"
import currencies from "./currencies"
import ledger from "./ledger"
import dashboard from "./dashboard"
import assets from "./assets";
import marketplace from './marketplace';
import polls from './polls';
import exchange from './exchange';

export default combineReducers({
    account,
    assets,
    messages,
    modals,
    fee,
    settings,
    marketplace,
    currencies,
    dashboard,
    ledger,
    accountSettings,
    polls,
    exchange
})
