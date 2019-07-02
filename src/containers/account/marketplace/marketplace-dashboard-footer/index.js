import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';

import {getDGSGoodsAction, getDGSPurchasesAction} from '../../../../actions/marketplace';

import InfoBox from '../../../components/info-box';
import MarketplaceItem from '../marketplace-card';
import ContentLoader from '../../../components/content-loader';

class MarketplaceDashboardFooter extends Component {
    state = {};

    componentDidMount = () => {
        this.updateData();
    }

    componentWillReceiveProps = () => {
        // this.updateData();
    }

    updateData = () => {
        this.getDGSGoods({
            firstIndex: 0,
            lastIndex: 5,
            completed: true
        });
        this.getDGSPurchases({
            firstIndex: 0,
            lastIndex: 5,
            completed: true
        })
    }

    getDGSGoods = async (reqParams) => {
        const getDGSGoods = await this.props.getDGSGoodsAction(reqParams);

        if (getDGSGoods) {
            this.setState({
                ...this.state,
                getDGSGoods: getDGSGoods.goods
            })
        }
    };

    getDGSPurchases = async (reqParams) => {
        delete reqParams.buyer;

        const getDGSPurchases = await this.props.getDGSPurchasesAction(reqParams);
        if (getDGSPurchases) {
            this.setState({
                getDGSPurchasesCount: getDGSPurchases.purchases.length,
                getDGSPurchases: getDGSPurchases.purchases.slice(0, 6)
            })
        }
    };

    render() {

        const {totalPurchasedProducts} = this.props;

        return (
            <>
                <div className="card justify-content-start mb-3">
                    <div className="card-title">
                        <span>Recent listings</span>
                        {this.state.getDGSGoods && !!this.state.getDGSGoods.length && (
                            <Link to="/recent-listing" className="btn btn-default btn-xs">View all</Link>
                        )}
                    </div>
                    <div className="card-body">
                        {this.state.getDGSGoods ? (
                            <div className="form-group-app">
                                <div className="row marketplace-row">
                                    {(this.state.getDGSGoods && this.state.getDGSGoods.length > 0) ? (
                                        this.state.getDGSGoods.map((el, index) => {
                                            return (
                                                <div key={el.goods} className="marketplace-row-item col-xl-2 pr-0">
                                                    <MarketplaceItem
                                                        fullHeight
                                                        relative={true}
                                                        {...el}
                                                    />
                                                </div>
                                            );
                                        })
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
                        {totalPurchasedProducts && !!totalPurchasedProducts.length && (
                            <Link to="/purchased-products" className="btn btn-default btn-xs">View all</Link>
                        )}
                    </div>
                    <div className="card-body">
                        {totalPurchasedProducts ? (
                            <div className="form-group-app">
                                <div className="row marketplace-row">
                                    {(totalPurchasedProducts && !!totalPurchasedProducts.length) ? (
                                        totalPurchasedProducts.map((el, index) => {
                                            return (
                                                <div key={el.goods} className="marketplace-row-item col-xl-2 pr-0">
                                                    <MarketplaceItem
                                                        fullHeight
                                                        relative={true}
                                                        {...el}
                                                    />
                                                </div>
                                            );
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
}

const mapStateToProps = state => {
    const marketplace = state.marketplace.marketplaceGeneral;

    return {
        totalPurchasedProducts: marketplace ? marketplace.totalPurchasedProducts : null
    }
}

const mapDispatchToProps = dispatch => ({
    getDGSGoodsAction: (reqParams) => dispatch(getDGSGoodsAction(reqParams)),
    getDGSPurchasesAction: (reqParams) => dispatch(getDGSPurchasesAction(reqParams)),
})

export default connect(mapStateToProps, mapDispatchToProps)(MarketplaceDashboardFooter);
