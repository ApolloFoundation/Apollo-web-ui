/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React, { useCallback } from 'react';
import {useDispatch} from 'react-redux';
import {Link} from 'react-router-dom';
import SiteHeader from '../../components/site-header/index';
import MarketplaceItem from '../marketplace/marketplace-card/index'
import {searchDGSGoodsAction} from "../../../actions/marketplace";
import InfoBox from "../../components/info-box";
import { Pagination } from '../../components/pagination';
import {useDataLoader} from '../../../hooks/useDataLoader';

const itemsPerPage = 8;

const  MarketplaceSearch = (props) => {
    const dispatch = useDispatch();

    const getDGSGoods = useCallback(async ({ firstIndex, lastIndex }) => {
        const searchingBy = /^APL-[A-Z0-9_]{4}-[A-Z0-9_]{4}-[A-Z0-9_]{4}-[A-Z0-9_]{5}/.test(props.match.params.tag) ?
            {
                seller: props.match.params.tag ?? null,
                requestType: 'getDGSGoods',
            } : {
                tag: props.match.params.tag ?? null,
            };

        const { goods } = await dispatch(searchDGSGoodsAction({
            firstIndex,
            lastIndex,
            includeCounts: true,
            completed: true,
            ...searchingBy,
        }));
        return goods ?? [];
    }, [dispatch, props.match.params.tag]);

    const {
        data,
        onNextPage,
        onPrevPage,
        isDisabledNext,
        isDisabledPrev,
        firstCount,
        lastCount,
    } = useDataLoader(getDGSGoods, itemsPerPage);

    return (
        <div className="page-content">
            <SiteHeader
                pageTitle={`Search <small>"${props.match.params.tag ?? ''}"</small>`}
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
                {(!!data?.length) ? (
                    <div className="marketplace">
                        <div className='row'>
                            {data.map((el) => (
                                <div
                                    key={`marketplace-search-item-${el.goods}`}
                                    className="marketplace-item d-flex pl-3 pb-3"
                                >
                                    <MarketplaceItem tall isHovered {...el} />
                                </div>
                            ))}
                            <Pagination
                                onNextPage={onNextPage}
                                onPrevPage={onPrevPage}
                                isNextDisabled={isDisabledNext}
                                isPrevDisabled={isDisabledPrev}
                                data={data}
                                firstIndex={firstCount}
                                lastIndex={lastCount}
                            />
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
