/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React, { useCallback } from 'react';
import {useDispatch, useSelector} from 'react-redux';
import SiteHeader from 'containers/components/site-header';
import { TableLoader } from 'containers/components/TableLoader';
import {getSpecificAccountAssetsAction} from "actions/assets";
import { getAccountSelector } from 'selectors';
import MyAssetItem from './my-asset-item';

const MyAssets = () => {
    const dispatch = useDispatch();
    const account = useSelector(getAccountSelector);

    const getAssets = useCallback(async ({ firstIndex, lastIndex}) => {
        const assets = await dispatch(getSpecificAccountAssetsAction({
            account,
            firstIndex,
            lastIndex,
        }));

        if (assets) {
            const accountAssets = assets.accountAssets;
            const assetsInfo = assets.assets;

            const result = assetsInfo.map((el, index) => ({
                ...el,
                unconfirmedQuantityATU: accountAssets[index].unconfirmedQuantityATU
            }));
            return result;
        }
        return [];
    }, [account, dispatch]);

    return (
        <div className="page-content">
            <SiteHeader pageTitle='My assets' />
            <div className="page-body container-fluid">
                <TableLoader
                    headersList={[
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
                    className='mb-3'
                    emptyMessage='No assets found.'
                    dataLoaderCallback={getAssets}
                />
            </div>
        </div>
    );
}

export default MyAssets;
