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

import {getDGSGoodsAction} from "../../../actions/marketplace";
import MarketplaceItem from "../marketplace/marketplace-card";

import curve25519 from "../../../helpers/crypto/curve25519";
import converters from "../../../helpers/converters";
import crypto from "../../../helpers/crypto/crypto";
import InfoBox from "../../components/info-box";
import {BlockUpdater} from "../../block-subscriber";

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
                    {
                        this.state.getDGSGoods &&
                        <div className="account-ledger">
                            {
                                this.state.getDGSGoods &&
                                this.state.getDGSGoods.map((el, index) => {
                                    return (
                                        <div className="marketplace-item--full-width">
                                            <MarketplaceItem
                                                key={uuid()}
                                                tall={false}
                                                fluid={!this.state.isGrid}
                                                isHovered
                                                index={index}
                                                {...el}
                                            />
                                        </div>
                                    );
                                })
                            }
                            {
                                this.state.getDGSGoods &&
                                !(!!this.state.getDGSGoods.length) &&
                                <InfoBox default>
                                    No purchased products yet.
                                </InfoBox>
                            }
                            <div className="btn-box">
                                <a
                                    className={classNames({
                                        'btn' : true,
                                        'btn-left' : true,
                                        'disabled' : this.state.page <= 1
                                    })}
                                    onClick={this.onPaginate.bind(this, this.state.page - 1)}
                                >
                                    Previous
                                </a>
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
                                >
                                    Next
                                </a>
                            </div>
                        </div> ||
                        <div
                            style={{
                                paddingLeft: 47.5
                            }}
                            className={'loader-box'}
                        >
                            <div className="ball-pulse">
                                <div></div>
                                <div></div>
                                <div></div>
                            </div>
                        </div>
                    }

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
)(PurchasedProducts);
