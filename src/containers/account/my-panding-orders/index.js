/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React from 'react';
import { connect } from 'react-redux';
import SiteHeader from  '../../components/site-header'
import { setBodyModalParamsAction } from "../../../modules/modals";

import {getDGSGoodsAction} from "../../../actions/marketplace";
import {BlockUpdater} from "../../block-subscriber/index";

import MarketplaceColumnTable from '../../components/marketplace-column-table/';

class MyProductsForSale extends React.Component {
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
            requestType: 'getDGSPendingPurchases',
            includeCounts: true,
            seller: this.props.account,
            firstIndex: this.state.firstIndex,
            lastIndex: this.state.lastIndex
        });
        BlockUpdater.on("data", data => {
            console.warn("height in dashboard", data);
            console.warn("updating dashboard");
            this.updateDgsGoods();
        });
    }

    updateDgsGoods = () => {
        this.getDGSGoods({
            requestType: 'getDGSPendingPurchases',
            seller: this.props.account,
            firstIndex: this.state.firstIndex,
            lastIndex: this.state.lastIndex
        });
    };

    componentWillReceiveProps(newState) {
        this.setState({
            ...newState
        }, () => {
            this.updateDgsGoods();
        });
    }

    onPaginate (page) {
        let reqParams = {
            page: page,
            requestType: 'getDGSPendingPurchases',
            account: this.props.account,
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
        const {getDGSGoods} = this.state;

        return (
            <div className="page-content">
                <SiteHeader
                    pageTitle={'My pending orders'}
                />
                <div className="page-body container-fluid">
                    <div className="account-ledger p-0">
                        <MarketplaceColumnTable
                            data={getDGSGoods}
                            page={this.state.page}
                            deliver
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
)(MyProductsForSale);
