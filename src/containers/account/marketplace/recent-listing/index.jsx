/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React, { useEffect, useState, useCallback } from 'react';
import {useDispatch} from 'react-redux';
import classNames from "classnames";
import {Link} from 'react-router-dom';
import SiteHeader from '../../../components/site-header/index';
import MarketplaceItem from '../marketplace-card/index'
import {getDGSGoodsAction} from "../../../../actions/marketplace";

import '../MarketPLace.scss';

const itemsPerPage = 8;

const ResentMarketplaceListing = () => {
    const dispatch = useDispatch();
    const [state, setState] = useState({
            market: [],
            page: 1,
            firstIndex: 0,
            lastIndex: itemsPerPage - 1,
            isGrid: true
        });

    const getDGSGoods = useCallback(async (reqParams) => {
        const getDGSGoods = await dispatch(getDGSGoodsAction(reqParams));

        if (getDGSGoods) {
            setState(prevState => ({
                ...prevState,
                getDGSGoods: getDGSGoods.goods
            }));
        }
    }, [dispatch]);

    useEffect(() => {
        getDGSGoods({
            includeCounts: true,
            firstIndex: state.firstIndex,
            lastIndex: state.lastIndex,
            completed: true
        });
    }, [getDGSGoods, state.firstIndex, state.lastIndex]);

    const handlePaginate = (page) => () => {
        setState(prevState => ({
            ...prevState,
            includeCounts: true,
            page,
            firstIndex: page * itemsPerPage - itemsPerPage,
            lastIndex: page * itemsPerPage - 1
        }));
    };


    return (
        <div className="page-content">
            <SiteHeader
                pageTitle='Recent listing'
            >
                <Link
                    to='/marketplace'
                    className="btn btn-default"
                >
                    Back
                </Link>
            </SiteHeader>
            <div
                className="page-body container-fluid full-screen-block no-padding-on-the-sides marketplace-container">
                <div
                    className="marketplace"
                >
                    <div
                        className={classNames({
                            'row': true,
                            'fluid-row': !state.isGrid
                        })}
                        style={{
                            position: 'relative',
                        }}
                    >
                        {
                            state.getDGSGoods &&
                            state.getDGSGoods.map((el) => (
                                    <div
                                        key={`marketplace-item-${el.goods}`}
                                        className={classNames({
                                            'marketplace-item': state.isGrid,
                                            'marketplace-item--full-width': !state.isGrid,
                                            'd-flex': true
                                        })}
                                    >
                                        <MarketplaceItem
                                            tall={state.isGrid}
                                            fluid={!state.isGrid}
                                            isHovered
                                            {...el}
                                        />
                                    </div>
                                )
                            )
                        }
                        {
                            state.getDGSGoods &&
                            <div className="btn-box pagination">
                                <button
                                    type='button'
                                    className={classNames({
                                        'btn btn-default': true,
                                        'disabled': state.page <= 1,
                                    })}
                                    onClick={handlePaginate(state.page - 1)}
                                >
                                    Previous
                                </button>
                                <div className='pagination-nav'>
                                    <span>{state.page * itemsPerPage - itemsPerPage + 1}</span>
                                    <span>&hellip;</span>
                                    <span>{(state.page * itemsPerPage - itemsPerPage) + state.getDGSGoods.length}</span>
                                </div>
                                <button
                                    type='button'
                                    onClick={handlePaginate(state.page + 1)}
                                    className={classNames({
                                        'btn btn-default': true,
                                        'disabled': state.getDGSGoods.length < itemsPerPage
                                    })}
                                >
                                    Next
                                </button>
                            </div>
                        }

                    </div>
                </div>
            </div>
        </div>
    );
}

export default ResentMarketplaceListing;
