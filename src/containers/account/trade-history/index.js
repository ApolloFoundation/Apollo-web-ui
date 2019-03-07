/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React from 'react';
import SiteHeader from '../../components/site-header'
import TradeHistoryItem from './trade-history-item'
import {connect} from 'react-redux'

import {getTradesHistoryAction}   from "../../../actions/assets";
import {setBodyModalParamsAction} from "../../../modules/modals";
import {getTransactionAction}     from "../../../actions/transactions";
import {BlockUpdater} from "../../block-subscriber";

import CustomTable from '../../components/tables/table';

const mapStateToProps = state => ({
    account: state.account.account,
    accountRS: state.account.accountRS,
});

const mapDispatchToProps = dispatch => ({
    getTradesHistoryAction: (requestParams) => dispatch(getTradesHistoryAction(requestParams)),
    getTransactionAction: (requestParams) => dispatch(getTransactionAction(requestParams)),
    setBodyModalParamsAction: (type, data, valueForModal) => dispatch(setBodyModalParamsAction(type, data, valueForModal)),
});

class TradeHistory extends React.Component {
    constructor(props) {
        super(props);

        this.getTradesHistory = this.getTradesHistory.bind(this);
        this.getTransaction   = this.getTransaction.bind(this);
    }

    state = {
        trades: null,
        page: 1,
        firstIndex: 0,
        lastIndex: 14,
    };

    componentWillMount() {
        this.getTradesHistory({
            firstIndex: this.state.firstIndex,
            lastIndex: this.state.lastIndex,
            account: this.props.accountRS,
        });
        BlockUpdater.on("data", data => {
            console.warn("height in dashboard", data);
            console.warn("updating dashboard");
            this.getTradesHistory({
                firstIndex: this.state.firstIndex,
                lastIndex: this.state.lastIndex,
                account: this.props.accountRS,
            });
        });
    }

    componentWillUnmount() {
        BlockUpdater.removeAllListeners('data');
    }

    componentWillReceiveProps() {
        this.getTradesHistory({
            account: this.props.accountRS,
            firstIndex: this.state.firstIndex,
            lastIndex:  this.state.lastIndex
        })
    }

    onPaginate = (page) => {
        let reqParams = {
            ...this.props,
            page: page,
            account: this.props.account,
            firstIndex: page * 15 - 15,
            lastIndex:  page * 15 - 1
        };

        this.setState(reqParams, () => {
            this.getTradesHistory({
                account: this.props.accountRS,
                firstIndex: this.state.firstIndex,
                lastIndex:  this.state.lastIndex
            })
        });
    };

    async getTradesHistory(requestParams) {
        const trades = await this.props.getTradesHistoryAction(requestParams);

        if (trades) {
            this.setState({
                ...this.props,
                trades: trades.trades
            })
        }
    }

    async getTransaction(data) {
        const reqParams = {
            transaction: data,
            account: this.props.account
        };

        const transaction = await this.props.getTransactionAction(reqParams);
        if (transaction) {
            this.props.setBodyModalParamsAction('INFO_TRANSACTION', transaction);
        }

    }

    render () {
        return (
            <div className="page-content">
                <SiteHeader
                    pageTitle={'Trade History'}
                />
                <div className="page-body container-fluid">
                    <div className="scheduled-transactions">
                        <CustomTable 
                            header={[
                                {
                                    name: 'Asset',
                                    alignRight: false
                                },{
                                    name: 'Date',
                                    alignRight: false
                                },{
                                    name: 'Type',
                                    alignRight: false
                                },{
                                    name: 'Quantity',
                                    alignRight: true
                                },{
                                    name: 'Price',
                                    alignRight: true
                                },{
                                    name: 'Total',
                                    alignRight: true
                                },{
                                    name: 'Buyer',
                                    alignRight: false
                                },{
                                    name: 'Seller',
                                    alignRight: false
                                }
                            ]}
                            className={'mb-3'}
                            emptyMessage={'No active polls.'}
                            TableRowComponent={(el) => 
                                <TradeHistoryItem 
                                    transfer={el}
                                    setTransaction={this.getTransaction}
                                />
                            }
                            isPaginate
                            page={this.state.page}
                            tableData={this.state.trades}
                            previousHendler={() => this.onPaginate(this.state.page - 1)}
                            nextHendler={() => this.onPaginate(this.state.page + 1)}
                        />
                    </div>
                </div>
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(TradeHistory);