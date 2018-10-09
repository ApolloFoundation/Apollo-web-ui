/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import uuid from 'uuid';
import MarketplaceTableItem from '../marketplace/marketplace-table-item';
import SiteHeader from  '../../components/site-header'
import { getAccountLedgerAction, getLedgerEntryAction } from "../../../actions/ledger";
import { setModalCallback, setBodyModalParamsAction } from "../../../modules/modals";
import InfoBox from '../../components/info-box'
import ContentLoader from '../../components/content-loader'
import ContentHendler from '../../components/content-hendler'

import {getDGSGoodsAction} from "../../../actions/marketplace";
import MarketplaceItem from "../marketplace/marketplace-card";
import {BlockUpdater} from "../../block-subscriber/index";

import curve25519 from "../../../helpers/crypto/curve25519";
import converters from "../../../helpers/converters";
import crypto from "../../../helpers/crypto/crypto";

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
        return (
            <div className="page-content">
                <SiteHeader
                    pageTitle={'My pending orders'}
                />
                <div className="page-body container-fluid">
                    <div className="account-ledger">
                        {
                            this.state.getDGSGoods &&
                            !!this.state.getDGSGoods.length &&
                            <React.Fragment >
                                {
                                    this.state.getDGSGoods.map((el, index) => {
                                        return (
                                            <MarketplaceItem
                                                key={uuid()}
                                                tall={false}
                                                fluid={!this.state.isGrid}
                                                isHovered
                                                deliver
                                                index={index}
                                                {...el}
                                            />
                                        );
                                    })
                                }
                                <div className="btn-box">
                                    <a
                                        className={classNames({
                                            'btn' : true,
                                            'btn-left' : true,
                                            'disabled' : this.state.page <= 1
                                        })}
                                        onClick={this.onPaginate.bind(this, this.state.page - 1)}
                                    > Previous</a>
                                    <div className='pagination-nav'>
                                        <span>{this.state.firstIndex + 1}</span>
                                        <span>&hellip;</span>
                                        <span>{this.state.lastIndex + 1}</span>
                                    </div>
                                    <a
                                        onClick={this.onPaginate.bind(this, this.state.page + 1)}
                                        className={classNames({
                                            'btn' : true,
                                            'btn-right' : true,
                                            'disabled' : this.state.getDGSGoods.length < 8
                                        })}
                                    >Next</a>
                                </div>
                            </React.Fragment> ||
                            <ContentLoader/>
                        }
                        {
                            this.state.getDGSGoods &&
                            !(!!this.state.getDGSGoods.length) &&
                            <InfoBox
                                default
                            >
                                No pending orders.
                            </InfoBox>
                        }
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
    setBodyModalParamsAction: (type, data) => dispatch(setBodyModalParamsAction(type, data))
});

export default connect(
    mapStateToProps,
    initMapDispatchToProps
)(MyProductsForSale);
