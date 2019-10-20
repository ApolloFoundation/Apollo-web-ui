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
import {
    getAccountExchangesAction
} from "../../../actions/exchange-booth";

import CustomTable from '../../components/tables/table';

const mapStateToProps = state => ({
    account: state.account.account,
    accountRS: state.account.accountRS,
});

const mapDispatchToProps = dispatch => ({
    getTradesHistoryAction: (requestParams) => dispatch(getTradesHistoryAction(requestParams)),
    getTransactionAction: (requestParams) => dispatch(getTransactionAction(requestParams)),
    getExchanges: currency => dispatch(getAccountExchangesAction(currency)),
    setBodyModalParamsAction: (type, data, valueForModal) => dispatch(setBodyModalParamsAction(type, data, valueForModal)),
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
                    <CustomTable 
                        header={[
                            {
                                name: 'Date',
                                alignRight: false
                            },{
                                name: 'Exchange Request',
                                alignRight: false
                            },{
                                name: 'Exchange Offer',
                                alignRight: false
                            },{
                                name: 'Code',
                                alignRight: false
                            },{
                                name: 'Seller',
                                alignRight: false
                            },{
                                name: 'Buyer',
                                alignRight: false
                            },{
                                name: 'Units',
                                alignRight: true
                            },{
                                name: 'Rate',
                                alignRight: true
                            },{
                                name: 'Amount',
                                alignRight: true
                            }
                        ]}
                        TableRowComponent={(el) => 
                            <TradeHistoryItem 
                                transfer={el}
                            />
                        }
                        tableData={this.state.executedExchanges}
                        isPaginate
                        page={this.state.page}
                        previousHendler={this.onPaginate.bind(this, this.state.page - 1)}
                        nextHendler={this.onPaginate.bind(this, this.state.page + 1)}
                        className={'mb-3'}
                        emptyMessage={'No exchange history found.'}
                    />  
                </div>
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(TradeHistoryCurrency);