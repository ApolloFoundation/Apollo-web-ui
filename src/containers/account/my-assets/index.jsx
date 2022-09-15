/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React, { useCallback, useEffect, useState } from 'react';
import {useDispatch, useSelector} from 'react-redux';
import SiteHeader from '../../components/site-header';
import {getSpecificAccountAssetsAction} from "../../../actions/assets";
import {BlockUpdater} from "../../block-subscriber/index";
import { getAccountSelector } from '../../../selectors';
import CustomTable from '../../components/tables/table';
import MyAssetItem from './my-asset-item/index';

const MyAssets = () => {
    const dispatch = useDispatch();
    const account = useSelector(getAccountSelector);
    const [state, setState] = useState({
        assets: null,
        page: 1,
        firstIndex: 0,
        lastIndex: 1,
    });

    const handlePaginate = (page) => () => {
        setState(prevState => ({
            ...prevState,
            page: page,
            firstIndex: page * 15 - 15,
            lastIndex:  page * 15,
        }));
    };

    const getAssets = useCallback(async () => {
        const assets = await dispatch(getSpecificAccountAssetsAction({
            account,
            firstIndex: state.firstIndex,
            lastIndex: state.lastIndex,
        }));

        if (assets) {
            const accountAssets = assets.accountAssets;
            const assetsInfo = assets.assets;

            const result = assetsInfo.map((el, index) => ({
                ...el,
                unconfirmedQuantityATU: accountAssets[index].unconfirmedQuantityATU
            }));

            setState(prevState => ({
                ...prevState,
                assets: result,
            }));
        }
    }, [state.firstIndex, state.lastIndex, account, dispatch]);

    useEffect(() => {
        getAssets();
        BlockUpdater.on("data", getAssets);
        return () => {
            BlockUpdater.removeAllListeners('data', getAssets);
        };
    }, [getAssets]);

    return (
        <div className="page-content">
            <SiteHeader pageTitle='My assets' />
            <div className="page-body container-fluid">
                <CustomTable
                    header={[
                        {
                            name: 'Asset',
                            alignRight: false
                        },{
                            name: 'Quantity',
                            alignRight: true
                        },{
                            name: 'Total Available',
                            alignRight: true
                        },{
                            name: 'Percentage',
                            alignRight: true
                        },{
                            name: 'Lowest Ask',
                            alignRight: true
                        },{
                            name: 'Highest Bid',
                            alignRight: true
                        },{
                            name: 'Value in Coin',
                            alignRight: true
                        },{
                            name: 'Action',
                            alignRight: true
                        }
                    ]}
                    TableRowComponent={MyAssetItem}
                    tableData={state.assets}
                    className='mb-3'
                    isPaginate
                    page={state.page}
                    emptyMessage='No assets found.'
                    previousHendler={handlePaginate(state.page - 1)}
                    nextHendler={handlePaginate(state.page + 1)}
                    itemsPerPage={15}
                />
            </div>
        </div>
    );
}

export default MyAssets;
