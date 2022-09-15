/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React, { useCallback, useEffect, useState } from 'react';
import {useDispatch, useSelector} from 'react-redux';
import SiteHeader from '../../components/site-header'
import {getDGSGoodsAction} from "../../../actions/marketplace";
import {BlockUpdater} from "../../block-subscriber/index";
import InfoBox from "../../components/info-box"
import MarketplaceColumnTable from "../../components/marketplace-column-table";
import { getAccountSelector } from '../../../selectors';

const itemsPerPage = 15;

const MyProductsForSale = () => {
    const dispatch = useDispatch();
    const account = useSelector(getAccountSelector);
    const [state, setState] = useState({
            page: 1,
            firstIndex: 0,
            lastIndex: itemsPerPage - 1,
            getDGSGoods: null
        });

    const updateMyCompletedOrders = useCallback(() => getDGSGoods(), [getDGSGoods]);

    const handlePaginate = (page) => {
        setState(prevState => ({
            ...prevState,
            page,
            seller: account,
            requestType: 'getDGSPurchases',
            completed: true,
            firstIndex: page * itemsPerPage - itemsPerPage,
            lastIndex: page * itemsPerPage - 1
        }));
    }

    const getDGSGoods = useCallback(async () => {
        const {purchases} = await dispatch(getDGSGoodsAction({
            seller: account,
            requestType: 'getDGSPurchases',
            firstIndex: state.firstIndex,
            lastIndex: state.lastIndex,
            completed: true
        }));

        if (purchases) {
            setState(prevState => ({
                ...prevState,
                getDGSGoods: purchases
            }));
        }
    }, [dispatch, state.firstIndex, state.lastIndex]);

    useEffect(() => {
        getDGSGoods();
        BlockUpdater.on("data", updateMyCompletedOrders);
        return () => {
            BlockUpdater.removeAllListeners('data', updateMyCompletedOrders);
        }
    }, [getDGSGoods, updateMyCompletedOrders]);

    return (
        <div className="page-content">
            <SiteHeader pageTitle='My Completed Orders' />
            <div className="page-body container-fluid">
                <div className='marketplace'>
                    <div className='row'>
                        {state.getDGSGoods && state.getDGSGoods.length ? (
                            <MarketplaceColumnTable
                                data={state.getDGSGoods}
                                page={state.page}
                                onPaginate={handlePaginate}
                                tall
                                completedOrders
                            />
                        ) : (
                            <InfoBox default>
                                No orders found.
                            </InfoBox>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MyProductsForSale;
