/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React from 'react';
import {connect} from 'react-redux';
import {setModalData, setBodyModalParamsAction} from '../../../modules/modals';
import classNames from 'classnames';
import uuid from "uuid";
import {getAccountAction}     from "../../../actions/account";
import {getTransactionAction} from "../../../actions/transactions";
import {switchAccountAction}  from "../../../actions/account";
import {formatTimestamp}      from '../../../helpers/util/time';
import {Link}                 from "react-router-dom";

import Transaction from '../../account/transactions/transaction';
import Entry from '../../account/ledger/entry';
import Asset from '../../account/my-assets/my-asset-item/';
import {getBlockAction} from "../../../actions/blocks";

class InfoAccount extends React.Component {
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
        };

        this.handleTab      = this.handleTab.bind(this);
        this.getAcccount    = this.getAcccount.bind(this);
    }

    handleTab(e, index) {
        e.preventDefault();

        this.setState({
            ...this.props,
            ...this.state,
            activeTab: index
        })
    }

    componentDidMount() {
        this.getAcccount({
            account:    this.props.modalData,
            firstIndex: 0,
            lastIndex:  99
        })
    }

    componentWillReceiveProps(newState) {
        this.getAcccount({
            account:    newState.modalData,
            firstIndex: 0,
            lastIndex:  99
        })
    }

    // requets
    async getAcccount (requestParams){
        if (this.props.modalData) {
            const accountData = this.props.getAccountAction(requestParams);

            if (accountData) {
                this.setState({
                    ...this.props,
                    transactions:   await accountData['TRANSACTIONS'],
                    account_ledger: await accountData['ACCOUNT_LEDGER'],
                    assets:         await accountData['ASSETS'],
                    trades:         await accountData['TRADES'],
                    currencies:     await accountData['CURRENCIES'],
                    goods:          await accountData['GOODS'],
                    aliases:        await accountData['ALIASES'],
                    account:        await accountData['ACCOUNT'],
                }, () => {
                    if (this.state.assets) {
                        const accountAssets = this.state.assets.accountAssets;
                        const assetsInfo    = this.state.assets.assets;

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
    }

    getTransaction = async (requestParams) => {
        const transaction = await this.props.getTransactionAction(requestParams);

        if (transaction) {
            this.props.setBodyModalParamsAction('INFO_TRANSACTION', transaction)
        }
    };

    setTransactionInfo(modalType, data) {
        this.getTransaction({
            account: this.props.account,
            transaction: data
        });
    }

    // TODO: migrate timesamp, migrate account to RS

    render() {
        return (
            <div className="modal-box x-wide">
                {
                    this.props.modalData &&
                    <form className="modal-form">
                        <div className="form-group-app">
                            <a onClick={() => this.props.closeModal()} className="exit"><i className="zmdi zmdi-close" /></a>

                            <div className="form-title inline">
                                {
                                    this.state.account &&
                                    <React.Fragment>
                                        <p>Info {this.state.account.accountRS} Account</p>
                                        {
                                            this.props.account !== this.state.account.account &&
                                            <a
                                                onClick={() => this.props.switchAccountAction(this.state.account.accountRS)}
                                                className="btn primary static"
                                                style={{
                                                    margin: '0 0 0 30px'
                                                }}
                                            >
                                                Switch Account
                                            </a>
                                        }
                                    </React.Fragment>
                                }

                            </div>

                            <div className="form-tabulator active">
                                <div className="form-tab-nav-box justify-left">
                                    <a onClick={(e) => this.handleTab(e, 0)} className={classNames({
                                        "form-tab": true,
                                        "active": this.state.activeTab === 0
                                    })}>
                                        <p className="pre">Transactions</p>
                                    </a>
                                    <a onClick={(e) => this.handleTab(e, 1)} className={classNames({
                                        "form-tab": true,
                                        "active": this.state.activeTab === 1
                                    })}>
                                        <p className="pre">Ledger</p>
                                    </a>
                                    <a onClick={(e) => this.handleTab(e, 2)} className={classNames({
                                        "form-tab": true,
                                        "active": this.state.activeTab === 2
                                    })}>
                                        <p className="pre">Assets</p>
                                    </a>
                                    <a onClick={(e) => this.handleTab(e, 3)} className={classNames({
                                        "form-tab": true,
                                        "active": this.state.activeTab === 3
                                    })}>
                                        <p className="pre">Trade history</p>
                                    </a>
                                    <a onClick={(e) => this.handleTab(e, 4)} className={classNames({
                                        "form-tab": true,
                                        "active": this.state.activeTab === 4
                                    })}>
                                        <p className="pre">Currencies</p>
                                    </a>
                                    <a onClick={(e) => this.handleTab(e, 5)} className={classNames({
                                        "form-tab": true,
                                        "active": this.state.activeTab === 5
                                    })}>
                                        <p className="pre">Marketplace</p>
                                    </a>
                                    <a onClick={(e) => this.handleTab(e, 6)} className={classNames({
                                        "form-tab": true,
                                        "active": this.state.activeTab === 6
                                    })}>
                                        <p className="pre">Aliases</p>
                                    </a>
                                    <a onClick={(e) => this.handleTab(e, 7)} className={classNames({
                                        "form-tab": true,
                                        "active": this.state.activeTab === 7
                                    })}>
                                        <p className="pre">Actions</p>
                                    </a>

                                </div>

                                <div className={classNames({
                                    "tab-body": true,
                                    "active": this.state.activeTab === 0
                                })}>
                                    <div className="transaction-table no-min-height">
                                        {
                                            this.state.transactions &&
                                            <div className="transaction-table-body transparent padding-vertical-padding">
                                                <table>
                                                    <thead key={uuid()}>A
                                                    <tr>
                                                        <td>Index</td>
                                                        <td>Date</td>
                                                        <td>Type</td>
                                                        <td className="align-right">Amount</td>
                                                        <td className="align-right">Fee</td>
                                                        <td>From</td>
                                                        <td>To</td>
                                                    </tr>
                                                    </thead>
                                                    <tbody>
                                                    {
                                                        this.state.transactions &&
                                                        this.state.transactions.transactions.map((el, index) => {

                                                            return (
                                                                <Transaction
                                                                    key={uuid()}
                                                                    block
                                                                    transaction = {el}
                                                                    index={index}
                                                                    setTransactionInfo={this.getTransaction}
                                                                />
                                                            )
                                                        })
                                                    }
                                                    {
                                                        this.state.transactions &&
                                                        !this.state.transactions.transactions.length &&
                                                        'No transactions in this account.'
                                                    }
                                                    </tbody>
                                                </table>
                                            </div> ||
                                            <div
                                                style={{
                                                    paddingLeft: 47.5
                                                }}
                                                className={'loader-box'}
                                            >
                                                <div className="ball-pulse">
                                                    <div></div>
                                                    <div></div>
                                                    <div></div>
                                                </div>
                                            </div>
                                        }

                                    </div>
                                </div>
                                <div className={classNames({
                                    "tab-body": true,
                                    "active": this.state.activeTab === 1
                                })}>
                                    <div className="transaction-table no-min-height">
                                        <div className="transaction-table-body transparent padding-vertical-padding">
                                            <table>
                                                <thead>
                                                <tr>
                                                    <td>Entry</td>
                                                    <td>Type</td>
                                                    <td className="align-right">Change</td>
                                                    <td>Balance</td>
                                                    <td>Holding</td>
                                                    <td className="align-right">Change</td>
                                                    <td className="align-right">Balance</td>
                                                </tr>
                                                </thead>
                                                <tbody>
                                                {
                                                    this.state.account_ledger &&
                                                    this.state.account_ledger.entries.map((el, index) => {
                                                        return (
                                                            <Entry
                                                                key={uuid()}
                                                                entry={el}
                                                                publicKey= {this.state.serverPublicKey}
                                                                privateKey={this.state.privateKey}
                                                                sharedKey= {this.state.sharedKey}
                                                                setLedgerEntryInfo={this.getLedgerEntry}
                                                            />
                                                        );
                                                    })
                                                }
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                                <div className={classNames({
                                    "tab-body": true,
                                    "active": this.state.activeTab === 2
                                })}>
                                    <div className="transaction-table no-min-height">
                                        <div className="transaction-table-body transparent padding-vertical-padding">
                                            <table>
                                                <thead>
                                                    <tr>
                                                        <td>Asset</td>
                                                        <td className="align-right">Quantity</td>
                                                        <td className="align-right">Total Available</td>
                                                        <td className="align-right">Percentage</td>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                {
                                                    this.state.assets &&
                                                    !(this.state.assets.assets) &&
                                                    this.state.assets.map((el, index) => {
                                                        return (
                                                            <Asset
                                                                key={uuid()}
                                                                info
                                                                transfer={el}
                                                                setLedgerEntryInfo={this.getLedgerEntry}
                                                            />
                                                        );
                                                    })
                                                }
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                                <div className={classNames({
                                    "tab-body": true,
                                    "active": this.state.activeTab === 3
                                })}>
                                    {
                                        (this.state.trades &&
                                        this.state.trades.trades.length > 0) ?
                                        <div className="transaction-table no-min-height">
                                            <div className="transaction-table no-min-height">
                                                <div className="transaction-table-body transparent padding-vertical-padding">
                                                    <table>
                                                        <thead>
                                                        <tr>
                                                            <td>Asset</td>
                                                            <td>Date</td>
                                                            <td>Type</td>
                                                            <td className="align-right">Quantity</td>
                                                            <td className="align-right">Price</td>
                                                            <td className="align-right">Total</td>
                                                        </tr>
                                                        </thead>
                                                        <tbody>
                                                        {
                                                            this.state.trades &&
                                                            this.state.trades.trades.map((el, index) => {
                                                                return (
                                                                    <tr key={uuid()}>
                                                                        <td className={'blue-link-text'}>
                                                                            <Link
                                                                                onClick={() => this.props.closeModal()}
                                                                                to={'/asset-exchange/' + el.asset}
                                                                            >
                                                                                {el.name}
                                                                            </Link>
                                                                        </td>
                                                                        <td>{this.props.formatTimestamp(el.timestamp)}</td>
                                                                        <td>{el.tradeType}</td>
                                                                        <td className="align-right">{el.quantityATU / Math.pow(10, el.decimals)}</td>
                                                                        <td className="align-right">{(el.priceATM * Math.pow(10, el.decimals)) / 100000000}</td>
                                                                        <td className="align-right">{(el.quantityATU / Math.pow(10, el.decimals)) * ((el.priceATM * Math.pow(10, el.decimals)) / 100000000)}</td>
                                                                    </tr>
                                                                );
                                                            })
                                                        }
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        </div>
                                   :
                                        <p>This user has no trades.</p>
                                    }
                                </div>
                                <div className={classNames({
                                    "tab-body": true,
                                    "active": this.state.activeTab === 4
                                })}>
                                    {
                                        this.state.currencies &&
                                        this.state.currencies.accountCurrencies.length &&
                                        <div className="transaction-table no-min-height">
                                            <div className="transaction-table no-min-height">
                                                <div className="transaction-table-body transparent padding-vertical-padding">
                                                    <table>
                                                        <thead>
                                                        <tr>
                                                            <td>Code</td>
                                                            <td>Name</td>
                                                            <td className="align-right">Units</td>
                                                        </tr>
                                                        </thead>
                                                        <tbody>
                                                        {
                                                            this.state.currencies &&
                                                            this.state.currencies.accountCurrencies.map((el, index) => {
                                                                return (
                                                                    <tr key={uuid()}>
                                                                        <td>{el.code}</td>
                                                                        <td>{el.name}</td>
                                                                        <td className="align-right">{(el.unconfirmedUnits / Math.pow(10, el.decimals)).toFixed(2)}</td>
                                                                    </tr>
                                                                );
                                                            })
                                                        }
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        </div>
                                    }
                                    {
                                        this.state.currencies &&
                                        !this.state.currencies.accountCurrencies.length &&
                                        <p>This user has no currencies.</p>
                                    }
                                </div>
                                <div className={classNames({
                                    "tab-body": true,
                                    "active": this.state.activeTab === 5
                                })}>

                                    {
                                        this.state.goods &&
                                        this.state.goods.goods &&
                                        this.state.goods.goods.length > 0 &&
                                        <div className="transaction-table no-min-height">
                                            <div className="transaction-table no-min-height">
                                                <div className="transaction-table-body transparent padding-vertical-padding">
                                                    <table>
                                                        <thead>
                                                        <tr>
                                                            <td>Item</td>
                                                            <td>Price</td>
                                                            <td className="align-right">QTY</td>
                                                        </tr>
                                                        </thead>
                                                        <tbody>
                                                        {
                                                            this.state.goods &&
                                                            this.state.goods.goods.map((el, index) => {
                                                                return (
                                                                    <tr key={uuid()}>
                                                                        <td
                                                                            className={'blue-link-text'}
                                                                        >
                                                                            <a onClick={() => this.props.setBodyModalParamsAction('MARKETPLACE_PURCHASE', el.goods)}>
                                                                                {el.name}
                                                                            </a>
                                                                        </td>
                                                                        <td>{el.priceATM / 100000000}</td>
                                                                        <td className="align-right">{el.quantity}</td>
                                                                    </tr>
                                                                );
                                                            })
                                                        }
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        </div>
                                    }
                                    {
                                        this.state.goods &&
                                        this.state.goods.goods &&
                                        this.state.goods.goods.length === 0 &&
                                        <p>This user has no goods.</p>
                                    }
                                </div>
                                <div className={classNames({
                                    "tab-body": true,
                                    "active": this.state.activeTab === 6
                                })}>
                                    {
                                        this.state.aliases &&
                                        this.state.aliases.aliases.length &&
                                        <div className="transaction-table no-min-height">
                                            <div className="transaction-table no-min-height">
                                                <div className="transaction-table-body transparent padding-vertical-padding">
                                                    <table>
                                                        <thead>
                                                        <tr>
                                                            <td>Alias</td>
                                                            <td>URI</td>
                                                        </tr>
                                                        </thead>
                                                        <tbody>
                                                        {
                                                            this.state.aliases &&
                                                            this.state.aliases.aliases.map((el, index) => {
                                                                return (
                                                                    <tr key={uuid()}>
                                                                        <td>{el.aliasName}</td>
                                                                        <td>{el.aliasURI}</td>
                                                                    </tr>
                                                                );
                                                            })
                                                        }
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        </div>
                                    }
                                    {
                                        this.state.aliases &&
                                        !this.state.aliases.aliases.length &&
                                        <p>This user has no aliases.</p>
                                    }
                                </div>
                                <div className={classNames({
                                    "tab-body": true,
                                    "active": this.state.activeTab === 7
                                })}>
                                    <div className="flexible-grid">
                                        <a
                                            onClick={() => this.props.setBodyModalParamsAction('SEND_APOLLO', {recipient: this.state.account.accountRS})}
                                            className="btn btn-primary blue static"
                                        >
                                            Send Apollo
                                        </a>
                                        <a
                                            onClick={() => this.props.setBodyModalParamsAction('COMPOSE_MESSAGE', {recipient: this.state.account.accountRS})}
                                            className="btn btn-primary blue static"
                                        >
                                            Send a message
                                        </a>
                                        <a
                                            onClick={() => this.props.setBodyModalParamsAction('SAVE_ACCOUNT', this.state.account.accountRS)}
                                            className="btn btn-primary blue static"
                                        >
                                            Add as contact
                                        </a>
                                    </div>
                                </div>

                            </div>
                            <div className="btn-box align-buttons-inside absolute right-conner">
                                <a className="btn btn-right round round-top-left round-bottom-right"
                                   onClick={() => this.props.closeModal()}
                                >
                                    Close
                                </a>
                            </div>
                        </div>
                    </form>
                }
            </div>
        );
    }
}

const mapStateToProps = state => ({
    modalData: state.modals.modalData,
    account: state.account.account
});

const mapDispatchToProps = dispatch => ({
    setModalData: (data) => setModalData(data),
    getTransactionAction: (data) => dispatch(getTransactionAction(data)),
    setBodyModalParamsAction: (type, data) => dispatch(setBodyModalParamsAction(type, data)),
    formatTimestamp: (time) => dispatch(formatTimestamp(time)),

    // getAccountData
    getBlockAction: (requestParams) => dispatch(getBlockAction(requestParams)),
    getAccountAction:  (requestParams) => dispatch(getAccountAction(requestParams)),
    switchAccountAction:  (requestParams) => dispatch(switchAccountAction(requestParams)),


});

export default connect(mapStateToProps, mapDispatchToProps)(InfoAccount);
