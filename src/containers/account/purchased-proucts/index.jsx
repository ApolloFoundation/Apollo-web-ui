/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React, { useCallback, useEffect, useState } from 'react';
import {useDispatch, useSelector} from 'react-redux';
import SiteHeader from '../../components/site-header'
import {getDGSGoodsAction} from "../../../actions/marketplace";
import {BlockUpdater} from "../../block-subscriber";
import MarketplaceColumnTable from '../../components/marketplace-column-table/index';
import { getAccountSelector } from '../../../selectors';

const PurchasedProducts = () => {
    const dispatch = useDispatch();
    const account = useSelector(getAccountSelector);
    const [state, setState] = useState({
        page: 1,
        firstIndex: 0,
        lastIndex: 7,
        getDGSGoods: null
    });

    const handlePaginate = (page) => {
        setState(prevState => ({
            ...prevState,
            page,
            firstIndex: page * 8 - 8,
            lastIndex: page * 8 - 1,
        }))
    }

    const getDGSGoods = useCallback(async () => {
        const { purchases } = await dispatch(getDGSGoodsAction({
            page: state.page,
            requestType: 'getDGSPurchases',
            buyer: account,
            firstIndex: state.firstIndex,
            lastIndex: state.lastIndex,
        }));

        if (purchases) {
            setState(prevState => ({
                ...prevState,
                getDGSGoods: purchases,
            }));
        }
    }, [dispatch, account, state.firstIndex, state.lastIndex]);

    useEffect(() => {
        getDGSGoods();
        BlockUpdater.on("data", getDGSGoods);
        return () => {
            BlockUpdater.removeAllListeners('data', getDGSGoods);
        };
    }, [getDGSGoods]);

    return (
        <div className="page-content">
            <SiteHeader pageTitle='Purchased Products' />
            <div className="page-body container-fluid">
                <div className='marketplace'>
                    <div className='row'>
                        <MarketplaceColumnTable
                            data={state.getDGSGoods}
                            page={state.page}
                            emptyMessage='No purchased products found.'
                            onPaginate={handlePaginate}
                            itemsPerPage={8}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PurchasedProducts;
