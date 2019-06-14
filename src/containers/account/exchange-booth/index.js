/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React from 'react';
import SiteHeader from '../../components/site-header'
import {connect} from 'react-redux';
import {getAllCurrenciesAction, getCurrencyAction} from "../../../actions/currencies";
import classNames from "classnames";
import {BlockUpdater} from "../../block-subscriber";
import {ONE_APL} from '../../../constants';
import {openPrevModal, saveSendModalState, setBodyModalParamsAction} from "../../../modules/modals";
import {
    getAccountExchangeAction,
    getBuyOffersAction,
    getExchangesAction,
    getSellOffersAction
} from "../../../actions/exchange-booth";

import OfferItem from './offer-item/'
import ExchangeItem from './exchange-item/ExchangeItem'
import ExecutedItem from './executed-item/ExecutedItem'
import {Form} from 'react-form';
import uuid from 'uuid'
import {NotificationManager} from "react-notifications";
import {getBlockAction} from "../../../actions/blocks";
import {getTransactionAction} from "../../../actions/transactions";

import SidebarContent from '../../components/sidebar-list';
import BackForm from '../../modals/modal-form/modal-form-container';
import SidebarCurrency from './sdiebar-item';
import NummericInput from "../../components/form-components/numeric-input";

class ExchangeBooth extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currency: null,
            sellOffers: [],
            buyOffers: [],
            exchangeRequest: [],
            executedExchanges: [],
            minimumSellRate: null,
            minimumBuyRate: null,
            totalBuyRate: 0,
            totalSellRate: 0
        };
        this.getBlock = this.getBlock.bind(this);
        this.getTransaction = this.getTransaction.bind(this);
    }

    listener = data => {
        if (this.state.currency) {
            this.getAccountCurrency(
                {
                    requestType: 'getAccountCurrencies',
                    account: this.props.account,
                    includeCurrencyInfo: true,
                    currency: this.state.currency.currency
                }
            );
        }
        this.getCurrency({code: this.props.match.params.currency});
        this.getCurrencies();
    };

    // requestType=getAccountCurrencies&account=APL-NZKH-MZRE-2CTT-98NPZ&currency=15796105555746164961&includeCurrencyInfo=true&random=0.9501498326661535
    componentDidMount() {
        this.getAccountCurrency(
            {
                requestType: 'getAccountCurrencies',
                account: this.props.account,
                includeCurrencyInfo: true,
                code: this.props.match.params.currency
            }
        );
        this.getCurrency({code: this.props.match.params.currency});
        this.getCurrencies();
        BlockUpdater.on("data", this.listener);
    }

    componentWillUnmount() {
        BlockUpdater.removeListener("data", this.listener);
    }

    componentWillReceiveProps(newState) {
        if (this.state.currency) {
            this.getAccountCurrency(
                {
                    requestType: 'getAccountCurrencies',
                    account: this.props.account,
                    includeCurrencyInfo: true,
                    currency: this.state.currency.currency
                }
            );
        }
        this.getCurrency({code: newState.match.params.currency});
        this.getCurrencies();
    }

    getAccountCurrency = async (reqParams) => {
        let accountCurrency = await this.props.getCurrencyAction(reqParams);

        if (accountCurrency) {
            accountCurrency = accountCurrency.accountCurrencies.find((el) => {
                return el.code === this.props.match.params.currency
            });

            this.setState({
                accountCurrency
            })
        }
    }

    getCurrency = async (reqParams) => {
        const currency = await this.props.getCurrencyAction(reqParams);

        if (currency) {
            this.setState({
                ...this.state,
                ...currency,
                currencyInfo: currency
            });
            const id = currency.currency;
            this.getBuyOffers(id);
            this.getSellOffers(id);
            this.getAccountExchanges(id, this.props.account);
            this.getExchanges(id);
        }
    };

    getBuyOffers = async currency => {
        const buyOffers = await this.props.getBuyOffers(currency);
        const offers = buyOffers.offers;

        const values = Math.min.apply(null, offers.map((el) => {
            return el.rateATM
        }));


        this.setState({
            buyOffers: offers,
            minimumBuyRate: '0'
        }, () => {
            if (offers.length) {
                this.setState({
                    minimumBuyRate: isFinite(values) ? values : 0
                })
            }
        })
    };

    getSellOffers = async currency => {
        const sellOffers = await this.props.getSellOffers(currency);
        const offers = sellOffers.offers;

        const values = Math.min.apply(null, offers.map((el) => {
            return el.rateATM
        }));

        this.setState({
            sellOffers: offers,
            minimumSellRate: '0'
        }, () => {
            if (offers.length) {
                this.setState({
                    minimumSellRate: isFinite(values) ? values : 0
                })
            }
        })
    };

    getAccountExchanges = async (currency, account) => {
        const accountExchanges = await this.props.getAccountExchanges(currency, account);
        const exchanges = accountExchanges.exchangeRequests;
        this.setState({
            exchangeRequest: exchanges
        });
    };

    getExchanges = async currency => {
        const exchanges = (await this.props.getExchanges(currency)).exchanges;
        this.setState({
            executedExchanges: exchanges
        })
    };

    getCurrencies = async (reqParams) => {
        const allCurrencies = await this.props.getAllCurrenciesAction(reqParams);

        if (allCurrencies) {
            this.setState({
                currencies: allCurrencies.currencies
            })
        }
    };

    handleMinimumBuyRate = (values) => {
        values = {
            ...values,
            code: this.state.code,
            currency: this.state.currency,
            decimals: this.state.currencyInfo.decimals
        };

        if (!!parseInt(values.rateATM) && !!parseInt(values.units)) {
            this.props.setBodyModalParamsAction('BUY_CURRENCY', values);

        } else {
            NotificationManager.error('Please fill in number of units and rate.', null, 5000);
        }
    };

    handleMinimumSellRate = (values) => {
        values = {
            ...values,
            code: this.state.code,
            currency: this.state.currency,
            decimals: this.state.currencyInfo.decimals
        };

        if (!!parseInt(values.rateATM) && !!parseInt(values.units)) {
            this.props.setBodyModalParamsAction('SELL_CURRENCY', values);

        } else {
            NotificationManager.error('Please fill in number of units and rate.', null, 5000);
        }
    };

    async getBlock(type, blockHeight) {
        const requestParams = {
            height: blockHeight
        };

        const block = await this.props.getBlockAction(requestParams);

        if (block) {
            this.props.setBodyModalParamsAction('INFO_BLOCK', block)
        }
    }

    async getTransaction(requestParams) {
        const transaction = await this.props.getTransactionAction(requestParams);

        if (transaction) {
            this.props.setBodyModalParamsAction('INFO_TRANSACTION', transaction)
        }
    };

    goBack = () => {
        this.setState({
            asset: null
        }, () => {
            this.props.history.push('/currencies')
        });
    };

    render() {
        const isGoBack = !!Object.values(this.props.match.params).length;
        const balanceBuy = Math.round(this.props.balanceATM / ONE_APL);
        const balanceSell = !!this.state.accountCurrency && !!this.state.accountCurrency.unconfirmedUnits ? (this.state.accountCurrency.unconfirmedUnits / Math.pow(10, this.state.accountCurrency.decimals)) : 0;
        return (
            <div className="page-content">
                <SiteHeader
                    pageTitle={'Exchange booth'}
                >
                    {
                        this.state.currency &&
                        <React.Fragment>
                            <button
                                type={'button'}
                                onClick={() => this.props.setBodyModalParamsAction('OFFER_CURRENCY', this.state.currencyInfo)}
                                className="btn btn-green btn-sm"
                            >
                                Offer
                            </button>
                            <button
                                type={'button'}
                                onClick={() => this.props.setBodyModalParamsAction('TRANSFER_CURRENCY', this.state.currencyInfo)}
                                style={{marginLeft: 15}}
                                className="btn btn-green btn-sm"
                            >
                                Transfer
                            </button>
                            {(window.innerWidth < 767 && isGoBack) && (
                                <button
                                    type={'button'}
                                    className={`btn btn-default btn-sm ml-3`}
                                    onClick={this.goBack}
                                >
                                    <i className="zmdi zmdi-long-arrow-left"/>&nbsp;&nbsp;
                                    Back to list
                                </button>
                            )}
                        </React.Fragment>
                    }
                </SiteHeader>
                <div className="page-body container-fluid exchange-booth">
                    <div className="row">
                        <div className={`col-md-3 col-sm-4 p-0 pb-3 pl-0 pr-0`}>
                            <div className="card mb-3">
                                <div className="card-title card-title-lg bg-primary">
                                    <span className={'title-lg'}>{this.state.code}</span>
                                </div>
                                <div className="card-body">
                                    <div className={'form-group-app d-flex flex-column justify-content-between h-100'}>
                                        <p className={'mb-3'}>
                                            <label>
                                                Current supply:
                                            </label>
                                            <div>
                                                {this.state.currentSupply / Math.pow(10, this.state.decimals)} {this.state.code}
                                            </div>
                                        </p>
                                        <p className={'mb-3'}>
                                            <label>
                                                Max supply:
                                            </label>
                                            <div>
                                                {this.state.maxSupply / Math.pow(10, this.state.decimals)} {this.state.code}
                                            </div>
                                        </p>
                                        <p className={'mb-3'}>
                                            <label>
                                                Description:
                                            </label>
                                            <div>
                                                {this.state.description}
                                            </div>
                                        </p>
                                        <p className={'mb-3'}>
                                            <label>
                                                Account:
                                            </label>
                                            <div>
                                                {this.state.accountRS}
                                            </div>
                                        </p>
                                        <p className={'mb-3'}>
                                            <label>
                                                Currency ID:
                                            </label>
                                            <div>
                                                {this.state.currency}
                                            </div>
                                        </p>
                                        <p>
                                            <label>
                                                Currency decimals:
                                            </label>
                                            <div>
                                                {this.state.decimals}
                                            </div>
                                        </p>
                                    </div>
                                </div>
                            </div>
                            {(window.innerWidth > 767 || !isGoBack) && (
                                <SidebarContent
                                    element={'code'}
                                    baseUrl={'/exchange-booth/'}
                                    data={this.state.currencies}
                                    emptyMessage={'No currencies found.'}
                                    Component={SidebarCurrency}
                                />
                            )}
                        </div>

                        <div className={`col-md-9 col-sm-8 pb-3 pl-0 pr-0`}>
                            {(window.innerWidth > 767 || isGoBack) && (
                                <>
                                    {
                                        this.state.currency &&
                                        <div className="row">
                                            <div className="col-xl-6 col-md-12 pr-0 mb-3">
                                                <div className={'card green'}>
                                                    <div
                                                        className="card-title card-title-lg">
                                                        Buy {this.state.code}
                                                        <span>Balance: {balanceBuy.toLocaleString('en')} APL</span>
                                                    </div>
                                                    <div className="card-body">
                                                        <BackForm
                                                            nameModal={this.props.nameModal}
                                                            onSubmit={(values) => this.handleMinimumBuyRate(values)}
                                                            render={({submitForm, values, addValue, removeValue, setValue, getFormState}) => {
                                                                return (
                                                                    <form onSubmit={submitForm}
                                                                          onChange={() => this.props.saveSendModalState(values)}
                                                                          className="form-group-app">
                                                                        <NummericInput
                                                                            setValue={setValue}
                                                                            label="Units"
                                                                            field="units"
                                                                            type={"float"}
                                                                            placeholder="Units"
                                                                            onChange={(e) => {
                                                                                if (!e.target) {
                                                                                    setValue('rateATM', Math.round(((this.state.minimumSellRate / ONE_APL) * Math.pow(10, this.state.decimals)) * parseInt(e)))
                                                                                } else {
                                                                                    setValue('rateATM', Math.round(((this.state.minimumSellRate / ONE_APL) * Math.pow(10, this.state.decimals)) * parseInt(getFormState().values.units)))
                                                                                }
                                                                            }}
                                                                            counterLabel={this.state.code}
                                                                        />
                                                                        <div className="form-group mb-15">
                                                                            <label>Maximum Rate</label>
                                                                            <div className="input-group">
                                                                                {
                                                                                    !!this.state.minimumSellRate &&
                                                                                    <input
                                                                                        value={Math.round((this.state.minimumSellRate / ONE_APL) * Math.pow(10, this.state.decimals))}
                                                                                        ref="buy_currency_rate"
                                                                                        placeholder='Quantity'
                                                                                        className={"form-control"}
                                                                                        readOnly
                                                                                        disabled
                                                                                    />
                                                                                }

                                                                                <div className="input-group-append">
                                                                                    <span className="input-group-text"
                                                                                          id="amountText">{this.state.code}</span>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                        <div className="form-group mb-15">
                                                                            <label>Effective Rate</label>
                                                                            <div className="input-group">
                                                                                {
                                                                                    !!this.state.minimumSellRate &&
                                                                                    <input
                                                                                        value={Math.round((this.state.minimumSellRate / ONE_APL) * Math.pow(10, this.state.decimals))}
                                                                                        ref="buy_currency_rate"
                                                                                        placeholder='Quantity'
                                                                                        className={"form-control "}
                                                                                        readOnly
                                                                                        disabled
                                                                                    />
                                                                                }
                                                                                <div className="input-group-append">
                                                                                    <span className="input-group-text"
                                                                                          id="amountText">{this.state.code}</span>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                        <NummericInput
                                                                            setValue={setValue}
                                                                            label="Total"
                                                                            field="rateATM"
                                                                            type={"tel"}
                                                                            placeholder="Price"
                                                                            counterLabel={this.state.code}
                                                                            disabled
                                                                        />
                                                                        <button
                                                                            className={classNames({
                                                                                "btn btn-lg btn-green submit-button": true,
                                                                                'disabled': !(!!parseInt(getFormState().values.rateATM)),
                                                                            })}
                                                                        >
                                                                            Buy (APL > {this.state.code})
                                                                        </button>
                                                                    </form>
                                                                )
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-xl-6 col-md-12 pr-0 mb-3">
                                                <div className={'card green'}>
                                                    <div className="card-title card-title-lg">
                                                        Sell {this.state.code}
                                                        <span>Balance: {balanceSell.toLocaleString('en')} {this.state.code}</span>
                                                    </div>
                                                    <div className="card-body">
                                                        <Form
                                                            onSubmit={(values) => this.handleMinimumSellRate(values)}
                                                            render={({submitForm, values, addValue, removeValue, setValue, getFormState}) => {
                                                                return (
                                                                    <form className="form-group-app"
                                                                          onSubmit={submitForm}>
                                                                        <NummericInput
                                                                            setValue={setValue}
                                                                            label="Units"
                                                                            field="units"
                                                                            type={"float"}
                                                                            placeholder="Units"
                                                                            onChange={(e) => {
                                                                                if (!e.target) {
                                                                                    setValue('rateATM', Math.round(((this.state.minimumBuyRate / ONE_APL) * Math.pow(10, this.state.decimals)) * parseInt(e)))
                                                                                } else {
                                                                                    setValue('rateATM', Math.round(((this.state.minimumBuyRate / ONE_APL) * Math.pow(10, this.state.decimals)) * parseInt(getFormState().values.units)))
                                                                                }
                                                                            }}
                                                                            counterLabel={this.state.code}
                                                                        />
                                                                        <div className="form-group mb-15">
                                                                            <label>Maximum Rate</label>
                                                                            <div className="input-group">
                                                                                {
                                                                                    !!this.state.minimumBuyRate &&
                                                                                    <input
                                                                                        value={Math.round((this.state.minimumBuyRate / ONE_APL) * Math.pow(10, this.state.decimals))}
                                                                                        ref="buy_currency_rate"
                                                                                        placeholder='Quantity'
                                                                                        className={"form-control "}
                                                                                        readOnly
                                                                                        disabled
                                                                                    />
                                                                                }
                                                                                <div className="input-group-append">
                                                                                    <span className="input-group-text"
                                                                                          id="amountText">{this.state.code}</span>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                        <div className="form-group mb-15">
                                                                            <label>Effective Rate</label>
                                                                            <div className="input-group">
                                                                                {
                                                                                    !!this.state.minimumBuyRate &&
                                                                                    <input
                                                                                        value={Math.round((this.state.minimumBuyRate / ONE_APL) * Math.pow(10, this.state.decimals))}
                                                                                        ref="buy_currency_rate"
                                                                                        placeholder='Quantity'
                                                                                        className={"form-control "}
                                                                                        readOnly
                                                                                        disabled
                                                                                    />
                                                                                }
                                                                                <div className="input-group-append">
                                                                                    <span className="input-group-text"
                                                                                          id="amountText">{this.state.code}</span>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                        <NummericInput
                                                                            setValue={setValue}
                                                                            label="Total"
                                                                            field="rateATM"
                                                                            type={"tel"}
                                                                            placeholder="Price"
                                                                            counterLabel={this.state.code}
                                                                            disabled
                                                                        />
                                                                        <button
                                                                            className={classNames({
                                                                                "btn btn-lg btn-green submit-button": true,
                                                                                'disabled': !(!!parseInt(getFormState().values.rateATM)),
                                                                            })}
                                                                        >
                                                                            Buy (APL > {this.state.code})
                                                                        </button>
                                                                    </form>
                                                                )
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-md-12 p-0">
                                                <div className="row">
                                                    <div className="col-md-6 display-flex pr-0 mb-3">
                                                        <div className={'card h-auto'}>
                                                            <div className="card-title">
                                                                Offers to sell {this.state.code}
                                                            </div>
                                                            <div className="card-body h-auto">
                                                                {this.state.sellOffers.length === 0 ?
                                                                    <div className="info-box simple">
                                                                        <p>No open sell offers.<br/>You cannot sell this
                                                                            currency
                                                                            now,
                                                                            but you could publish an exchange offer
                                                                            instead, and
                                                                            wait for others to fill it.</p>
                                                                    </div> :
                                                                    <div className="transaction-table no-min-height">
                                                                        <div
                                                                            className="transaction-table-body padding-only-top">
                                                                            <table>
                                                                                <thead>
                                                                                <tr>
                                                                                    <td>Account</td>
                                                                                    <td className="align-right">Units</td>
                                                                                    <td className="align-right">Limit</td>
                                                                                    <td className="align-right">Rate</td>
                                                                                </tr>
                                                                                </thead>
                                                                                <tbody>
                                                                                {this.state.sellOffers.map(offer =>
                                                                                    <OfferItem
                                                                                        key={uuid()}
                                                                                        offer={offer}
                                                                                        decimals={this.state.currencyInfo.decimals}
                                                                                    />
                                                                                )}
                                                                                </tbody>
                                                                            </table>
                                                                        </div>
                                                                    </div>
                                                                }
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6 display-flex pr-0 mb-3">
                                                        <div className={'card h-auto'}>
                                                            <div className="card-title">
                                                                Offers to buy {this.state.code}
                                                            </div>
                                                            <div className="card-body h-auto">
                                                                {this.state.buyOffers.length === 0 ?
                                                                    <div className="info-box simple">
                                                                        <p>No open buy offers.<br/>You cannot sell this
                                                                            currency
                                                                            now,
                                                                            but you could publish an exchange offer
                                                                            instead,
                                                                            and
                                                                            wait for others to fill it.</p>
                                                                    </div> :
                                                                    <div
                                                                        className="transaction-table no-min-height">
                                                                        <div
                                                                            className="transaction-table-body padding-only-top">
                                                                            <table>
                                                                                <thead>
                                                                                <tr>
                                                                                    <td>Account</td>
                                                                                    <td className="align-right">Units</td>
                                                                                    <td className="align-right">Limit</td>
                                                                                    <td className="align-right">Rate</td>
                                                                                </tr>
                                                                                </thead>
                                                                                <tbody>
                                                                                {this.state.buyOffers.map(offer =>
                                                                                    <OfferItem
                                                                                        key={uuid()}
                                                                                        offer={offer}
                                                                                        decimals={this.state.currencyInfo.decimals}
                                                                                    />
                                                                                )}
                                                                                </tbody>
                                                                            </table>
                                                                        </div>
                                                                    </div>
                                                                }
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-md-12 pr-0 pb-3">
                                                <div className={'card h-auto'}>
                                                    <div className="card-title">
                                                        Exchange requests
                                                    </div>
                                                    <div className="card-body h-auto">
                                                        {this.state.exchangeRequest.length === 0 ?
                                                            <div className="info-box simple">
                                                                <p>No exchange requests found.</p>
                                                            </div>
                                                            :
                                                            <div className="transaction-table no-min-height">
                                                                <div
                                                                    className="transaction-table-body padding-only-top">
                                                                    <table>
                                                                        <thead>
                                                                        <tr>
                                                                            <td>Height</td>
                                                                            <td>Type</td>
                                                                            <td className="align-right">Units</td>
                                                                            <td className="align-right">Rate</td>
                                                                            <td className="align-right">Total</td>
                                                                        </tr>
                                                                        </thead>
                                                                        <tbody>
                                                                        {this.state.exchangeRequest.map(exchange =>
                                                                            <ExchangeItem
                                                                                decimals={this.state.currencyInfo.decimals}
                                                                                key={uuid()}
                                                                                exchange={exchange}
                                                                                setBlockInfo={this.getBlock}
                                                                            />
                                                                        )}
                                                                        </tbody>
                                                                    </table>
                                                                </div>
                                                            </div>
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-md-12 pr-0 pb-3">
                                                <div className={'card h-auto'}>
                                                    <div className="card-title">
                                                        Executed exchanges
                                                    </div>
                                                    <div className="card-body h-auto">
                                                        {this.state.executedExchanges.length === 0 ?
                                                            <div className="info-box simple">
                                                                <p>No executed exchanges found.</p>
                                                            </div>
                                                            :
                                                            <div className="transaction-table no-min-height">
                                                                <div
                                                                    className="transaction-table-body padding-only-top">
                                                                    <table>
                                                                        <thead>
                                                                        <tr>
                                                                            <td>Date</td>
                                                                            <td>Seller</td>
                                                                            <td>Buyer</td>
                                                                            <td className="align-right">Units</td>
                                                                            <td className="align-right">Rate</td>
                                                                            <td className="align-right">Total</td>
                                                                        </tr>
                                                                        </thead>
                                                                        <tbody>
                                                                        {this.state.executedExchanges.map(exchange =>
                                                                            <ExecutedItem
                                                                                decimals={this.state.currencyInfo.decimals}
                                                                                key={uuid()}
                                                                                exchange={exchange}
                                                                                setTransactionInfo={this.getTransaction}
                                                                            />
                                                                        )}
                                                                        </tbody>
                                                                    </table>
                                                                </div>
                                                            </div>
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    }
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    account: state.account.accountRS,
    balanceATM: state.account.balanceATM,
    modalsHistory: state.modals.modalsHistory,
});

const mapDispatchToProps = dispatch => ({

    getBuyOffers: currency => dispatch(getBuyOffersAction(currency)),
    getSellOffers: currency => dispatch(getSellOffersAction(currency)),
    getAccountExchanges: (currency, account) => dispatch(getAccountExchangeAction(currency, account)),
    getExchanges: currency => dispatch(getExchangesAction(currency)),

    setBodyModalParamsAction: (type, data, valueForModal) => dispatch(setBodyModalParamsAction(type, data, valueForModal)),
    getCurrencyAction: (reqParams) => dispatch(getCurrencyAction(reqParams)),
    getAllCurrenciesAction: (reqParams) => dispatch(getAllCurrenciesAction(reqParams)),
    getBlockAction: (requestParams) => dispatch(getBlockAction(requestParams)),
    getTransactionAction: (data) => dispatch(getTransactionAction(data)),
    saveSendModalState: (Params) => dispatch(saveSendModalState(Params)),
    openPrevModal: () => dispatch(openPrevModal()),
});

export default connect(mapStateToProps, mapDispatchToProps)(ExchangeBooth);
