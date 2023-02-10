/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector, shallowEqual} from 'react-redux';
import {Link} from 'react-router-dom';
import SiteHeader from 'containers/components/site-header'
import {getAssetAction, getSpecificAccountAssetsAction} from "actions/assets";
import {setBodyModalParamsAction, setModalCallback} from "modules/modals";
import InfoBox from 'containers/components/info-box';
import {BlockUpdater} from "containers/block-subscriber";
import SidebarList from 'containers/components/sidebar-list';
import { getAccountInfoSelector } from 'selectors';
import OffersToBuy from './offers-to-buy';
import OffersToSell from './offers-to-sell';
import BuyAsset from './buy-asset';
import SellAsset from './sell-asset';
import SidebatAsset from './sidebar-asset';
import { AssetDescription } from './AssetDescription';

const itemsPerPage = 5;

const AssetExchange = (props) => {
    const dispatch = useDispatch();
    const { 
        account,
        decimals,
        ticker,
        assetBalances,
    } = useSelector(getAccountInfoSelector, shallowEqual);
    const [state, setState] = useState({
        asset: null,
        assets: null,
    });

    const getAsset = useCallback(async () => {
        const assetId = props.match.params.asset || (state.assets && state.assets[0].asset);
        let asset = await dispatch(getAssetAction({asset: assetId}));


        if (asset) {
            const assetBalance = assetBalances && assetBalances.find(item => {
                if (item) return item.asset === asset.asset;
            });
            asset.balanceATU = assetBalance ? assetBalance.balanceATU : 0;

            setState(prevState => ({
                ...prevState,
                asset,
            }));
        }
    }, [dispatch, props.match.params.asset, state.assets?.[0]?.asset]);

    const getAccountAsset = useCallback(async () => {
        const assets = await dispatch(getSpecificAccountAssetsAction({ account }));

        if (assets) {
            const assetId = props.match.params.asset || (state.assets && state.assets[0].asset);
            const accountAsset = assets.accountAssets.find((el) => {
                return el.asset === assetId
            });

            setState(prevState => ({
                ...prevState,
                accountAsset,
                accountAssets: assets.accountAssets,
            }));
        }

    }, [dispatch, account, props.match.params.asset]);

    const getAssets = useCallback(() => {
        if (assetBalances) {
            let assets = assetBalances.map((el) => 
                dispatch(getAssetAction({
                    asset: el ? el.asset : ""
                })));
            Promise.all(assets)
                .then((data) => {
                    setState(prevState => ({
                        ...prevState,
                        assets: data,
                    }))
                })
                .catch((err) => {
                    console.log(err);
                })
        }
    }, [assetBalances, dispatch]);

    const handleUpdate = useCallback(() => {
        getAsset();
        getAccountAsset();
        getAssets();
    }, [getAsset, getAccountAsset, getAssets]);

    const handleSubmitSaleForm = (modalName, assetInfo) => (values, { resetForm }) => {
        dispatch(setModalCallback(resetForm))
        dispatch(setBodyModalParamsAction(modalName, {
            quantityATU: values.quantity,
            priceATM: values.priceATM,
            total: values.total,
            assetInfo,
        }));
    }

    const goBack = () => {
        setState(prevState => ({
            ...prevState,
            asset: null
        }));
        props.history.push('/asset-exchange');
    };

    useEffect(() => {
        handleUpdate();
        BlockUpdater.on("data", handleUpdate);
        return () => {
            BlockUpdater.removeListener("data", handleUpdate);
        }
    }, [handleUpdate]);

    return (
        <div className="page-content">
            <SiteHeader pageTitle='Asset exchange'>
                {state.asset && window.innerWidth < 768 && (
                    <button
                        type='button'
                        onClick={goBack} className="btn btn-default btn-sm">
                        <i className="zmdi zmdi-arrow-left"/> &nbsp;
                        Back to list
                    </button>
                )}
            </SiteHeader>
            {
                state.asset &&
                <div className="page-body container-fluid assets-exchange">
                    <div className="row">
                        <div className="col-md-3 p-0">
                            <AssetDescription asset={state.asset} />
                        </div>
                        {
                            props.match.params &&
                            <div className="col-md-9 p-0">
                                <div className='row'>
                                    <BuyAsset
                                        decimals={decimals}
                                        ticker={ticker}
                                        asset={state.asset}
                                        balanceATU={state.asset.balanceATU}
                                        onSubmit={handleSubmitSaleForm('BUY_ASSET', state.asset)}
                                    />
                                    <SellAsset
                                        asset={state.asset}
                                        ticker={ticker}
                                        accountAsset={state.accountAsset}
                                        onSubmit={handleSubmitSaleForm('SELL_ASSET', state.asset)}
                                    />
                                </div>
                            </div>
                        }
                    </div>
                    <div className="row">
                        {window.innerWidth > 767 && (
                            <div className="col-md-3 p-0 mb-3">
                                <SidebarList
                                    element='asset'
                                    baseUrl='/asset-exchange/'
                                    data={state.accountAssets}
                                    currentItem={state.asset.asset}
                                    emptyMessage='No assets found.'
                                    Component={SidebatAsset}
                                />
                            </div>
                        )}
                        {props.match.params && (
                            <div className="col-md-9 p-0">
                                <div className='row'>
                                    <OffersToBuy
                                        buyOrders={state.buyOrders}
                                        asset={state.asset}
                                        itemsPerPage={itemsPerPage}
                                    />
                                    <OffersToSell
                                        sellOrders={state.sellOrders}
                                        asset={state.asset}
                                        itemsPerPage={itemsPerPage}
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            }
            {
                !state.asset &&
                <div className="page-body container-fluid assets-exchange">
                    <div className="row">
                        <div className="col-md-3 p-0 one-col pb-3">
                            <div className="card card-full-screen no-padding scroll justify-content-start assets-exchange-not-selected">
                                {
                                    state.accountAssets &&
                                    !!state.accountAssets.length &&
                                    state.accountAssets.map((el) => (
                                        <Link
                                            key={el.asset}
                                            style={{display: 'block'}}
                                            to={"/asset-exchange/" + (el ? el.asset : "")}
                                            className="chat-item"
                                        >
                                            <div className="chat-box-item">
                                                <div className="chat-box-rs">{el?.name ?? ""}</div>
                                                <div className="chat-date">
                                                    Quantity:&nbsp;{(el.quantityATU / Math.pow(10, el.decimals)).toFixed(el.decimals)}
                                                </div>
                                            </div>
                                        </Link>
                                    ))
                                }
                                {
                                    state.accountAssets &&
                                    !(!!state.accountAssets.length) &&
                                    <InfoBox>No assets found.</InfoBox>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            }
        </div>
    );
}

export default AssetExchange;
