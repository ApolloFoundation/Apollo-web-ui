/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React, { useEffect, useState, useCallback, useMemo } from 'react';
import {useDispatch} from 'react-redux';
import { useHistory } from 'react-router-dom';
import {setBodyModalParamsAction} from "modules/modals";
import {getAskOrders, getBidOrders} from "actions/marketplace";
import { numberToLocaleString } from 'helpers/format';
import { bigIntDecimalsDivision, bigIntDivision, bigIntFormat, bigIntMultiply, checkIsValidBignumber } from 'helpers/util/bigNumberWrappers';

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
        () =>  state.lowestAskOrder ? bigIntFormat(bigIntMultiply(bigIntDecimalsDivision(state.lowestAskOrder, 8), Math.pow(10, decimals))) : null,
        [decimals, state.lowestAskOrder]
    );
    const highest = useMemo(
        () => state.highestBidOrder ? bigIntMultiply(bigIntDecimalsDivision(state.highestBidOrder, 8), Math.pow(10, decimals)) : null,
        [decimals, state.highestBidOrder]
    );
    const valInCoin = useMemo(
        () => highest ? bigIntFormat(bigIntMultiply(highest, bigIntDecimalsDivision(quantityATU, decimals))) : null,
        [decimals, quantityATU, highest]
    );

    console.log(highest && bigIntFormat(highest), highest)

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
                {numberToLocaleString(bigIntFormat(bigIntDecimalsDivision(unconfirmedQuantityATU, decimals)), {
                    minimumFractionDigits: decimals,
                    maximumFractionDigits: decimals
                })}
            </td>
            <td className="align-right">
                {numberToLocaleString(bigIntFormat(bigIntDecimalsDivision(quantityATU, decimals)), {
                    minimumFractionDigits: decimals,
                    maximumFractionDigits: decimals
                })}
            </td>
            <td className="align-right">
                {numberToLocaleString(bigIntFormat(bigIntMultiply(bigIntDivision(unconfirmedQuantityATU, quantityATU), 100)), {
                     minimumFractionDigits: 2,
                     maximumFractionDigits: 2,
                })}&nbsp;%
            </td>
            <td className="align-right">
                {
                    checkIsValidBignumber(lowest) &&
                    numberToLocaleString(bigIntFormat(lowest), {
                        minimumFractionDigits: decimals,
                        maximumFractionDigits: decimals
                    })
                }
            </td>
            <td className="align-right">
                {
                    checkIsValidBignumber(highest) &&
                    numberToLocaleString(bigIntFormat(highest), {
                        minimumFractionDigits: decimals,
                        maximumFractionDigits: decimals
                    })
                }
            </td>
            <td className="align-right">
                {/* {
                    checkIsValidBignumber(highest) &&
                    numberToLocaleString(bigIntFormat(valInCoin), {
                        minimumFractionDigits: decimals,
                        maximumFractionDigits: decimals
                    })
                } */}
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
