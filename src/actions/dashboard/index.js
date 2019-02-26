import {getBlockAction} from "../../actions/blocks";
import {getTransactionsAction} from "../../actions/transactions";
import {getAccountCurrenciesAction} from "../../actions/currencies";
import {
	getDGSGoodsCountAction,
	getDGSPurchaseCountAction,
	getDGSPurchasesAction,
	getDGSPendingPurchases
} from "../../actions/marketplace";
import {getAccountAssetsAction, getAssetAction, getSpecificAccountAssetsAction} from '../../actions/assets'
import {getAliasesCountAction} from '../../actions/aliases'
import {getMessages} from "../../actions/messager";
import {getNewsAction} from "../../actions/account";
// import {BlockUpdater} from "../../block-subscriber/index";
import {getAllTaggedDataAction} from "../../actions/datastorage";
import {getActiveShfflings, getShufflingAction} from "../../actions/shuffling";
import {getpollsAction} from "../../actions/polls";
import {getAccountInfoAction} from "../../actions/account";

export const getDashboardData = () => (dispatch, getState, subscribe) => {

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
            includeFinished: true
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
                                getDGSGoodsCountAction({account}),
                                getDGSPurchaseCountAction({account}),
                                getDGSPurchasesAction(),
                            ]); 
    const news              = dispatch(getNewsAction()); 
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
        news,    
        taggetData,        
        activeShuffling,   
        finishedShuffling, 
        activePolls,       
        accountInfo       
    ])
        .then(async (resolved) => {
            const [block, transactions, currencies, accountAssets, aliaseesCount, messages, dgsGoods, news, taggetData, activeShuffling, finishedShuffling, activePolls] = resolved;
            const [numberOfGoods, numberOfPurchases, totalPurchases] = dgsGoods;
            
            dispatch({
                type: 'SET_DASHBOARD_TRANSACTIONS',
                payload: transactions.transactions
            })
            dispatch({
                type: 'SET_DASHBOARD_ASSETS',
                payload: await dispatch(calculateAssets(accountAssets.accountAssets))
            })
            dispatch({
                type: 'SET_DASHBOARD_CURRENCIES',
                payload: calculateCurrencies(currencies.accountCurrencies)
            })
            dispatch({
                type: 'SET_DASHBOARD_TRANSACTIONS',
                payload: transactions.transactions
            })
            dispatch({
                type: 'SET_DASHBOARD_ALIASES_COUNT',
                payload: aliaseesCount.numberOfAliases
            })
            dispatch({
                type: 'SET_DASHBOARD_DGS_GOODS',
                payload: {
                    numberOfGoods : numberOfGoods.numberOfGoods,
                    numberOfPurchases : numberOfPurchases.numberOfPurchases,
                    totalPurchases : totalPurchases.purchases ? totalPurchases.purchases.length : null
                }
            })
            dispatch({
                type: 'SET_DASHBOARD_MESSAGES_COUNT',
                payload: messages.transactions.length
            })
            dispatch({
                type: 'SET_DASHBOARD_NEWS',
                payload: news.tweets
            })
            dispatch({
                type: 'SET_DASHBOARD_TAGGEDDATA',
                payload: taggetData.data.length
            })
            dispatch({
                type: 'SET_DASHBOARD_ACTIVE_SHUFFLING',
                payload: activeShuffling.shufflings.length
            })
            // console.log(dashboardAliasesCount)
            console.log(activeShuffling.shufflings.length)
            dispatch({
                type: 'SET_DASHBOARD_POSSL',
                payload: activePolls.polls
            })
            dispatch({
                type: 'SET_DASHBOARD_ACCOUNT_INFO',
                payload: await accountInfo
            })
        })       
}

var calculateCurrencies = (currencies) => {
    return {
        count: currencies.length,
        total: (currencies.length && currencies.map((el) => {
            return parseInt(el.unconfirmedUnits, 10) / Math.pow(10, el.decimals)
        }).reduce((a,b) => {
            return a + b
        })) || 0
    }
}

var calculateAssets =  (assets) => async dispatch => {
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