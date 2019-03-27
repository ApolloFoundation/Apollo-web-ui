import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import uuid from 'uuid';
import {connect} from 'react-redux';

import {
    getDGSGoodsAction,
    getDGSPurchasesAction
} from '../../../../actions/marketplace';

import InfoBox from '../../../components/info-box';
import MarketplaceItem from '../marketplace-card';
import ContentLoader from '../../../components/content-loader';

class MarketplaceDashboardFooter extends Component {
    state = {};

    componentDidMount = () => {
        this.updateData();
    }

    componentWillReceiveProps = () => {
        this.updateData();
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

    render () {

        const {totalPurchasedProducts} = this.props;

        return (
            <>
                {
                    this.state.getDGSGoods &&
                    <div className="form-group-app transparent marketplace no-padding-bottom height-auto">
                        <div className="form-title padding-left pb-5">
                            <p>
                                Recent listings&nbsp;&nbsp;
                                <Link to="/recent-listing" className="btn primary static">View more</Link>
                            </p>
                        </div>
                        <div className="row marketplace-row">
                            {
                                !!this.state.getDGSGoods.length &&
                                this.state.getDGSGoods.map((el, index) => {
                                    return (
                                        <div key={uuid()} className="marketplace-row-item col-xl-2 pl-3 pr-0">
                                            <MarketplaceItem
                                                fullHeight
                                                relative={true}
                                                {...el}
                                            />
                                        </div>
                                    );
                                }) ||
                                <InfoBox>
                                    No purchased products.
                                </InfoBox>
                            }
                        </div>
                    </div> ||
                    <ContentLoader/>
                }
                 {
                    this.state.getDGSGoods &&
                    <div className="form-group-app transparent marketplace no-padding-bottom height-auto">
                        <div className="form-title padding-left pb-5">
                            <p>
                                Recent listings&nbsp;&nbsp;
                                <Link to="/recent-listing" className="btn primary static">View more</Link>
                            </p>
                        </div>
                        <div className="row marketplace-row">
                            {
                                totalPurchasedProducts &&
                                !!totalPurchasedProducts.length &&
                                totalPurchasedProducts.map((el, index) => {
                                    return (
                                        <div key={uuid()} className="marketplace-row-item col-xl-2 pl-3 pr-0">
                                            <MarketplaceItem
                                                fullHeight
                                                relative={true}
                                                {...el}
                                            />
                                        </div>
                                    );
                                }) ||
                                <InfoBox>
                                    No purchased products.
                                </InfoBox>
                            }
                        </div>
                    </div> ||
                    <ContentLoader/>
                }
                
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
    getDGSGoodsAction:     (reqParams) => dispatch(getDGSGoodsAction(reqParams)),
    getDGSPurchasesAction: (reqParams) => dispatch(getDGSPurchasesAction(reqParams)),
})

export default connect(mapStateToProps, mapDispatchToProps)(MarketplaceDashboardFooter);