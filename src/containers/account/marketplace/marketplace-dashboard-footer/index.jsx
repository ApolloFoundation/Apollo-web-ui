import React, { useCallback, useEffect, useState } from 'react';
import {Link} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import {getDGSGoodsAction, getDGSPurchasesAction} from '../../../../actions/marketplace';
import InfoBox from '../../../components/info-box';
import MarketplaceItem from '../marketplace-card/index';
import ContentLoader from '../../../components/content-loader';

const MarketplaceDashboardFooter = () => {
    const dispatch = useDispatch();
    const totalPurchasedProducts = useSelector(state => 
        state.marketplace.marketplaceGeneral?.totalPurchasedProducts || null
    );
    const [state, setState] = useState({
        getDGSGoods: [],
        getDGSPurchasesCount: 0,
        getDGSPurchases: [],
    });

    const updateData = useCallback(() => {
        getDGSGoods({
            firstIndex: 0,
            lastIndex: 5,
            completed: true
        });
        getDGSPurchases({
            firstIndex: 0,
            lastIndex: 5,
            completed: true
        })
    }, [getDGSGoods, getDGSPurchases]);

    const getDGSGoods = useCallback(async (reqParams) => {
        const getDGSGoods = await dispatch(getDGSGoodsAction(reqParams));

        if (getDGSGoods) {
            setState(prevState => ({
                ...prevState,
                getDGSGoods: getDGSGoods.goods
            }))
        }
    }, [dispatch]);

    const getDGSPurchases = useCallback(async ({buyer, ...rest}) => {
        const getDGSPurchases = await dispatch(getDGSPurchasesAction(rest));
        if (getDGSPurchases) {
            setState(prevState => ({
                ...prevState,
                getDGSPurchasesCount: getDGSPurchases.purchases.length,
                getDGSPurchases: getDGSPurchases.purchases.slice(0, 6)
            }))
        }
    }, [dispatch]);

    useEffect(() => {
        updateData();
    }, [updateData]);

    return (
        <>
            <div className="card justify-content-start mb-3">
                <div className="card-title">
                    <span>Recent listings</span>
                    {!!state.getDGSGoods?.length && (
                        <Link to="/recent-listing" className="btn btn-default btn-xs">View all</Link>
                    )}
                </div>
                <div className="card-body">
                    {state.getDGSGoods ? (
                        <div className="form-group-app">
                            <div className="row marketplace-row">
                                {(!!state.getDGSGoods?.length) ? (
                                    state.getDGSGoods.map((el) => (
                                            <div key={el.goods} className="marketplace-row-item col-xl-2 pr-0">
                                                <MarketplaceItem
                                                    fullHeight
                                                    relative
                                                    {...el}
                                                />
                                            </div>
                                        )
                                    )
                                ) : (
                                    <InfoBox default className={'simple'}>
                                        No recent products.
                                    </InfoBox>
                                )}
                            </div>
                        </div>
                    ) : (
                        <ContentLoader/>
                    )}
                </div>
            </div>
            <div className="card justify-content-start mb-3">
                <div className="card-title">
                    <span>Recent purchases</span>
                    {!!totalPurchasedProducts?.length && (
                        <Link to="/purchased-products" className="btn btn-default btn-xs">View all</Link>
                    )}
                </div>
                <div className="card-body">
                    {totalPurchasedProducts ? (
                        <div className="form-group-app">
                            <div className="row marketplace-row">
                                {(!!totalPurchasedProducts?.length) ? (
                                    totalPurchasedProducts.map((el, index) => {
                                        if (index < 6) {
                                            return (
                                                <div key={el.goods} className="marketplace-row-item col-xl-2 pr-0">
                                                    <MarketplaceItem
                                                        fullHeight
                                                        relative={true}
                                                        {...el}
                                                    />
                                                </div>
                                            );
                                        }
                                    })
                                ) : (
                                    <InfoBox default className={'simple'}>
                                        No purchased products.
                                    </InfoBox>
                                )}
                            </div>
                        </div>
                    ) : (
                        <ContentLoader/>
                    )}
                </div>
            </div>
        </>
    )
}

export default MarketplaceDashboardFooter;
