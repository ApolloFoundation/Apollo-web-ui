/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React, { useCallback, useEffect, useState } from 'react';
import {useDispatch} from 'react-redux';
import {Link} from 'react-router-dom';
import classNames from "classnames";
import SiteHeader from '../../components/site-header/index';
import MarketplaceItem from '../marketplace/marketplace-card/index'
import {searchDGSGoodsAction} from "../../../actions/marketplace";
import InfoBox from "../../components/info-box";
import { MARKETPLACE_REG_EXP } from '../../../constants';

const itemsPerPage = 8;

const  MarketplaceSearch = (props) => {
    const dispatch = useDispatch();
    const [state, setState] = useState({
            market: [],
            page: 1,
            firstIndex: 0,
            lastIndex: itemsPerPage - 1,
            tag: props.match.params ? props.match.params.tag : null,
            isGrid: true,
        });

    const getDGSGoods = useCallback(async (reqParams) => {
        const { goods } = await dispatch(searchDGSGoodsAction(reqParams));

        if (goods) {
            setState(prevState => ({
                ...prevState,
                DGSGoods: goods
            }));
        }
    }, [dispatch]);

    const loadAccount = useCallback((tag) => {
        const searchingBy = MARKETPLACE_REG_EXP.test(tag) ?
            {
                seller: tag,
                requestType: 'getDGSGoods'
            } : {
                query: tag
            };

        getDGSGoods({
            includeCounts: true,
            firstIndex: state.firstIndex,
            lastIndex: state.lastIndex,
            completed: true,
            ...searchingBy
        });
        setState(prevState => ({
            ...prevState,
            tag: tag
        }));
    }, [getDGSGoods, state.firstIndex, state.lastIndex]);

    const handlePaginate = (page) => () => {
        const searchingBy = MARKETPLACE_REG_EXP.test(props.match.params.tag) ?
            {
                seller: state.tag,
                requestType: 'getDGSGoods'
            } : {
                tag: state.tag
            };

        let reqParams = {
            includeCounts: true,

            page: page,
            tag: state.tag,
            ...searchingBy,
            firstIndex: page * itemsPerPage - itemsPerPage,
            lastIndex: page * itemsPerPage - 1
        };

        setState(prevState => ({
            ...prevState,
            ...reqParams,
        }));
    };

    useEffect(() => {
        loadAccount(props.match.params.tag);
    }, [loadAccount, props.match.params.tag]);

    return (
        <div className="page-content">
            <SiteHeader
                pageTitle={`Search <small>"${state.tag}"</small>`}
                showPrivateTransactions='ledger'
            >
                <Link
                    to='/marketplace'
                    className="btn btn-default"
                >
                    Back
                </Link>
            </SiteHeader>
            <div className="page-body container-fluid full-screen-block no-padding-on-the-sides marketplace-container">
                {(!!state.DGSGoods?.length) ? (
                    <div className="marketplace">
                        <div
                            className={classNames({
                                'row': true,
                                'fluid-row': !state.isGrid
                            })}
                        >
                            {state.DGSGoods.map((el) => (
                                <div
                                    key={`marketplace-search-item-${el.goods}`}
                                    className={classNames({
                                        'marketplace-item': state.isGrid,
                                        'marketplace-item--full-width': !state.isGrid,
                                        'd-flex pl-3 pb-3 ': true
                                    })}
                                >
                                    <MarketplaceItem
                                        tall={state.isGrid}
                                        fluid={!state.isGrid}
                                        isHovered
                                        {...el}
                                    />
                                </div>
                            ))}
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
                                    <span>{(state.page * itemsPerPage - itemsPerPage) + state.DGSGoods.length}</span>
                                </div>
                                <button
                                    type='button'
                                    onClick={handlePaginate(state.page + 1)}
                                    className={classNames({
                                        'btn btn-default': true,
                                        'disabled': state.DGSGoods.length < itemsPerPage
                                    })}
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <InfoBox default>
                        Nothing was found.
                    </InfoBox>
                )}
            </div>
        </div>
    );
};

export default MarketplaceSearch;
