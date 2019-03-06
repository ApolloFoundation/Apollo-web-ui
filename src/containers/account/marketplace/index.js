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
import MarketplaceDashboardHeader from './marketplace-dashboard-header';
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

    getDGSTags = async (reqParams) => {
        const getDGSTags = await this.props.getDGSTagsAction(reqParams);

        if (getDGSTags) {
            this.setState({
                ...this.state,
                getDGSTags: getDGSTags.tags
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