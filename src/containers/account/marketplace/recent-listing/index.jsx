/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React, { useCallback } from 'react';
import {useDispatch} from 'react-redux';
import {Link} from 'react-router-dom';
import SiteHeader from '../../../components/site-header/index';
import MarketplaceItem from '../marketplace-card/index'
import {getDGSGoodsAction} from "../../../../actions/marketplace";
import { useDataLoader } from '../../../../hooks/useDataLoader';
import { Pagination } from '../../../components/pagination';
import '../MarketPLace.scss';

const itemsPerPage = 8;

const ResentMarketplaceListing = () => {
    const dispatch = useDispatch();
    const getDGSGoods = useCallback(async ({ firstIndex, lastIndex }) => {
        const res = await dispatch(getDGSGoodsAction({
            firstIndex,
            lastIndex,
            includeCounts: true,
            completed: true
        }));

        return res?.goods ?? [];
    }, [dispatch]);

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
            <SiteHeader pageTitle='Recent listing'>
                <Link to='/marketplace' className="btn btn-default">
                    Back
                </Link>
            </SiteHeader>
            <div
                className="page-body container-fluid full-screen-block no-padding-on-the-sides marketplace-container">
                <div className="marketplace">
                    <div
                        className='row'
                        style={{ position: 'relative' }}
                    >
                        { data &&
                            <>
                                {data.map((el) => (
                                    <div
                                        key={`marketplace-item-${el.goods}`}
                                        className='marketplace-item d-flex'
                                    >
                                        <MarketplaceItem isHovered {...el} />
                                    </div>
                                ))}
                                <Pagination
                                    firstIndex={firstCount}
                                    lastIndex={lastCount}
                                    isNextDisabled={isDisabledNext}
                                    isPrevDisabled={isDisabledPrev}
                                    onNextPage={onNextPage}
                                    onPrevPage={onPrevPage}
                                />
                            </>
                        }
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ResentMarketplaceListing;
