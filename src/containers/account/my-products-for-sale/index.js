/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import MarketplaceTableItem from '../marketplace/marketplace-table-item';
import SiteHeader from  '../../components/site-header'
import {setBodyModalParamsAction } from "../../../modules/modals";
import {BlockUpdater} from "../../block-subscriber/index";
import CustomTable from '../../components/tables/table';
import {getDGSGoodsAction} from "../../../actions/marketplace";

const MyProductsForSale = () => {
    const dispatch = useDispatch();
    const account = useSelector(state => state.account.account);
    const [state, setState] = useState({
            page: 1,
            firstIndex: 0,
            lastIndex: 15,
            getDGSGoods: []
        });

    const getDGSGoods = useCallback(async () => {
        const { goods } = await dispatch(getDGSGoodsAction({
            seller: account,
            firstIndex: state.firstIndex,
            lastIndex: state.lastIndex,
        }));

        if (goods) {
            setState(prevState => ({
                ...prevState,
                getDGSGoods: goods,
            }))
        }
    }, [dispatch, account, state.firstIndex, state.lastIndex]);

    const updater = useCallback(() => getDGSGoods(), [getDGSGoods]);

    const handleListProduct = () => dispatch(setBodyModalParamsAction('LIST_PRODUCT_FOR_SALE', {}));

    const handlePaginate = (page) => () => {
        let reqParams = {
            page,
            firstIndex: page * 15 - 15,
            lastIndex:  page * 15
        };

        setState(prevState => ({
            ...prevState,
            ...reqParams,
        }));
    }

    useEffect(() => {
        getDGSGoods();
        BlockUpdater.on("data", updater);
        return () => {
            BlockUpdater.removeAllListeners('data', updater);
        }
    }, [getDGSGoods, updater]);


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
                <CustomTable 
                    header={[
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
                    page={state.page}
                    className='mb-3'
                    TableRowComponent={MarketplaceTableItem}
                    tableData={state.getDGSGoods}
                    isPaginate
                    previousHendler={handlePaginate(state.page - 1)}
                    nextHendler={handlePaginate(state.page + 1)}
                    itemsPerPage={15}
                />
            </div>
        </div>
    );
}

export default MyProductsForSale;
