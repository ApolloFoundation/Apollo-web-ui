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
import MarketplaceItem from "../marketplace/marketplace-card";
import {BlockUpdater} from "../../block-subscriber/index";
import InfoBox from "../../components/info-box"
import ContentLoader from '../../components/content-loader'

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
            console.warn("height in dashboard", data);
            console.warn("updating dashboard");
            this.updateMyCompletedOrders(this.props);
        });
    }

    componentWillUnmount() {
        BlockUpdater.removeAllListeners('data');
    }

    updateMyCompletedOrders = (newState) => {
        this.setState({
            ...newState
        }, () => {
            this.getDGSGoods({
                requestType: 'getDGSPurchases',
                seller: this.props.account,
                firstIndex: this.state.firstIndex,
                lastIndex: this.state.lastIndex,
                completed: true
            });
        });
    };

    componentWillReceiveProps(newState) {
        this.updateMyCompletedOrders(newState);

    }

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
        return (
            <div className="page-content">
                <SiteHeader
                    pageTitle={'My Completed Orders'}
                />
                <div className="page-body container-fluid">
                    <div className={'marketplace'}>
                        <div className={'row'}>
                            {this.state.getDGSGoods ? (
                                !!this.state.getDGSGoods.length ? (
                                    <>
                                        {this.state.getDGSGoods.map((el, index) => {
                                            return (
                                                <div
                                                    key={`completed-order-item-${index}`}
                                                    className={'marketplace-item'}
                                                >
                                                    <MarketplaceItem
                                                        tall={true}
                                                        fluid={!this.state.isGrid}
                                                        isHovered
                                                        completedOrders
                                                        index={index}
                                                        {...el}
                                                    />
                                                </div>
                                            );
                                        })}
                                        <div className="btn-box pagination">
                                            <button
                                                type={'button'}
                                                className={classNames({
                                                    'btn btn-default': true,
                                                    'disabled': this.state.page <= 1,
                                                })}
                                                onClick={this.onPaginate.bind(this, this.state.page - 1)}
                                            >
                                                Previous
                                            </button>
                                            <div className='pagination-nav'>
                                                <span>{this.state.page * itemsPerPage - itemsPerPage + 1}</span>
                                                <span>&hellip;</span>
                                                <span>{(this.state.page * itemsPerPage - itemsPerPage) + this.state.getDGSGoods.length}</span>
                                            </div>
                                            <button
                                                type={'button'}
                                                onClick={this.onPaginate.bind(this, this.state.page + 1)}
                                                className={classNames({
                                                    'btn btn-default': true,
                                                    'disabled': this.state.getDGSGoods.length < itemsPerPage
                                                })}
                                            >
                                                Next
                                            </button>
                                        </div>
                                    </>
                                ) : (
                                    <InfoBox default>
                                        No orders found.
                                    </InfoBox>
                                )
                            ) : (
                                <ContentLoader/>
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
