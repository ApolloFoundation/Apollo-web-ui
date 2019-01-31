/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import uuid from 'uuid';
import SiteHeader from  '../../components/site-header'
import { setBodyModalParamsAction } from "../../../modules/modals";

import {getDGSGoodsAction} from "../../../actions/marketplace";
import MarketplaceItem from "../marketplace/marketplace-card";

import InfoBox from "../../components/info-box";
import {BlockUpdater} from "../../block-subscriber";
import ContentLoader from '../../components/content-loader'

import MarketplaceColumnTable from '../../components/marketplace-column-table/';

class PurchasedProducts extends React.Component {
    constructor(props) {
        super(props);


        this.state = {
            page: 1,
            firstIndex: 0,
            lastIndex: 7,
            getDGSGoods: null
        };
    }

    componentDidMount() {
        this.getDGSGoods({
            requestType: 'getDGSPurchases',
            buyer: this.props.account,
            firstIndex: this.state.firstIndex,
            lastIndex: this.state.lastIndex
        });
        BlockUpdater.on("data", data => {
            console.warn("height in dashboard", data);
            console.warn("updating dashboard");
            this.getDGSGoods({
                requestType: 'getDGSPurchases',
                buyer: this.props.account,
                firstIndex: this.state.firstIndex,
                lastIndex: this.state.lastIndex
            });
        });
    }

    componentWillUnmount() {
        BlockUpdater.removeAllListeners('data');
    }

    componentWillReceiveProps(newState) {
        this.setState({
            ...newState
        }, () => {
            this.getDGSGoods({
                requestType: 'getDGSPurchases',
                buyer: this.props.account,
                firstIndex: this.state.firstIndex,
                lastIndex: this.state.lastIndex
            });
        });
    }

    onPaginate (page) {
        let reqParams = {
            page: page,
            requestType: 'getDGSPurchases',
            buyer: this.props.account,
            firstIndex: page * 8 - 8,
            lastIndex:  page * 8 - 1
        };

        this.setState(reqParams, () => {
            this.getDGSGoods(reqParams)
        });
    }

    getDGSGoods = async (reqParams) => {
        const getDGSGoods = await this.props.getDGSGoodsAction(reqParams);

        if (getDGSGoods) {
            this.setState({
                ...this.state,
                getDGSGoods: getDGSGoods.purchases
            })
        }
    };

    render () {
        return (
            <div className="page-content">
                <SiteHeader
                    pageTitle={'Purchased Products'}
                />
                <div className="page-body container-fluid">
                    <div className="account-ledger p-0">
                        <MarketplaceColumnTable
                            data={this.state.getDGSGoods}
                            page={this.state.page}
                        />
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
)(PurchasedProducts);
