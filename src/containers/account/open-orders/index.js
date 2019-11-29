/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React from 'react';
import SiteHeader from '../../components/site-header'
import {connect} from "react-redux";
import {getBuyOrdersAction, getSellOrdersAction} from "../../../actions/open-orders";
import OrderItem from "./order";
import {BlockUpdater} from "../../block-subscriber";
import ContentLoader from '../../components/content-loader'
import CustomTable from "../../components/tables/table";


class OpenOrders extends React.Component {
    state = {
        sellOrders: 'pending',
        buyOrders: 'pending',
        pagination: {
            sell: {
                page: 1,
                firstIndex: 0,
                lastIndex: 15,
            },
            buy: {
                page: 1,
                firstIndex: 0,
                lastIndex: 15,
            },
        }
    };

    componentWillMount() {
        this.getBuyOrders({account: this.props.account});
        this.getSellOrders({account: this.props.account});
        BlockUpdater.on("data", data => {
            console.warn("height in dashboard", data);
            console.warn("updating dashboard");
            this.getBuyOrders({account: this.props.account});
            this.getSellOrders({account: this.props.account});
        });
    }

    componentWillUnmount() {
        BlockUpdater.removeAllListeners('data');
    }

    getBuyOrders = async (reqParams, pagination) => {
        if (!pagination) {
            pagination = {
                firstIndex: this.state.pagination.buy.firstIndex,
                lastIndex: this.state.pagination.buy.lastIndex,
            }
        }
        const buyOrders = await this.props.getBuyOrders({
            account: reqParams.account,
            firstIndex: pagination.firstIndex,
            lastIndex: pagination.lastIndex
        });
        if (buyOrders) {
            const assets = buyOrders.assets;
            const orders = buyOrders.orders;

            const result = assets.map((el, index) => {
                const asset = orders[index];
                return {...el, ...asset}
            });


            const newPagination = this.state.pagination;
            newPagination.buy = {
                ...newPagination.buy,
                ...pagination
            };
            this.setState({
                pagination: newPagination,
                buyOrders: result
            });
        }
    };

    getSellOrders = async (reqParams, pagination) => {
        if (!pagination) {
            pagination = {
                firstIndex: this.state.pagination.sell.firstIndex,
                lastIndex: this.state.pagination.sell.lastIndex,
            }
        }
        const buyOrders = await this.props.getSellOrders({
            account: reqParams.account,
            firstIndex: pagination.firstIndex,
            lastIndex: pagination.lastIndex
        });
        if (buyOrders) {
            const assets = buyOrders.assets;
            const orders = buyOrders.orders;

            const result = assets.map((el, index) => {
                const asset = orders[index];
                return {...el, ...asset}
            });

            const newPagination = this.state.pagination;
            newPagination.sell = {
                ...newPagination.sell,
                ...pagination
            };
            this.setState({
                pagination: newPagination,
                sellOrders: result
            });
        }
    };

    onPaginate = (type, page) => {
        const pagination = {
            page: page,
            firstIndex: page * 15 - 15,
            lastIndex: page * 15
        };
        if (type === 'buy') {
            this.getBuyOrders({account: this.props.account}, pagination);
        } else if(type === 'sell') {
            this.getSellOrders({account: this.props.account}, pagination);
        }
    };

    render() {
        return (
            <div className="page-content">
                <SiteHeader
                    pageTitle={'Open orders'}
                />
                <div className="page-body container-fluid mb-3">
                    <div className="row">
                        <div className="col-md-6 pr-0 pl-0">
                            <div className={'card full-height'}>
                                <div className="card-title">Sell Orders</div>
                                <div className="card-body">
                                    {this.state.sellOrders !== 'pending' ? (
                                        <CustomTable
                                            header={[
                                                {
                                                    name: 'Asset',
                                                    alignRight: false
                                                }, {
                                                    name: 'Quantity',
                                                    alignRight: false
                                                }, {
                                                    name: 'Price',
                                                    alignRight: false
                                                }, {
                                                    name: 'Total',
                                                    alignRight: false
                                                }, {
                                                    name: 'Actions',
                                                    alignRight: true
                                                }
                                            ]}
                                            className={'p-0'}
                                            emptyMessage={'No assets found.'}
                                            TableRowComponent={OrderItem}
                                            tableData={this.state.sellOrders}
                                            isPaginate
                                            page={this.state.pagination.sell.page}
                                            previousHendler={() => this.onPaginate('sell', this.state.pagination.sell.page - 1)}
                                            nextHendler={() => this.onPaginate('sell', this.state.pagination.sell.page + 1)}
                                            itemsPerPage={15}
                                        />
                                    ) : (
                                        <ContentLoader noPaddingOnTheSides/>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6 pr-0">
                            <div className={'card full-height'}>
                                <div className="card-title">Buy Orders</div>
                                <div className="card-body">
                                    {this.state.buyOrders !== 'pending' ? (
                                        <CustomTable
                                            header={[
                                                {
                                                    name: 'Asset',
                                                    alignRight: false
                                                }, {
                                                    name: 'Quantity',
                                                    alignRight: false
                                                }, {
                                                    name: 'Price',
                                                    alignRight: false
                                                }, {
                                                    name: 'Total',
                                                    alignRight: false
                                                }, {
                                                    name: 'Actions',
                                                    alignRight: true
                                                }
                                            ]}
                                            className={'p-0'}
                                            emptyMessage={'No assets found.'}
                                            TableRowComponent={OrderItem}
                                            tableData={this.state.buyOrders}
                                            isPaginate
                                            page={this.state.pagination.buy.page}
                                            previousHendler={() => this.onPaginate('buy', this.state.pagination.buy.page - 1)}
                                            nextHendler={() => this.onPaginate('buy', this.state.pagination.buy.page + 1)}
                                            itemsPerPage={15}
                                        />
                                    ) : (
                                        <ContentLoader noPaddingOnTheSides/>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    account: state.account.account,

});

const mapDispatchToProps = dispatch => ({
    getBuyOrders: (params) => dispatch(getBuyOrdersAction(params)),
    getSellOrders: (params) => dispatch(getSellOrdersAction(params)),
});

export default connect(mapStateToProps, mapDispatchToProps)(OpenOrders);