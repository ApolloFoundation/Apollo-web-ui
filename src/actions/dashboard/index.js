import { batch } from "react-redux";
import {getBlockAction} from "actions/blocks";
import {getTransactionsAction} from "actions/transactions";
import {getAccountCurrenciesAction} from "actions/currencies";
import {
    getDGSPurchasesAction,
    getDGSGoodsAction,
	getDGSPendingPurchases
} from "actions/marketplace";
import {getAccountAssetsAction, getAssetAction} from 'actions/assets'
import {getAliasesCountAction} from 'actions/aliases'
import {getMessages} from "actions/messager";
import {getAllTaggedDataAction} from "actions/datastorage";
import {getActiveShfflings, getShufflingAction} from "actions/shuffling";
import {getpollsAction} from "actions/polls";
import {getAccountInfoAction} from "actions/account";
import {
    dashboardAliasCountAction,
    dashboardCurrenciesAction,
    dashboardDGSGoodsAction,
    dashboardTransactionsAction,
    dashbaordMessageCountAction,
    dashboardTagDataAction,
    dashbaordActiveShufflinfAction,
    dashboardPollsAction,
    dashboardAccountInfoAction,
    dashboardAssetsAction
} from "modules/dashboard";
import { loadAccountAction } from "modules/account";

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
                    dispatch(dashboardTransactionsAction(transactions.transactions));
                }

                dispatch(dashboardCurrenciesAction(calculateCurrencies(currencies.accountCurrencies)));

                dispatch(dashboardAliasCountAction(aliaseesCount.numberOfAliases));

                dispatch(dashboardDGSGoodsAction({
                    numberOfGoods : numberOfGoods?.goods?.length ?? null,
                    numberOfPurchases : numberOfPurchases?.purchases?.length ?? null,
                    totalPurchases : totalPurchases?.purchases?.length ?? null
                }));

                dispatch(dashbaordMessageCountAction(messages?.transactions.length))

                dispatch(dashboardTagDataAction(taggetData?.data.length));

                dispatch(dashbaordActiveShufflinfAction(activeShuffling?.shufflings.length));

                dispatch(dashboardPollsAction(activePolls.polls));
                dispatch(dashboardAccountInfoAction(accountInfo));
                dispatch(loadAccountAction(accountInfo));
            });

            return dispatch(calculateAssets(accountAssets.accountAssets));
        })
        .then((accountAssetsData) => {
            dispatch(dashboardAssetsAction(accountAssetsData));
        });
};


