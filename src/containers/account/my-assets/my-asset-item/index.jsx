/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React, { useEffect, useState, useCallback, useMemo } from 'react';
import {useDispatch} from 'react-redux';
import { useHistory } from 'react-router-dom';
import { numberToLocaleString } from 'helpers/format';
import {setBodyModalParamsAction} from "../../../../modules/modals";
import {getAskOrders, getBidOrders} from "../../../../actions/marketplace";

const MyAssetItem = ({ asset, decimals, name, unconfirmedQuantityATU, quantityATU, info }) => {
    const history = useHistory();
    const dispatch = useDispatch();
    const [state, setState] = useState({
        lowestAskOrder: null,
        highestBidOrder: null,
    });

    const getAskOrdersRequest = useCallback(async () => {
        const askOrders = await dispatch(getAskOrders({asset}));

        if (askOrders && askOrders.orders) {
            let orders = Math.min(...askOrders.orders.map((el) => el.priceATM));

            orders = isFinite(orders) ? orders : null;

            setState(prevState => ({
                ...prevState,
                lowestAskOrder : orders
            }));
        }
    }, [dispatch, asset]);

    const getBidOrdersRequest = useCallback(async () => {
        const bidOrders = await dispatch(getBidOrders({asset}));

        if (bidOrders && bidOrders.orders) {
            let orders = Math.max(...bidOrders.orders.map((el) => el.priceATM));

            orders = isFinite(orders) ? orders : null;

            setState(prevState => ({
                ...prevState,
                highestBidOrder : orders
            }));
        }
    }, [dispatch, asset]);

    const gotToAsset = () => history.push("/asset-exchange/" + asset);

    const handleTransferAsset = () => {
        dispatch(setBodyModalParamsAction('TRANSFER_ASSET', {
            quantityATU: quantityATU / Math.pow(10, decimals),
            assetID: asset,
            assetName: name,
            decimals,
            availableAssets: (quantityATU / Math.pow(10, decimals)).toLocaleString('en', {
                minimumFractionDigits: decimals,
                maximumFractionDigits: decimals
            })}
        ));
    };

    const handleDelete = () => {
        dispatch(setBodyModalParamsAction('DELETE_SHARES', {
            quantityATU: quantityATU / Math.pow(10, decimals),
            assetID:   asset,
            decimals,
            assetName: name
        }));
    }

    useEffect(() => {
        getAskOrdersRequest();
        getBidOrdersRequest();
    }, [getAskOrdersRequest, getAskOrdersRequest]);

    const lowest = useMemo(
        () =>  state.lowestAskOrder / Math.pow(10, 8) * Math.pow(10, decimals),
        [decimals, state.lowestAskOrder]
    );
    const highest = useMemo(
        () => state.highestBidOrder / Math.pow(10, 8) * Math.pow(10, decimals),
        [decimals, state.highestBidOrder]
    );
    const valInCoin = useMemo(
        () => highest * (quantityATU / Math.pow(10, decimals)),
        [decimals, quantityATU, highest]
    );

    return (
        <tr>
            <td className="blue-link-text" >
                <span
                    className='cursor-pointer blue-link-text'
                    onClick={gotToAsset}
                >
                    {name}
                </span>
            </td>
            <td className="align-right">
                {numberToLocaleString((unconfirmedQuantityATU / Math.pow(10, decimals)), {
                    minimumFractionDigits: decimals,
                    maximumFractionDigits: decimals
                })}
            </td>
            <td className="align-right">
                {numberToLocaleString(quantityATU  / Math.pow(10, decimals), {
                    minimumFractionDigits: decimals,
                    maximumFractionDigits: decimals
                })}
            </td>
            <td className="align-right">
                {((parseInt(unconfirmedQuantityATU) / parseInt(quantityATU)) * 100).toFixed(2)}&nbsp;%
            </td>
            <td className="align-right">
                {
                    !!lowest &&
                    numberToLocaleString(lowest, {
                        minimumFractionDigits: decimals,
                        maximumFractionDigits: decimals
                    })
                }
            </td>
            <td className="align-right">
                {
                    !!highest &&
                    numberToLocaleString(highest, {
                        minimumFractionDigits: decimals,
                        maximumFractionDigits: decimals
                    })
                }
            </td>
            <td className="align-right">
                {
                    !!highest &&
                    numberToLocaleString(valInCoin, {
                        minimumFractionDigits: decimals,
                        maximumFractionDigits: decimals
                    })
                }
            </td>
            <td className="align-right">
                {!info && (
                    <div className="btn-box inline">
                        <button
                            type='button'
                            onClick={handleTransferAsset}
                            className="btn btn-default"
                        >
                            Transfer
                        </button>
                        <button
                            type='button'
                            onClick={handleDelete}
                            className="btn btn-default"
                        >
                            Delete Shares
                        </button>
                    </div>
                )}
            </td>
        </tr>
    );
}

export default MyAssetItem;
