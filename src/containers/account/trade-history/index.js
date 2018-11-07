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
import InfoBox from '../../components/info-box';
import ContentLoader from '../../components/content-loader'
import ContentHendler from '../../components/content-hendler'

import {getTradesHistoryAction}   from "../../../actions/assets";
import {setBodyModalParamsAction} from "../../../modules/modals";
import {getTransactionAction}     from "../../../actions/transactions";
import {BlockUpdater} from "../../block-subscriber";


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
                        <ContentHendler
                            items={this.state.trades}
                            emptyMessage={'No votes found.'}
                        >
                            {
                                this.state.trades &&
                                !!this.state.trades.length &&
                                <div className="transaction-table">
                                    <div className="transaction-table-body">
                                        <table>
                                            <thead>
                                            <tr>
                                                <td>Asset</td>
                                                <td>Date</td>
                                                <td>Type</td>
                                                <td className="align-right">Quantity</td>
                                                <td className="align-right">Price</td>
                                                <td className="align-right">Total</td>
                                                <td>Buyer</td>
                                                <td>Seller</td>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {
                                                this.state.trades &&
                                                this.state.trades.map((el, index) => {
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
                                            this.state.trades &&
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
                                                        'disabled' : this.state.trades.length < 15
                                                    })}
                                                >
                                                    Next
                                                </a>
                                            </div>
                                        }
                                    </div>
                                </div>
                            }
                        </ContentHendler>
                    </div>
                </div>
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(TradeHistory);