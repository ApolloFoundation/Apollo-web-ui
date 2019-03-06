/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React from 'react';
import SiteHeader from '../../components/site-header';
import MarketplaceItem from './marketplace-card';
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';
import classNames from "classnames";
import InputMask from 'react-input-mask';
import {Form, Text} from 'react-form';
import {getDGSGoodsAction,
        getDGSTagCountAction,
        getDGSPurchaseCountAction,
        getDGSGoodsCountAction,
        getDGSPurchasesAction} from '../../../actions/marketplace'
import './MarketPLace.scss';
import uuid from "uuid";
import ContentLoader from '../../components/content-loader'

import MarketplaceGeneral from './marketplace-general/';
import MarketplaceTags from './marketplace-tags';
import MarketplaceDashboardFooter from './marketplace-dashboard-footer';

const mapStateToProps = state => ({
    account: state.account.account
});

const mapDispatchToProps = dispatch => ({
    getDGSGoodsAction: (reqParams) => dispatch(getDGSGoodsAction(reqParams)),
    getDGSTagCountAction: (reqParams) => dispatch(getDGSTagCountAction(reqParams)),
    getDGSPurchaseCountAction: (reqParams) => dispatch(getDGSPurchaseCountAction(reqParams)),
    getDGSGoodsCountAction: (reqParams) => dispatch(getDGSGoodsCountAction(reqParams)),
    getDGSPurchasesAction: (reqParams) => dispatch(getDGSPurchasesAction(reqParams)),
});

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
        // this.getInitialData({
        //     buyer: this.props.account
        // });
        // this.getDGSGoods({
        //     firstIndex: 0,
        //     lastIndex: 5,
        //     completed: true
        // });
        // this.getDGSTags({
        //     firstIndex: 0,
        //     lastIndex: 9,
        //     completed: true
        // });
    }

    componentWillReceiveProps (newState) {
        this.getInitialData({
            buyer: newState.account
        });
        // this.getDGSGoods({
        //     firstIndex: 0,
        //     lastIndex: 5,
        //     completed: true
        // });
        // this.getDGSTags({
        //     firstIndex: 0,
        //     lastIndex: 9,
        //     completed: true
        // });
    }

    getInitialData = (reqParams) => {
        this.getDGSTagCount(reqParams);
        this.getDGSPurchaseCount(reqParams);
        this.getDGSGoodsCount(reqParams);
        this.getDGSPurchases(reqParams);
    }

    getDGSTagCount = async (reqParams) => {
        const getDGSTagCount = await this.props.getDGSTagCountAction(reqParams);
        if (getDGSTagCount) {
            this.setState({
                getDGSTagCount: getDGSTagCount.numberOfTags
            })
        }
    };

    getDGSPurchaseCount = async (reqParams) => {
        const getDGSPurchaseCount = await this.props.getDGSPurchaseCountAction(reqParams);
        if (getDGSPurchaseCount) {
            this.setState({
                getDGSPurchaseCount: getDGSPurchaseCount.numberOfPurchases
            })
        }
    };

    getDGSGoodsCount = async (reqParams) => {
        const getDGSGoodsCount = await this.props.getDGSGoodsCountAction(reqParams);
        if (getDGSGoodsCount) {
            this.setState({
                getDGSGoodsCount: getDGSGoodsCount.numberOfGoods
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

    getDGSGoods = async (reqParams) => {
        const getDGSGoods = await this.props.getDGSGoodsAction(reqParams);

        if (getDGSGoods) {
            this.setState({
                ...this.state,
                getDGSGoods: getDGSGoods.goods
            })
        }
    };

    // getDGSTags = async (reqParams) => {
    //     const getDGSTags = await this.props.getDGSTagsAction(reqParams);

    //     if (getDGSTags) {
    //         this.setState({
    //             ...this.state,
    //             getDGSTags: getDGSTags.tags
    //         })
    //     }
    // };

    showMoreController = () => {
        this.setState({
            ...this.state,
            isShowMore: !this.state.isShowMore
        }, () => {
            if (this.state.isShowMore){
                this.setState({
                    page: 1,
                    firstIndex: 0,
                    lastIndex: 31
                })
                this.getDGSTags({
                    firstIndex: 0,
                    lastIndex: 31
                })
            } else {
                this.setState({
                    page: 1,
                    firstIndex: 0,
                    lastIndex: 9
                })
                this.getDGSTags({
                    firstIndex: 0,
                    lastIndex: 9
                })
            }
        });
    };

    onPaginate = (page) => {
        let reqParams = {
            page: page,
            firstIndex: page * 32 - 32,
            lastIndex:  page * 32 - 1
        };

        this.setState({...this.state,...reqParams}, () => {
            this.getDGSTags(reqParams)
        });
    };

    handleChange = (event) => {
        if (event.target) {
            var value = event.target.value;
            var newState = {
                mask: 'APL-****-****-****-*****',
                value: value.toUpperCase()
            };

            if (/^APL-[A-Z0-9_]{4}-[A-Z0-9_]{4}-[A-Z0-9_]{4}-[A-Z0-9_]{5}/.test(value)) {
                newState.value = 'APL-****-****-****-*****';
            }
            this.setState(newState);
        }
    };

    shouldComponentUpdate = (nextProps, nextState) => {


        return true;
    }

    /*
    * Returns true if every element of array are equal
    * */
    isArraysEqual = (a, b) => {
        let result = true;
        if (a && b) {
            result = a.every((el, index) => {
                return el === b[index]
            })

            return !result
        } else {
            return false
        }
    }

    render () {
        return (
            <div className="page-content">
                <SiteHeader
                    pageTitle={'Marketplace'}
                />
                <div className="page-body container-fluid pl-0">
                    <div className="marketplace marketplace-preview">
                        <div className="row">
                            <div className={classNames({
                                'col-md-12 col-lg-6 marketplace-preview-item' : !this.state.isShowMore,
                                'col-md-3' : this.state.isShowMore,
                                'pl-3': true
                            })}>
                                <div className="card fll-height marketplace product-box">

                                </div>
                            </div>
                            <div className="col-md-6  col-lg-3 marketplace-preview-item pl-md-0">
                                <MarketplaceGeneral 
                                    getDGSPurchaseCount={this.state.getDGSPurchaseCount}
                                    getDGSGoodsCount={this.state.getDGSGoodsCount}
                                    getDGSPurchasesCount={this.state.getDGSPurchasesCount}
                                    getDGSTagCount={this.state.getDGSTagCount}
                                />
                            </div>
                            <div className={classNames({
                                'col-md-6  col-lg-3 marketplace-preview-item pr-0' : !this.state.isShowMore,
                                'col-md-6' : this.state.isShowMore,
                                'pl-md-0': true
                            })}>
                                <MarketplaceTags />
                            </div>

                            <MarketplaceDashboardFooter/>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Marketplace);