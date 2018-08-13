import React from 'react';
import SiteHeader from '../../components/site-header'
import CircleFigure from './circle-figure'
import { connect } from 'react-redux';
import {Link} from "react-router-dom";
import {setMopalType} from '../../../modules/modals';
import classNames from "classnames";
import Transaction from './transaction';

import {getTransactionsAction} from "../../../actions/transactions";
import {getAccountCurrenciesAction} from "../../../actions/currencies";
import {getDGSGoodsCountAction, getDGSPurchaseCountAction, getDGSPurchasesAction, getDGSPendingPurchases} from "../../../actions/marketplace";
import {getAccountAssetsAction} from '../../../actions/assets'
import {getAliasesCountAction} from '../../../actions/aliases'
import {getMessages} from "../../../actions/messager";


const mapStateToProps = state => ({
    account: state.account.account,
    accountRS: state.account.accountRS,
    balanceATM: state.account.balanceATM,
    description: state.account.description,
    forgedBalanceATM: state.account.forgedBalanceATM,
    name: state.account.name,
    publicKey: state.account.publicKey,
    requestProcessingTime: state.account.requestProcessingTime,
    unconfirmedBalanceATM: state.account.unconfirmedBalanceATM,
});

const mapDispatchToProps = dispatch => ({
    getMessages: (reqParams) => dispatch(getMessages(reqParams)),
    setMopalType: (type) => dispatch(setMopalType(type)),
    getDGSGoodsCountAction: (reqParams) => dispatch(getDGSGoodsCountAction(reqParams)),
    getDGSPendingPurchases: (reqParams) => dispatch(getDGSPendingPurchases(reqParams)),
    getDGSPurchasesAction: (reqParams) => dispatch(getDGSPurchasesAction(reqParams)),
    getAccountAssetsAction: (requestParams) => dispatch(getAccountAssetsAction(requestParams)),
    getAliasesCountAction: (requestParams) => dispatch(getAliasesCountAction(requestParams)),
    getAccountCurrenciesAction: (requestParams) => dispatch(getAccountCurrenciesAction(requestParams)),
    getDGSPurchaseCountAction: (requestParams) => dispatch(getDGSPurchaseCountAction(requestParams)),
    getTransactionsAction: (requestParams) => dispatch(getTransactionsAction(requestParams)),
});

@connect(mapStateToProps, mapDispatchToProps)
class Dashboard extends React.Component {
    constructor(props) {
        super(props);
    }

    state = {
        assetsValue: null,
        aliassesValue: null,
        transactions: null,
        firstIndex: 0,
        lastIndex: 14,
    };

    componentWillReceiveProps(newState) {
        console.log(newState);
        if (newState.account) {
            this.initDashboard({account: newState.account})
        }
    }

    componentWillMount() {
        if (this.props.account) {
            this.initDashboard({account: this.props.account})
        }
    }

    initDashboard = (reqParams) => {
        this.getAccountAsset(reqParams);
        this.getAliasesCount(reqParams);
        this.getCurrenciesCount(reqParams);
        this.getMessagesCount(reqParams);
        this.getGoods({...reqParams, seller: this.props.account});
        this.getTransactions({
            ...reqParams,
            firstIndex: this.state.firstIndex,
            lastIndex: this.state.lastIndex
        });

    }

    getAccountAsset = async (requsetParams) => {
        const accountAssets = await this.props.getAccountAssetsAction(requsetParams);

        if (accountAssets) {
            this.setState({
                assetData: accountAssets.accountAssets,
                assetsValue: parseInt(accountAssets.accountAssets.map((el) => {if(el.decimals) {return el.quantityATU / Math.pow(10, el.decimals)} else {return el.quantityATU}}).reduce((a, b) => a + b, 0)),
                assetsCount: accountAssets.accountAssets.length
            }, () => {
                console.log(this.state);
            })
        }
    };

    getAliasesCount = async (requsetParams) => {
        const aliasesCount = await this.props.getAliasesCountAction(requsetParams);

        if (aliasesCount) {
            this.setState({
                aliassesValue: aliasesCount.numberOfAliases
            })
        }
    };

    getCurrenciesCount = async (requsetParams) => {
        const currencies = await this.props.getAccountCurrenciesAction(requsetParams);

        if (currencies) {
            console.log(currencies);

            this.setState({
                currenciesValue: (currencies.accountCurrencies && currencies.accountCurrencies.length && parseInt(currencies.accountCurrencies.map((el) => {return el.utils}).reduce((a, b) => a + b, 0))) || parseInt(0),
                currenciesCount: currencies.accountCurrencies.length
            })
        }
    };

    getMessagesCount = async (reqParams) => {
        const messages = await this.props.getMessages(reqParams);

        if (messages) {
            this.setState({
                messages: messages.transactions.length
            })
        }
    };

    getTransactions = async (reqParams) => {
        const transactions = await this.props.getTransactionsAction(reqParams);

        if (transactions) {
            this.setState({
                transactions: transactions.transactions
            })
        }
    };

    getGoods = async (reqParams) => {
        const purchased = await this.props.getDGSPurchaseCountAction(reqParams);
        const pendingGoods = await this.props.getDGSPendingPurchases(reqParams);
        const completedPurchased = await this.props.getDGSPurchaseCountAction(reqParams);

        if (purchased && completedPurchased && pendingGoods) {
            this.setState({
                numberOfGoods: purchased.numberOfPurchases,
                completedGoods: completedPurchased.numberOfPurchases,
                pendingGoods: pendingGoods.purchases.length,
            })
        }

    };

