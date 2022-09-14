/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React from 'react';
import {connect} from 'react-redux';
import classNames from 'classnames';
import SiteHeader from '../../components/site-header'
import {setBodyModalParamsAction} from "../../../modules/modals";

import {getDGSGoodsAction} from "../../../actions/marketplace";
import MarketplaceItem from "../marketplace/marketplace-card/index";
import {BlockUpdater} from "../../block-subscriber/index";
import InfoBox from "../../components/info-box"
import ContentLoader from '../../components/content-loader'
import ContentHendler from "../../components/content-hendler";
import MarketplaceColumnTable from "../../components/marketplace-column-table";

const itemsPerPage = 15;

class MyProductsForSale extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            page: 1,
            firstIndex: 0,
            lastIndex: itemsPerPage - 1,
            getDGSGoods: null
        };
    }

    componentDidMount() {
        this.getDGSGoods({
            seller: this.props.account,
            requestType: 'getDGSPurchases',
            firstIndex: this.state.firstIndex,
            lastIndex: this.state.lastIndex,
            completed: true
        });
        BlockUpdater.on("data", data => {
            this.updateMyCompletedOrders();
        });
    }

    componentWillUnmount() {
        BlockUpdater.removeAllListeners('data');
    }

    updateMyCompletedOrders = () => {
        this.getDGSGoods({
            requestType: 'getDGSPurchases',
            seller: this.props.account,
            firstIndex: this.state.firstIndex,
            lastIndex: this.state.lastIndex,
            completed: true
        });
    };

    onPaginate(page) {
        let reqParams = {
            page: page,
            seller: this.props.account,
            requestType: 'getDGSPurchases',
            completed: true,
            firstIndex: page * itemsPerPage - itemsPerPage,
            lastIndex: page * itemsPerPage - 1
        };

        this.setState(reqParams, () => {
            this.getDGSGoods(reqParams)
        });
    }

    getDGSGoods = async (reqParams) => {
        const getDGSGoods = await this.props.getDGSGoodsAction(reqParams);

        if (getDGSGoods) {
            this.setState({
                getDGSGoods: getDGSGoods.purchases
            })
        }
    };

    render() {
        const { getDGSGoods } = this.state;
        return (
            <div className="page-content">
                <SiteHeader
                    pageTitle={'My Completed Orders'}
                />
                <div className="page-body container-fluid">
                    <div className={'marketplace'}>
                        <div className={'row'}>
                            {getDGSGoods && getDGSGoods.length ? (
                                <MarketplaceColumnTable
                                    data={getDGSGoods}
                                    page={this.state.page}
                                    onPaginate={this.onPaginate}
                                    tall={true}
                                    completedOrders
                                />
                            ) : (
                                <InfoBox default>
                                    No orders found.
                                </InfoBox>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    account: state.account.account,

    // modals
    modalData: state.modals.modalData
});

const initMapDispatchToProps = dispatch => ({
    getDGSGoodsAction: (reqParams) => dispatch(getDGSGoodsAction(reqParams)),
    setBodyModalParamsAction: (type, data, valueForModal) => dispatch(setBodyModalParamsAction(type, data, valueForModal)),
});

export default connect(
    mapStateToProps,
    initMapDispatchToProps
)(MyProductsForSale);
