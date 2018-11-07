/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React from 'react';
import SiteHeader from '../../components/site-header'
import MyCurrencytemItem from './my-currency-item'
import classNames from "classnames";
import uuid from "uuid";
import {connect} from 'react-redux'
import InfoBox from '../../components/info-box';
import ContentLoader from '../../components/content-loader'

import {getTradesHistoryAction}   from "../../../actions/assets";
import {setBodyModalParamsAction} from "../../../modules/modals";
import {getTransactionAction}     from "../../../actions/transactions";
import {BlockUpdater} from "../../block-subscriber";
import {
    getAccountExchangesAction
} from "../../../actions/exchange-booth";

import {getAccountCurrenciesAction} from '../../../actions/currencies';
import ContentHendler from '../../components/content-hendler'

const mapStateToProps = state => ({
    account: state.account.account,
    accountRS: state.account.accountRS,
});

const mapDispatchToProps = dispatch => ({
    getTradesHistoryAction: (requestParams) => dispatch(getTradesHistoryAction(requestParams)),
    getTransactionAction: (requestParams) => dispatch(getTransactionAction(requestParams)),
    getExchanges: currency => dispatch(getAccountExchangesAction(currency)),
    getAccountCurrenciesAction: (requestParams) => dispatch(getAccountCurrenciesAction(requestParams)),
    setBodyModalParamsAction: (type, data, valueForModal) => dispatch(setBodyModalParamsAction(type, data, valueForModal)),
});

class MyMadedCurrencies extends React.Component {
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
        this.getExchanges(this.props);
        BlockUpdater.on("data", data => {
            console.warn("height in dashboard", data);
            console.warn("updating dashboard");
            this.getExchanges(this.props);
        });
    }

    getExchanges = async newState => {
        const exchanges = (await this.props.getAccountCurrenciesAction({account: newState.accountRS}));

        if (exchanges) {
            this.setState({
                executedExchanges: exchanges.accountCurrencies
            })
        }
    };

    componentWillReceiveProps(newState) {
        // this.getTradesHistory({
        //     account: newState.accountRS,
        //     firstIndex: this.state.firstIndex,
        //     lastIndex:  this.state.lastIndex
        // });
        this.getExchanges(newState);
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
                    pageTitle={'My currencies'}
                />
                <div className="page-body container-fluid">
                    <div className="scheduled-transactions">
                        <ContentHendler
                            items={this.state.executedExchanges}
                            emptyMessage={'No assets found.'}
                        >
                            {
                                this.state.executedExchanges &&
                                !!this.state.executedExchanges.length &&
                                <div className="transaction-table">
                                    <div className="transaction-table-body">
                                        <table>
                                            <thead>
                                            <tr>
                                                <td>Code</td>
                                                <td>Name</td>
                                                <td className="align-right">Units</td>
                                                <td className="align-right">Actions</td>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {
                                                <div className="transaction-table">
                                                    <div className="transaction-table-body">
                                                        <table>
                                                            <thead>
                                                            <tr>
                                                                <td>Code</td>
                                                                <td>Name</td>
                                                                <td className="align-right">Units</td>
                                                                <td className="align-right">Actions</td>
                                                            </tr>
                                                            </thead>
                                                            <tbody>
                                                            {
                                                                this.state.executedExchanges.map((el, index) => {
                                                                    return (
                                                                        <MyCurrencytemItem
                                                                            key={uuid()}
                                                                            currency={el}
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
                                                                        'disabled' : this.state.executedExchanges.length < 15
                                                                    })}
                                                                >
                                                                    Next
                                                                </a>
                                                            </div>
                                                        }
                                                    </div>
                                                </div> &&
                                                this.state.executedExchanges.map((el, index) => {
                                                    return (
                                                        <MyCurrencytemItem
                                                            key={uuid()}
                                                            currency={el}
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
                                                        'disabled' : this.state.executedExchanges.length < 15
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

export default connect(mapStateToProps, mapDispatchToProps)(MyMadedCurrencies);