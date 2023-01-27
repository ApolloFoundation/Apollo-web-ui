import {
    getDGSTagCountAction,
    getDGSPurchaseCountAction,
    getDGSGoodsCountAction,
    getDGSPurchasesAction,
} from 'actions/marketplace'

const initState = {}

const SET_MARKETPLACE_GENERAL_INFO = 'SET_MARKETPLACE_GENERAL_INFO';


export default (state = initState, action) => {
    switch (action.type) {
        case SET_MARKETPLACE_GENERAL_INFO: 
            return {
                ...state,
                marketplaceGeneral: action.payload
            }
        default: return state;
    }
}



export const getMarketplaceGeneralInfo = () => {
    return (dispatch, getState) => {

    const {account: {account}} = getState();

    const reqParams = {buyer: account}

    const purchasedProducts = dispatch(getDGSPurchaseCountAction(reqParams));
    const productsAvaliable = dispatch(getDGSGoodsCountAction(reqParams));
    const totalPurchases    = dispatch(getDGSPurchasesAction(reqParams));
    const totalTags         = dispatch(getDGSTagCountAction(reqParams));

    Promise.all([
        purchasedProducts,
        productsAvaliable,
        totalPurchases,
        totalTags
    ])
        .then((data) => {
            const [purchasedProducts, productsAvaliable, totalPurchases, totalTags] = data;

            dispatch({
                type: SET_MARKETPLACE_GENERAL_INFO,
                payload : {
                    purchasedProducts      : purchasedProducts ? purchasedProducts.numberOfPurchases : 0,
                    productsAvaliable      : productsAvaliable ? productsAvaliable.numberOfGoods : 0,
                    totalPurchases         : totalPurchases ? totalPurchases.purchases.length : 0,
                    totalTags              : totalTags ? totalTags.numberOfTags : 0,
                    totalPurchasedProducts : totalPurchases ? totalPurchases.purchases : null
                }
            })
        })
    }
}