    render () {
        return (
            <div className="page-content">
                <SiteHeader
                    pageTitle={'Dashboard'}
                />
                <div className="page-body container-fluid">
                    <div className="row">
                        <div className="col-sm-12 col-md-6 col-lg-3">
                            <div className="card header ballance chart-sprite position-1">
                                <div className="card-title">Available Balance</div>
                                <div className="amount">{ (this.props.balanceATM / 100000000).toFixed(2)}</div>
                            </div>
                            <div className="card card-tall transactions">
                                <div className="card-title">Transactions</div>
                                <div className="transactions-dashboard scroll">
                                    {
                                        this.state.transactions &&
                                        this.state.transactions.map((el, index) => {
                                            return (
                                                <Transaction {...el}/>
                                            );
                                        })
                                    }
                                </div>
                            </div>
                        </div>
                        <div className="col-sm-12 col-md-6 col-lg-3">
                            <div className="card header assets chart-sprite position-2">
                                <div className="card-title">Assets Value</div>
                                <div className="amount">
                                    {this.state.assetsValue}

                                    <div className="owned">
                                        {this.state.assetsCount}
                                    </div>
                                </div>
                            </div>
                            <div className="card asset-portfolio">
                                <div className="card-title">Asset Portfolio</div>
                                <div className="full-box">
                                    {
                                        this.state.assetData &&
                                        this.state.assetData.map((el, index) => {
                                            return (
                                                <div className="full-box-item coin">
                                                    <div className="coin-data">
                                                        <CircleFigure
                                                            percentage={ (el.quantityATU / Math.pow(10, el.decimals)) / (this.state.assetsValue) * 100}
                                                            type={el.quantityATU}
                                                        />
                                                        <div className="amount">{(el.quantityATU / Math.pow(10, el.decimals)) / (this.state.assetsValue) * 100}%</div>
                                                        <div className="coin-name">el.quantityATU</div>
                                                    </div>
                                                </div>
                                            );
                                        })
                                    }

                                </div>
                            </div>
                            <div className="card decentralized-marketplace">
                                <div className="card-title">Decentralized Marketplace</div>
                                <div className="full-box">
                                    <div className="full-box-item">
                                        <div className="marketplace-box">
                                            <div className="digit">{this.state.numberOfGoods}</div>
                                            <div className="subtitle">Purchased products</div>
                                        </div>
                                        <div className="marketplace-box">
                                            <div className="digit">{this.state.pendingGoods}/{this.state.completedGoods}</div>
                                            <div className="subtitle">Sales</div>
                                        </div>
                                    </div>
                                </div>
                                <Link to="/marketplace" className="btn btn-left btn-simple">Marketplace</Link>
                            </div>
                        </div>
                        <div className="col-sm-12 col-md-6 col-lg-3">
                            <div className="card header currencies chart-sprite position-3">
                                <div className="card-title">Currencies Value</div>
                                <div className="amount">
                                    {this.state.currenciesValue / 100000000}

                                    <div className="owned">
                                        {this.state.currenciesCount}
                                    </div>
                                </div>
                            </div>
                            <div className="card send-apollo">
                                <div className="card-title">Send Apollo</div>
                                <div className="full-box">
                                    <div className="form-group offset">
                                        <div className="input-group lighten">
                                            <label>Wallet</label>
                                            <input type="number"/>
                                        </div>
                                        <div className="input-group lighten">
                                            <label>Amount</label>
                                            <input/>
                                        </div>
                                        <div className="input-group lighten">
                                            <label>Send to</label>
                                            <input/>
                                        </div>
                                    </div>
                                </div>
                                <a onClick={this.props.setMopalType.bind(this, 'SEND_APOLLO_PRIVATE')} className="btn btn-left btn-simple">Private APL</a>
                                <button className="btn btn-right" data-modal="sendMoney" onClick={this.props.setMopalType.bind(this, 'SEND_APOLLO')}>Send</button>
                            </div>
                            <div className="card active-polls">
                                <div className="card-title">Active Polls</div>
                                <div className="full-box block">
                                    <p>Search for Zerp on the Asset Exchange section.</p>
                                    <p>What features should be implemented in apollo platform?</p>
                                    <p>Apollo to have future USD/Fiat Pairs on Exchange?</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-sm-12 col-md-6 col-lg-3">
                            <div className="card header coins flex chart-sprite position-4">
                                <div className="general-info">
                                    <div className="top-left">
                                        <div className="top-bar">
                                            {this.state.messages}
                                        </div>
                                        <div className="bottom-bar">
                                            Secure
                                            messages
                                        </div>
                                    </div>
                                    <div className="top-right">
                                        <div className="top-bar">
                                            11
                                        </div>
                                        <div className="bottom-bar">
                                            Coin
                                            shuffling
                                        </div>
                                    </div>
                                    <div className="bottom-left">
                                        <div className="top-bar">
                                            1
                                        </div>
                                        <div className="bottom-bar">
                                            Secure
                                            aliases
                                        </div>
                                    </div>
                                    <div className="bottom-right">
                                        <div className="top-bar">
                                            22
                                        </div>
                                        <div className="bottom-bar">
                                            Data
                                            storage
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="card card-tall apollo-news">
                                <div className="card-title">Apollo News</div>
                                <div className="card-news-content">Lorem ipsum dolor sit amet, consectetur adipiscing
                                    elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
                                    minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
                                    commodo consequat. Duis
                                    aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat
                                    nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui
                                    officia deserunt mollit anim id est laborum.
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}


export default Dashboard;
