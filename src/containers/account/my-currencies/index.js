/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React from 'react';
import SiteHeader from '../../components/site-header'
import MyCurrencytemItem from './my-currency-item'
import {connect} from 'react-redux'
import {getTradesHistoryAction} from "../../../actions/assets";
import {setBodyModalParamsAction} from "../../../modules/modals";
import {getTransactionAction} from "../../../actions/transactions";
import {BlockUpdater} from "../../block-subscriber";
import {getAccountExchangesAction} from "../../../actions/exchange-booth";
import {getAccountCurrenciesAction} from '../../../actions/currencies';
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
    state = {
        trades: null,
        page: 1,
        firstIndex: 0,
        lastIndex: 15,
    };

    componentDidMount() {
        this.getExchanges(this.props);
        BlockUpdater.on("data", data => {
            console.warn("height in dashboard", data);
            console.warn("updating dashboard");
            this.getExchanges(this.props);
        });
    }

    getExchanges = async (newState, index) => {
        const exchanges = (await this.props.getAccountCurrenciesAction({
            account: newState.accountRS,
            firstIndex: index ? index.firstIndex : null,
            lastIndex: index ? index.lastIndex : null
        }));

        if (exchanges) {
            const accountCurrencies = exchanges.accountCurrencies.filter(el => el.code && el.name && el.type !== undefined);
            this.setState({
                executedExchanges: accountCurrencies
            })
        }
    };

    componentWillUnmount() {
        BlockUpdater.removeAllListeners('data');
    }

    onPaginate = (page) => {
        let reqParams = {
            ...this.props,
            page: page,
            account: this.props.account,
            firstIndex: page * 15 - 15,
            lastIndex: page * 15
        };

        this.setState(reqParams, () => {
            this.getExchanges(this.props, {
                firstIndex: this.state.firstIndex,
                lastIndex: this.state.lastIndex
            })
        });
    };

    getTradesHistory = async (requestParams) => {
        const trades = await this.props.getTradesHistoryAction(requestParams);

        if (trades) {
            this.setState({
                ...this.props,
                trades: trades.trades
            })
        }
    };

    getTransaction = async (data) => {
        const reqParams = {
            transaction: data,
            account: this.props.account
        };

        const transaction = await this.props.getTransactionAction(reqParams);
        if (transaction) {
            this.props.setBodyModalParamsAction('INFO_TRANSACTION', transaction);
        }
    };

    render() {
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
                            }, {
                                name: 'Name',
                                alignRight: false
                            }, {
                                name: 'Type',
                                alignRight: false
                            }, {
                                name: 'Units',
                                alignRight: true
                            }, {
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
                        itemsPerPage={15}
                    />
                </div>
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MyMadedCurrencies);
