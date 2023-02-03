import { batch } from "react-redux";
import {getBlockAction} from "../../actions/blocks";
import {getTransactionsAction} from "../../actions/transactions";
import {getAccountCurrenciesAction} from "../../actions/currencies";
import {
    getDGSPurchasesAction,
    getDGSGoodsAction,
	getDGSPendingPurchases
} from "../../actions/marketplace";
import {getAccountAssetsAction, getAssetAction} from '../../actions/assets'
import {getAliasesCountAction} from '../../actions/aliases'
import {getMessages} from "../../actions/messager";
import {getAllTaggedDataAction} from "../../actions/datastorage";
import {getActiveShfflings, getShufflingAction} from "../../actions/shuffling";
import {getpollsAction} from "../../actions/polls";
import {getAccountInfoAction} from "../../actions/account";

const calculateCurrencies = (currencies) => {
    return {
        count: currencies.length,
        total: (currencies.length && currencies.map((el) => {
            return parseInt(el.unconfirmedUnits, 10) / Math.pow(10, el.decimals)
        }).reduce((a,b) => {
            return a + b
        })) || 0
    }
}

const calculateAssets =  (assets) => async dispatch => {
    return {
        count: assets.length,
        total: (assets.length && assets.map((el) => {
            return parseInt(el.unconfirmedQuantityATU, 10) / Math.pow(10, el.decimals)
        }).reduce((a,b) => {
            return a + b
        })) || 0,
        distribution: (assets.length && await Promise.all(assets.map((el) => {
            const {asset} = el;
            return dispatch(getAssetAction({asset}))
        }))) || []
    }
}

export const getDashboardData = () => (dispatch, getState) => {
    const {account: {account}} = getState();

    const rquestParams = {
        _transactions: {
            account,
            firstIndex: 0,
            lastIndex: 15
        },
        _accountAssets : {
            account
        },
        _currencies: {
            account,
            includeCurrencyInfo: true
        },
        _aliaseesCount: {
            account
        },
        _messages: {
            account,
            type: 1,
            subscribe: 0
        },
        _taggetData: {
            account
        },
        _activeShuffling: {
            account,
            includeHoldingInfo: true
        },
        _finishedShuffling: {

        },
        _activePolls: {
            account,
            firstIndex: 0,
            lastIndex: 2,
        },
        _accountInfo: {
            account
        }
    }

    const block             = dispatch(getBlockAction());
    const transactions      = dispatch(getTransactionsAction(rquestParams._transactions));
    const currencies        = dispatch(getAccountCurrenciesAction(rquestParams._currencies));
    const accountAssets     = dispatch(getAccountAssetsAction(rquestParams._accountAssets));
    const aliaseesCount     = dispatch(getAliasesCountAction(rquestParams._aliaseesCount));
    const messages          = dispatch(getMessages(rquestParams._messages));
    const dgsGoods          = Promise.all([
                                dispatch(getDGSGoodsAction({seller: account})),
                                dispatch(getDGSPendingPurchases({seller : account})),
                                dispatch(getDGSPurchasesAction({buyer : account})),
                            ]);
    const taggetData        = dispatch(getAllTaggedDataAction(rquestParams._taggetData));
    const activeShuffling   = dispatch(getActiveShfflings(rquestParams._activeShuffling));
    const finishedShuffling = dispatch(getShufflingAction());
    const activePolls       = dispatch(getpollsAction(rquestParams._activePolls));
    const accountInfo       = dispatch(getAccountInfoAction(rquestParams._accountInfo));
    Promise.all([
        block,
        transactions,
        currencies,
        accountAssets,
        aliaseesCount,
        messages,
        dgsGoods,
        taggetData,
        activeShuffling,
        finishedShuffling,
        activePolls,
        accountInfo
    ])
        .then((resolved) => {
            const [block, transactions, currencies, accountAssets, aliaseesCount, messages, dgsGoods, taggetData, activeShuffling, finishedShuffling, activePolls, accountInfo] = resolved;
            const [numberOfGoods, numberOfPurchases, totalPurchases] = dgsGoods;
            batch(() => {
                if (transactions) {
                    dispatch({
                        type: 'SET_DASHBOARD_TRANSACTIONS',
                        payload: transactions.transactions
                    });
                }
                dispatch({
                    type: 'SET_DASHBOARD_CURRENCIES',
                    payload: calculateCurrencies(currencies.accountCurrencies)
                });
                dispatch({
                    type: 'SET_DASHBOARD_ALIASES_COUNT',
                    payload: aliaseesCount.numberOfAliases
                });
                dispatch({
                    type: 'SET_DASHBOARD_DGS_GOODS',
                    payload: {
                        numberOfGoods : numberOfGoods.goods ? numberOfGoods.goods.length : null,
                        numberOfPurchases : numberOfPurchases.purchases ? numberOfPurchases.purchases.length : null,
                        totalPurchases : totalPurchases.purchases ? totalPurchases.purchases.length : null
                    }
                });
                dispatch({
                    type: 'SET_DASHBOARD_MESSAGES_COUNT',
                    payload: messages?.transactions.length
                });
                dispatch({
                    type: 'SET_DASHBOARD_TAGGEDDATA',
                    payload: taggetData.data.length
                });
                dispatch({
                    type: 'SET_DASHBOARD_ACTIVE_SHUFFLING',
                    payload: activeShuffling.shufflings.length
                });
                dispatch({
                    type: 'SET_DASHBOARD_POSSL',
                    payload: activePolls.polls
                });
                dispatch({
                    type: 'SET_DASHBOARD_ACCOUNT_INFO',
                    payload: accountInfo,
                });
                dispatch({
                    type: 'LOAD_ACCOUNT',
                    payload: accountInfo,
                });
            });

            return dispatch(calculateAssets(accountAssets.accountAssets));
        })
        .then((accountAssetsData) => {
            dispatch({
                type: 'SET_DASHBOARD_ASSETS',
                payload: accountAssetsData
            });
        });
};


