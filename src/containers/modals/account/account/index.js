/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React from 'react';
import {connect} from 'react-redux';
import {openPrevModal, setBodyModalParamsAction, setModalData} from '../../../../modules/modals';
import classNames from 'classnames';

import {getAccountAction, switchAccountAction} from "../../../../actions/account";
import {getTransactionAction, getTransactionsAction} from "../../../../actions/transactions";
import {formatTimestamp} from '../../../../helpers/util/time';
import {withRouter} from "react-router-dom";

import ModalTransaction from '../../../account/modalTransactions/transaction';
import {getBlockAction} from "../../../../actions/blocks";

import CustomTable from '../../../components/tables/table';
import TabulationBody from '../../../components/tabulator/tabuator-body';
import TabContaier from '../../../components/tabulator/tab-container';

import Entry from './ledger-entry';
import Trade from './trade';
import Currency from './currency';
import Alias from './alias';
import Goods from './goods';
import Asset from './asset';

class InfoAccount extends React.PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            activeTab: 0,
            transactions: null,
            account_ledger: null,
            assets: null,
            trades: null,
            currencies: null,
            goods: null,
            aliases: null,
            account: null,
            pagination: {
                transactions: 1,
                account_ledger: 1,
                assets: 1,
                trades: 1,
                currencies: 1,
                goods: 1,
                aliases: 1,
            }
        };

        this.handleTab = this.handleTab.bind(this);
        this.getAcccount = this.getAcccount.bind(this);
    }

    handleTab(e, index) {
        e.preventDefault();

        this.setState({
            ...this.props,
            ...this.state,
            activeTab: index
        })
    }

    static getDerivedStateFromProps(props, state) {
        if (props.modalData && Object.keys(props.modalData).length > 0 && (!state.account || props.modalData !== state.modalData)) {
            if (props.modalData && !props.modalData.errorCode) {
                return {
                    modalData: props.modalData,
                    account: props.modalData
                };
            }
        }
        return null;
    };

    componentDidMount() {
        if (this.props.modalData) {
            this.getAcccount({
                account: this.props.modalData,
                firstIndex: 0,
                lastIndex: 15
            })
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.state.account && prevState.account !== this.state.account) {
            if (!(this.state.account instanceof Object)) {
                this.getAcccount({
                    account: this.props.modalData,
                    firstIndex: 0,
                    lastIndex: 15
                });
            }
        }
    };

    // requets
    getAcccount = async (requestParams) => {
        const accountData = this.props.getAccountAction(requestParams);
        if (accountData) {
            this.setState({
                transactions: await accountData['TRANSACTIONS'],
                account_ledger: await accountData['ACCOUNT_LEDGER'],
                assets: await accountData['ASSETS'],
                trades: await accountData['TRADES'],
                currencies: await accountData['CURRENCIES'],
                goods: await accountData['GOODS'],
                aliases: await accountData['ALIASES'],
                account: await accountData['ACCOUNT'],
                pagination: {
                    transactions: 1,
                    account_ledger: 1,
                    assets: 1,
                    trades: 1,
                    currencies: 1,
                    goods: 1,
                    aliases: 1,
                }
            }, () => {
                if (this.state.assets) {

                    const accountAssets = this.state.assets.accountAssets;
                    const assetsInfo = this.state.assets.assets;

                    const resultAsset = accountAssets.map((el, index) => {
                        return {...(assetsInfo[index]), ...el}
                    });

                    this.setState({
                        assets: resultAsset
                    })
                }
            });
        }

    };

    getTransaction = async (requestParams) => {
        const transaction = await this.props.getTransactionAction(requestParams);

        if (transaction) {
            this.props.setBodyModalParamsAction('INFO_TRANSACTION', transaction)
        }
    };

    setTransactionInfo = (modalType, data) => {
        this.getTransaction({
            transaction: data,
        });
    };

    onPaginate = async(type, page) => {
        const typePaginate = type.toUpperCase();
        let reqParams = {
            account:    this.props.modalData,
            page:       page,
            firstIndex: page * 15 - 15,
            lastIndex:  page * 15,
        };
        const accountData = await this.props.getAccountAction(reqParams);
        if (accountData) {
            const newData = await accountData[typePaginate];
            if (newData && !newData.errorCode) {
                this.setState((state) => ({
                    [type]: newData,
                    pagination: {
                        ...state.pagination,
                        [type]: page,
                    }
                }), () => {
                    if (type === 'assets' && this.state.assets) {

                        const accountAssets = this.state.assets.accountAssets;
                        const assetsInfo = this.state.assets.assets;

                        const resultAsset = accountAssets.map((el, index) => {
                            return {...(assetsInfo[index]), ...el}
                        });

                        this.setState({
                            assets: resultAsset
                        })
                    }
                });
            }
        }
    };

    render() {
        const recipient = this.state.account ? this.state.account.accountRS : null;

        return (
            <div className="modal-box x-wide">
                {
                    this.props.modalData &&
                    <form className="modal-form">
                        <div className="form-group-app media-tab">
                            <button onClick={() => this.props.closeModal()} type="button" className="exit"><i className="zmdi zmdi-close"/></button>

                            <div className="form-title inline">
                                {this.props.modalsHistory.length > 1 &&
                                <div className={"backMy"} onClick={() => {
                                    this.props.openPrevModal()
                                }}/>
                                }
                                {
                                    this.state.account &&
                                    <React.Fragment>
                                        <p>Account {this.state.account.accountRS} info</p>
                                        {
                                            this.props.account !== this.state.account.account &&
                                            <a
                                                onClick={() => this.props.switchAccountAction(this.state.account.accountRS, this.props.history)}
                                                className="btn btn-green btn-sm"
                                                style={{
                                                    margin: '0 0 10px 30px'
                                                }}
                                            >
                                                Switch Account
                                            </a>
                                        }
                                    </React.Fragment>
                                }
                                {
                                    this.state.account &&
                                    <div className={"account-balance-text"}>Account has a balance
                                        of <strong>{Math.round(this.state.account.unconfirmedBalanceATM / Math.pow(10, 8))} {this.props.ticker}</strong>
                                    </div>
                                }

                            </div>

                            <TabulationBody>
                                <TabContaier sectionName="Transactions">
                                    <CustomTable
                                        header={[
                                            {
                                                name: 'Date',
                                                alignRight: false
                                            }, {
                                                name: 'Type',
                                                alignRight: false
                                            }, {
                                                name: 'Amount',
                                                alignRight: true
                                            }, {
                                                name: 'Fee',
                                                alignRight: true
                                            }, {
                                                name: 'From',
                                                alignRight: false
                                            }, {
                                                name: 'To',
                                                alignRight: false
                                            }, {
                                                name: 'Height',
                                                alignRight: true
                                            }
                                        ]}
                                        className={'no-min-height transparent'}
                                        hintClassName={'simple no-padding-on-the-sides no-margin'}
                                        emptyMessage={'This account doesn\'t have any transactions'}
                                        TableRowComponent={ModalTransaction}
                                        tableData={this.state.transactions ? this.state.transactions.transactions : null}
                                        isPaginate
                                        page={this.state.pagination.transactions}
                                        previousHendler={() => this.onPaginate('transactions', this.state.pagination.transactions - 1)}
                                        nextHendler={() => this.onPaginate('transactions', this.state.pagination.transactions + 1)}
                                        itemsPerPage={15}
                                    />
                                </TabContaier>
                                <TabContaier sectionName="Ledger">
                                    <CustomTable
                                        header={[
                                            {
                                                name: 'Entry',
                                                alignRight: false
                                            }, {
                                                name: 'Type',
                                                alignRight: false
                                            }, {
                                                name: 'Change',
                                                alignRight: true
                                            }, {
                                                name: 'Balance',
                                                alignRight: true
                                            }, {
                                                name: 'Holding',
                                                alignRight: true
                                            }, {
                                                name: 'Change',
                                                alignRight: true
                                            }, {
                                                name: 'Balance',
                                                alignRight: true
                                            }
                                        ]}
                                        className={'no-min-height transparent'}
                                        hintClassName={'simple no-padding-on-the-sides no-margin'}
                                        emptyMessage={'This account doesn\'t have any ledger'}
                                        TableRowComponent={Entry}
                                        tableData={this.state.account_ledger ? this.state.account_ledger.entries : null}
                                        isPaginate
                                        page={this.state.pagination.account_ledger}
                                        previousHendler={() => this.onPaginate('account_ledger', this.state.pagination.account_ledger - 1)}
                                        nextHendler={() => this.onPaginate('account_ledger', this.state.pagination.account_ledger + 1)}
                                        itemsPerPage={15}
                                    />
                                </TabContaier>
                                <TabContaier sectionName="Assets">
                                    <CustomTable
                                        header={[
                                            {
                                                name: 'Asset',
                                                alignRight: false
                                            }, {
                                                name: 'Quantity',
                                                alignRight: false
                                            }, {
                                                name: 'Total Available',
                                                alignRight: false
                                            }, {
                                                name: 'Percentage',
                                                alignRight: false
                                            }, {
                                                name: 'Lowest Ask',
                                                alignRight: false
                                            }, {
                                                name: 'Highest Bid',
                                                alignRight: false
                                            }, {
                                                name: 'Value in Coin',
                                                alignRight: false
                                            }
                                        ]}
                                        className={'no-min-height transparent'}
                                        hintClassName={'simple no-padding-on-the-sides no-margin'}
                                        emptyMessage={'This account doesn\'t have any assets'}
                                        TableRowComponent={Asset}
                                        tableData={this.state.assets}
                                    />
                                </TabContaier>
                                <TabContaier sectionName="Trade history">
                                    <CustomTable
                                        header={[
                                            {
                                                name: 'Asset',
                                                alignRight: false
                                            }, {
                                                name: 'Date',
                                                alignRight: false
                                            }, {
                                                name: 'Type',
                                                alignRight: false
                                            }, {
                                                name: 'Quantity',
                                                alignRight: true
                                            }, {
                                                name: 'Price',
                                                alignRight: true
                                            }, {
                                                name: 'Total',
                                                alignRight: true
                                            }
                                        ]}
                                        className={'no-min-height transparent'}
                                        hintClassName={'simple no-padding-on-the-sides no-margin'}
                                        emptyMessage={'This account doesn\'t have any trades.'}
                                        TableRowComponent={Trade}
                                        tableData={this.state.trades ? this.state.trades.trades : null}
                                        isPaginate
                                        page={this.state.pagination.trades}
                                        previousHendler={() => this.onPaginate('trades', this.state.pagination.trades - 1)}
                                        nextHendler={() => this.onPaginate('trades', this.state.pagination.trades + 1)}
                                        itemsPerPage={15}
                                    />
                                </TabContaier>
                                <TabContaier sectionName="Currencies">
                                    <CustomTable
                                        header={[
                                            {
                                                name: 'Code',
                                                alignRight: false
                                            }, {
                                                name: 'Name',
                                                alignRight: false
                                            }, {
                                                name: 'Units',
                                                alignRight: false
                                            },
                                        ]}
                                        className={'no-min-height transparent'}
                                        hintClassName={'simple no-padding-on-the-sides no-margin'}
                                        emptyMessage={'This account doesn\'t have any currencies.'}
                                        TableRowComponent={Currency}
                                        tableData={this.state.currencies ? this.state.currencies.accountCurrencies : null}
                                        isPaginate
                                        page={this.state.pagination.currencies}
                                        previousHendler={() => this.onPaginate('currencies', this.state.pagination.currencies - 1)}
                                        nextHendler={() => this.onPaginate('currencies', this.state.pagination.currencies + 1)}
                                        itemsPerPage={15}
                                    />
                                </TabContaier>
                                <TabContaier sectionName="Marketplace">
                                    <CustomTable
                                        header={[
                                            {
                                                name: 'Item',
                                                alignRight: false
                                            }, {
                                                name: 'Price',
                                                alignRight: false
                                            }, {
                                                name: 'QTY',
                                                alignRight: false
                                            },
                                        ]}
                                        className={'no-min-height transparent'}
                                        hintClassName={'simple no-padding-on-the-sides no-margin'}
                                        emptyMessage={'This account doesn\'t have any goods.'}
                                        TableRowComponent={Goods}
                                        tableData={this.state.goods ? this.state.goods.goods : null}
                                        isPaginate
                                        page={this.state.pagination.goods}
                                        previousHendler={() => this.onPaginate('goods', this.state.pagination.goods - 1)}
                                        nextHendler={() => this.onPaginate('goods', this.state.pagination.goods + 1)}
                                        itemsPerPage={15}
                                    />

                                </TabContaier>
                                <TabContaier sectionName="Aliases">
                                    <CustomTable
                                        header={[
                                            {
                                                name: 'Alias',
                                                alignRight: false
                                            }, {
                                                name: 'URI',
                                                alignRight: false
                                            },
                                        ]}
                                        className={'no-min-height transparent'}
                                        hintClassName={'simple no-padding-on-the-sides no-margin'}
                                        emptyMessage={'This account doesn\'t have any aliases.'}
                                        TableRowComponent={Alias}
                                        tableData={this.state.aliases ? this.state.aliases.aliases : null}
                                        isPaginate
                                        page={this.state.pagination.aliases}
                                        previousHendler={() => this.onPaginate('aliases', this.state.pagination.aliases - 1)}
                                        nextHendler={() => this.onPaginate('aliases', this.state.pagination.aliases + 1)}
                                        itemsPerPage={15}
                                    />
                                </TabContaier>
                                <TabContaier sectionName="Actions">
                                    <div className="flexible-grid">
                                        <a
                                            onClick={() => this.props.setBodyModalParamsAction('SEND_APOLLO', {recipient}, {recipient})}
                                            className={classNames({
                                                "btn btn-green": true,
                                                "disabled": !this.state.account
                                            })}
                                        >
                                            Send Apollo
                                        </a>
                                        <a
                                            onClick={() => this.props.setBodyModalParamsAction('TRANSFER_CURRENCY', {recipient}, {recipient})}
                                            className={classNames({
                                                "btn btn-green": true,
                                                "disabled": !this.state.account
                                            })}
                                        >
                                            Send currency
                                        </a>
                                        <a
                                            onClick={() => this.props.setBodyModalParamsAction('COMPOSE_MESSAGE', {recipient}, {recipient})}
                                            className={classNames({
                                                "btn btn-green": true,
                                                "disabled": !this.state.account
                                            })}
                                        >
                                            Send a message
                                        </a>
                                        <a
                                            onClick={() => this.props.setBodyModalParamsAction('SAVE_ACCOUNT', {recipient}, {recipient})}
                                            className={classNames({
                                                "btn btn-green": true,
                                                "disabled": !this.state.account
                                            })}
                                        >
                                            Add as contact
                                        </a>
                                    </div>
                                </TabContaier>
                            </TabulationBody>
                        </div>
                    </form>
                }
            </div>
        );
    }

    getBlock = async (type, blockHeight) => {
        const requestParams = {
            height: blockHeight
        };

        const block = await this.props.getBlockAction(requestParams);

        if (block) {
            this.props.setBodyModalParamsAction('INFO_BLOCK', block)
        }
    }

}

const mapStateToProps = state => ({
    modalData: state.modals.modalData,
    modalsHistory: state.modals.modalsHistory,
    account: state.account.account,
    ticker: state.account.ticker,
    accountRS: state.account.accountRS
});

const mapDispatchToProps = dispatch => ({
    setModalData: (data) => setModalData(data),
    getTransactionAction: (data) => dispatch(getTransactionAction(data)),
    setBodyModalParamsAction: (type, data, valueForModal) => dispatch(setBodyModalParamsAction(type, data, valueForModal)),
    formatTimestamp: (time) => dispatch(formatTimestamp(time)),
    openPrevModal: () => dispatch(openPrevModal()),

    // getAccountData
    getBlockAction: (requestParams) => dispatch(getBlockAction(requestParams)),
    getAccountAction: (requestParams) => dispatch(getAccountAction(requestParams)),
    switchAccountAction: (requestParams, history) => dispatch(switchAccountAction(requestParams, history)),
    getTransactionsAction: (requestParams) => dispatch(getTransactionsAction(requestParams)),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(InfoAccount));
