/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React from 'react';
import SiteHeader from '../../components/site-header';
import {connect} from 'react-redux';
import {getDGSGoodsAction,
        getDGSTagCountAction,
        getDGSPurchaseCountAction,
        getDGSGoodsCountAction,
        getDGSPurchasesAction} from '../../../actions/marketplace'
import './MarketPLace.scss';
import {BlockUpdater} from "../../block-subscriber";
import {getMarketplaceGeneralInfo} from '../../../modules/marketplace';

import MarketplaceDashboardHeader from './marketplace-dashboard-header';
import MarketplaceDashboardFooter from './marketplace-dashboard-footer';

const mapStateToProps = state => ({
    account: state.account.account
});

const mapDispatchToProps = dispatch => ({
    getMarketplaceGeneralInfo: () => dispatch(getMarketplaceGeneralInfo())
})

class Marketplace extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            market: [],
            page: 1,
            isShowMore: false
        };
    }

    componentWillMount() {
        BlockUpdater.on("data", this.updateData);
    }

    componentWillUnmount() {
        BlockUpdater.removeListener("data", this.updateData)
    }

    updateData = () => {
        this.props.getMarketplaceGeneralInfo()
    }

    shouldComponentUpdate = (nextProps, nextState) => {
        return true;
    }

    /*
    * Returns true if every element of array are equal
    * */

    render () {
        return (
            <div className="page-content">
                <SiteHeader
                    pageTitle={'Marketplace'}
                />
                <div className="page-body container-fluid pl-0">
                    <div className="marketplace marketplace-preview">
                        <div className="row">
                            <MarketplaceDashboardHeader />
                            <MarketplaceDashboardFooter/>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Marketplace);