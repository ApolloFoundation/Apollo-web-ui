/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import MarketplaceTableItem from '../marketplace/marketplace-table-item';
import SiteHeader from  '../../components/site-header'
import {setBodyModalParamsAction } from "../../../modules/modals";
import {getDGSGoodsAction} from "../../../actions/marketplace";
import { TableLoader } from '../../components/TableLoader';
import { getAccountSelector } from '../../../selectors';

const MyProductsForSale = () => {
    const dispatch = useDispatch();
    const account = useSelector(getAccountSelector);

    const getDGSGoods = useCallback(async ({ firstIndex, lastIndex }) => {
        const { goods } = await dispatch(getDGSGoodsAction({
            seller: account,
            firstIndex,
            lastIndex,
        }));

        return goods ?? [];
    }, [dispatch, account]);

    const handleListProduct = () => dispatch(setBodyModalParamsAction('LIST_PRODUCT_FOR_SALE', {}));

    return (
        <div className="page-content">
            <SiteHeader
                pageTitle='My products for sale'
            >
                <button
                    type='button'
                    className="btn btn-green btn-sm"
                    onClick={handleListProduct}
                >
                    List product for sale
                </button>
            </SiteHeader>
            <div className="page-body container-fluid">
                <TableLoader
                    headersList={[
                        {
                            name: 'Name',
                            alignRight: false
                        },{
                            name: 'Quantity',
                            alignRight: true
                        },{
                            name: 'Price',
                            alignRight: true
                        },{
                            name: 'Actions',
                            alignRight: true
                        }
                    ]}
                    emptyMessage='No products found.'
                    className='mb-3'
                    TableRowComponent={MarketplaceTableItem}
                    dataLoaderCallback={getDGSGoods}
                />
            </div>
        </div>
    );
}

export default MyProductsForSale;
