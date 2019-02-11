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

import CustomTable from '../../components/tables/table';


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

    getExchanges = async (newState , index) => {
        const exchanges = (await this.props.getAccountCurrenciesAction({
            account: newState.accountRS, 
            firstIndex: index ? index.firstIndex : null, 
            lastIndex: index ? index.lastIndex: null
        }));

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
            this.getExchanges(this.props, {
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
                    pageTitle={'My currencies'}
                />
                <div className="page-body container-fluid">
                    <CustomTable 
                        header={[
                            {
                                name: 'Code',
                                alignRight: false
                            },{
                                name: 'Name',
                                alignRight: false
                            },{
                                name: 'Units',
                                alignRight: true
                            },{
                                name: 'Actions',
                                alignRight: true
                            }
                        ]}
                        page={this.state.page}
                        className={'mb-3'}
                        TableRowComponent={MyCurrencytemItem}
                        tableData={this.state.executedExchanges}
                        isPaginate
                        emptyMessage={'No currencies found.'}
                        previousHendler={this.onPaginate.bind(this, this.state.page - 1)}
                        nextHendler={this.onPaginate.bind(this, this.state.page + 1)}
                    />
                </div>
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MyMadedCurrencies);