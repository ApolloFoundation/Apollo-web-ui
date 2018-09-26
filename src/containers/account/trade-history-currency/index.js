/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React from 'react';
import SiteHeader from '../../components/site-header'
import TradeHistoryItem from './trade-history-item'
import classNames from "classnames";
import uuid from "uuid";
import {connect} from 'react-redux'

import {getTradesHistoryAction}   from "../../../actions/assets";
import {setBodyModalParamsAction} from "../../../modules/modals";
import {getTransactionAction}     from "../../../actions/transactions";
import {BlockUpdater} from "../../block-subscriber";
import {
    getAccountExchangesAction
} from "../../../actions/exchange-booth";

const mapStateToProps = state => ({
    account: state.account.account,
    accountRS: state.account.accountRS,
});

const mapDispatchToProps = dispatch => ({
    getTradesHistoryAction: (requestParams) => dispatch(getTradesHistoryAction(requestParams)),
    getTransactionAction: (requestParams) => dispatch(getTransactionAction(requestParams)),
    getExchanges: currency => dispatch(getAccountExchangesAction(currency)),
    setBodyModalParamsAction: (type, data) => dispatch(setBodyModalParamsAction(type, data))
});

class TradeHistoryCurrency extends React.Component {
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
        this.getExchanges({
            firstIndex: this.state.firstIndex,
            lastIndex: this.state.lastIndex,
            account: this.props.accountRS,
            includeCurrencyInfo: true,
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

    getExchanges = async currency => {
        const exchanges = (await this.props.getExchanges(currency));

        if (exchanges) {
            this.setState({
                executedExchanges: exchanges.exchanges
            })
        }
    };

    componentWillReceiveProps(newState) {
        this.getTradesHistory({
            account: newState.accountRS,
            firstIndex: this.state.firstIndex,
            lastIndex:  this.state.lastIndex
        });
        this.getExchanges({
            firstIndex: this.state.firstIndex,
            lastIndex: this.state.lastIndex,
            account: newState.accountRS,
            includeCurrencyInfo: true,
        });
    }

    componentWillUnmount() {
        BlockUpdater.removeAllListeners('data');
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
            this.getAssets(reqParams)
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
                    pageTitle={'Exchange History'}
                />
                <div className="page-body container-fluid">
                    <div className="scheduled-transactions">
                        <div className="transaction-table">
                            <div className="transaction-table-body">
                                <table>
                                    <thead>
                                    <tr>
                                        <td>Date</td>
                                        <td>Exchange Request</td>
                                        <td>Exchange Offer</td>
                                        <td>Code</td>
                                        <td>Seller</td>
                                        <td>Buyer</td>
                                        <td className="align-right">Units</td>
                                        <td className="align-right">Rate</td>
                                        <td className="align-right">Amount</td>
                                    </tr>
                                    </thead>
                                    <tbody key={uuid()}>
                                    {
                                        this.state.executedExchanges &&
                                        this.state.executedExchanges.map((el, index) => {
                                            return (
                                                <TradeHistoryItem
                                                    key={uuid()}
                                                    transfer={el}
                                                    setTransaction={this.getTransaction}
                                                />
                                            );
                                        })
                                    }
                                    </tbody>
                                </table>
                                {
                                    this.state.executedExchanges &&
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
                                                'disabled' : this.state.executedExchanges.length < 15
                                            })}
                                        >Next</a>
                                    </div>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(TradeHistoryCurrency);