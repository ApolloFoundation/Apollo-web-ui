import {getTransactionsAction}   from '../../actions/transactions/';
import {getAccountLedgerAction}  from '../../actions/ledger/';
import {getAliasesAction}        from '../../actions/currencies/';
import {getAssetsAction}         from '../../actions/assets';
import {getTradesAction}         from '../../actions/trade-history';
import {getAllCurrenciesAction}  from '../../actions/currencies';
import {getDGSGoodsAction}       from '../../actions/marketplace';

export function getAccountAction(reqParams) {
    return dispatch => {
        return {
            'TRANSACTIONS':   dispatch(getTransactionsAction(reqParams)),
            'ACCOUNT_LEDGER': dispatch(getAccountLedgerAction(reqParams)),
            'ASSETS':         dispatch(getAssetsAction(reqParams)),
            'TRADES':         dispatch(getTradesAction(reqParams)),
            'CURRENCIES':     dispatch(getAllCurrenciesAction(reqParams)),
            'GOODS':          dispatch(getDGSGoodsAction(reqParams)),
            'ALIASES':        dispatch(getAliasesAction(reqParams)),
        }
    }
}