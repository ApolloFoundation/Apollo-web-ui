/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React from 'react';
import {Link} from 'react-router-dom';
import SiteHeader from '../../components/site-header'
import ExchangeBoothTable from './exchange-booth-table';
import {connect} from 'react-redux';
import {getCurrencyAction, getAllCurrenciesAction} from "../../../actions/currencies";
import classNames from "classnames";
import {BlockUpdater} from "../../block-subscriber";
import {setBodyModalParamsAction, saveSendModalState, openPrevModal} from "../../../modules/modals";
import {
    getAccountExchangeAction,
    getBuyOffersAction,
    getExchangesAction,
    getSellOffersAction
} from "../../../actions/exchange-booth";
import InputForm from '../../components/input-form';

import OfferItem  from './offer-item/'
import ExchangeItem  from './exchange-item/ExchangeItem'
import ExecutedItem  from './executed-item/ExecutedItem'
import {Form, Text, TextArea} from 'react-form';
import uuid from 'uuid'
import {NotificationManager} from "react-notifications";
import {getBlockAction} from "../../../actions/blocks";
import {getTransactionAction} from "../../../actions/transactions";
import ContentLoader from '../../components/content-loader';
import ContentHendler from '../../components/content-hendler';

import BackForm from '../../modals/modal-form/modal-form-container';

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
                    requestType : 'getAccountCurrencies',
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
                    requestType : 'getAccountCurrencies',
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
                    requestType : 'getAccountCurrencies',
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

    sellLimit = () => {
        let limit = 0;
        this.state.sellOffers.map(item => {
            limit += item.supply / Math.pow(10, this.state.currencyInfo.decimals);
        });
        return limit;
    };

    buyLimit = () => {
        let limit = 0;
        this.state.buyOffers.map(item => {
            limit += item.supply / Math.pow(10, this.state.currencyInfo.decimals);
        });
        return limit;
    };

    render() {
        return (
            <div className="page-content">
                <SiteHeader
                    pageTitle={'Exchange booth'}
                >
                    {
                        this.state.currency &&
                        <React.Fragment>
                            <a
                                onClick={() => this.props.setBodyModalParamsAction('OFFER_CURRENCY', this.state.currencyInfo)}
                                className="btn primary"
                            >
                                Offer
                            </a>
                            <a
                                onClick={() => this.props.setBodyModalParamsAction('TRANSFER_CURRENCY', this.state.currencyInfo)}
                                style={{marginLeft: 15}}
                                className="btn primary"
                            >
                                Transfer
                            </a>
                        </React.Fragment>

                    }
                </SiteHeader>
                {
                    this.state.currency &&
                    <div className="page-body container-fluid assets-exchange">
                        <div className="row">
                            <div className="col-md-3 p-0">
                                <div className="card card-full-screen no-padding scroll">
                                    {
                                        this.state.currencies &&
                                        this.state.currencies.map((el, index) => {
                                            return (
                                                <Link
                                                    key={uuid()}
                                                    style={{display: 'block'}}
                                                    to={"/exchange-booth/" + (el ? el.code : "")}
                                                    className={classNames({
                                                        "chat-item": true,
                                                        "active": this.state.currency === (el ? el.currency : "")
                                                    })}
                                                >
                                                    <div className="chat-box-item">
                                                        <div className="chat-box-rs">
                                                            {el ? el.name : ""}
                                                        </div>
                                                        <div className="chat-date">
                                                            Current Supply:&nbsp;{el.currentSupply / Math.pow(10, el.decimals)}
                                                        </div>
                                                    </div>
                                                </Link>
                                            );
                                        })
                                    }
                                </div>
                            </div>
                            <div className="col-md-9 p-0">
                                <div className="row">
                                    <div className="col-xl-6 col-md-12 pr-0">
                                        <div className="card header ballance medium-padding">
                                            <div className="row">
                                                <div className="col-md-6">
                                                    <div className="card-title medium">{this.state.code}</div>
                                                </div>
                                                <div className="col-md-6 flex">
                                                    <div className="card-title small word-brake">{this.state.description}</div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="card ballance auto-height medium-padding">
                                            <BackForm
	                                            nameModal={this.props.nameModal}
                                                onSubmit={(values) => this.handleMinimumBuyRate(values)}
                                                render={({ submitForm, values, addValue, removeValue, setValue, getFormState }) => (
                                                    <form onSubmit={submitForm} onChange={() => this.props.saveSendModalState(values)} className="form-group-app">
                                                        <div className="form-title">
                                                            {this.props.modalsHistory.length > 1 &&
                                                            <div className={"backMy"} onClick={() => {this.props.openPrevModal()}}></div>
                                                            }
                                                            <p>Buy {this.state.code}</p>
                                                            <div className="form-sub-title">
                                                                balance: <strong>{Math.round(this.props.balanceATM / 100000000).toLocaleString('en')} Apollo</strong>
                                                            </div>
                                                        </div>
                                                        <div
                                                            className="input-group-app offset-top display-block inline no-margin">
                                                            <div className="form-group row form-group-white">
                                                                <div className="col-md-3 pl-0">
                                                                    <label>Units</label>
                                                                </div>
                                                                <div
                                                                    className="col-md-9 pr-0 input-group input-group-text-transparent">
                                                                    <InputForm
                                                                        field="units"
                                                                        type={'float'}
                                                                        placeholder='Units'
                                                                        onChange={(e) => {
                                                                            if (!e.target) {
                                                                                setValue('rateATM', Math.round(((this.state.minimumSellRate / 100000000) * Math.pow(10, this.state.decimals)) * parseInt(e)))
                                                                            } else {
                                                                                setValue('rateATM', Math.round(((this.state.minimumSellRate / 100000000) * Math.pow(10, this.state.decimals)) * parseInt(getFormState().values.units)))
                                                                            }
                                                                        }}
                                                                        setValue={setValue}
                                                                        maxValue={this.sellLimit()}
                                                                    />
                                                                    <div className="input-group-append">
                                                                        <span className="input-group-text"
                                                                              id="amountText">{this.state.code}</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div
                                                            className="input-group-app offset-top display-block inline no-margin">
                                                            <div className="form-group row form-group-white">
                                                                <div className="col-md-3 pl-0">
                                                                    <label>Maximum Rate</label>
                                                                </div>

                                                                <div
                                                                    className="col-md-9 pr-0 input-group input-group-text-transparent">
                                                                    {
                                                                        !!this.state.minimumSellRate &&
                                                                        <input
                                                                            value={Math.round((this.state.minimumSellRate / 100000000) * Math.pow(10, this.state.decimals))}
                                                                            ref="buy_currency_rate"
                                                                            placeholder='Quantity'
                                                                            className={"form-control "}
                                                                            readOnly
                                                                            disabled
                                                                        />
                                                                    }

                                                                    <div className="input-group-append">
                                                                        <span
                                                                            className="input-group-text"
                                                                            id="amountText"
                                                                        >
                                                                            {this.state.code}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div
                                                            className="input-group-app offset-top display-block inline no-margin">
                                                            <div className="form-group row form-group-white">
                                                                <div className="col-md-3 pl-0">
                                                                    <label>Effective Rate</label>
                                                                </div>

                                                                <div
                                                                    className="col-md-9 pr-0 input-group input-group-text-transparent">
                                                                    {
                                                                        !!this.state.minimumSellRate &&
                                                                        <input
                                                                            value={Math.round((this.state.minimumSellRate / 100000000) * Math.pow(10, this.state.decimals))}
                                                                            ref="buy_currency_rate"
                                                                            placeholder='Quantity'
                                                                            className={"form-control "}
                                                                            readOnly
                                                                            disabled
                                                                        />
                                                                    }
                                                                    <div className="input-group-append">
                                                                        <span
                                                                            className="input-group-text"
                                                                            id="amountText"
                                                                        >
                                                                            {this.state.code}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div
                                                            className="input-group-app offset-top display-block inline no-margin">
                                                            <div className="form-group row form-group-white">
                                                                <div className="col-md-3 pl-0">
                                                                    <label>Total</label>
                                                                </div>
                                                                <div
                                                                    className="col-md-9 pr-0 input-group input-group-text-transparent">
                                                                    <Text
                                                                        field="rateATM"
                                                                        placeholder='Price'
                                                                        className={"form-control"}
                                                                        readOnly
                                                                        disabled
                                                                    />
                                                                    <div className="input-group-append">
                                                                        <span
                                                                            className="input-group-text"
                                                                            id="amountText"
                                                                        >
                                                                            {this.state.code}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div
                                                            className="input-group-app offset-top display-block inline no-margin">
                                                            <div className="row form-group-white">
                                                                <div className="col-md-3 pl-0">
                                                                </div>
                                                                <div className="col-md-9 pr-0">
                                                                    <button
                                                                        type='submit'
                                                                        className={classNames({
                                                                            'blue-disabled' : !(!!parseInt(getFormState().values.rateATM)),
                                                                            'btn': true,
                                                                            'static': true,
                                                                            'blue': true,
                                                                        })}
                                                                    >
                                                                        Buy (APL > {this.state.code})
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </form>
                                                )}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-xl-6 col-md-12 pr-0">
                                        <div className="card header assets medium-padding">
                                            <div className="full-box full">
                                                <div className="full-box-item">
                                                    <div className='box'>
                                                        <div className="card-title bold">Account:</div>
                                                        <div
                                                            className="card-title description">{this.state.accountRS}</div>
                                                    </div>
                                                    <div className='box'>
                                                        <div className="card-title bold">Currency ID:</div>
                                                        <div
                                                            className="card-title asset-id description">{this.state.currency}</div>
                                                    </div>
                                                </div>
                                                <div className="full-box-item">
                                                    <div className='box'>
                                                        <div className="card-title bold">Current supply:</div>
                                                        <div
                                                            className="card-title description">{this.state.currentSupply / Math.pow(10, this.state.decimals)}</div>
                                                    </div>
                                                    <div className='box'>
                                                        <div className="card-title bold">Max supply:</div>
                                                        <div
                                                            className="card-title description">{this.state.maxSupply  / Math.pow(10, this.state.decimals)}</div>
                                                    </div>
                                                    <div className='box'>
                                                        <div className="card-title bold">Currency decimals:</div>
                                                        <div
                                                            className="card-title description">{this.state.decimals}</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="card assets auto-height medium-padding">
                                            <Form
                                                onSubmit={(values) => this.handleMinimumSellRate(values)}
                                                render={({ submitForm, values, addValue, removeValue, setValue, getFormState }) => (
                                                    <form className="form-group-app" onSubmit={submitForm}>
                                                        <div className="form-title">
                                                            <p>Sell {this.state.code}</p>
                                                            <div className="form-sub-title">
                                                                balance: <strong>{!!this.state.accountCurrency && !!this.state.accountCurrency.unconfirmedUnits ? (this.state.accountCurrency.unconfirmedUnits / Math.pow(10, this.state.accountCurrency.decimals)).toLocaleString('en') : 0} {this.state.code}</strong>
                                                            </div>
                                                        </div>
                                                        <div
                                                            className="input-group-app offset-top display-block inline no-margin">
                                                            <div className="form-group row form-group-white">
                                                                <div className="col-md-3 pl-0">
                                                                    <label>Units</label>
                                                                </div>
                                                                <div
                                                                    className="col-md-9 pr-0 input-group input-group-text-transparent">
                                                                    <InputForm
                                                                        field="units"
                                                                        type={'float'}
                                                                        placeholder='Units'
                                                                        onChange={(e) => {
                                                                            if (!e.target) {
                                                                                setValue('rateATM', Math.round(((this.state.minimumBuyRate / 100000000) * Math.pow(10, this.state.decimals)) * parseInt(e)))
                                                                            } else {
                                                                                setValue('rateATM', Math.round(((this.state.minimumBuyRate / 100000000) * Math.pow(10, this.state.decimals)) * parseInt(getFormState().values.units)))
                                                                            }
                                                                        }}
                                                                        setValue={setValue}
                                                                        maxValue={this.buyLimit()}
                                                                    />
                                                                    <div className="input-group-append">
                                                                        <span className="input-group-text"
                                                                              id="amountText">{this.state.code}</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div
                                                            className="input-group-app offset-top display-block inline no-margin">
                                                            <div className="form-group row form-group-white">
                                                                <div className="col-md-3 pl-0">
                                                                    <label>Maximum Rate</label>
                                                                </div>
                                                                <div
                                                                    className="col-md-9 pr-0 input-group input-group-text-transparent">
                                                                    {
                                                                        !!this.state.minimumBuyRate &&
                                                                        <input
                                                                            value={Math.round((this.state.minimumBuyRate / 100000000) * Math.pow(10, this.state.decimals))}
                                                                            ref="buy_currency_rate"
                                                                            placeholder='Quantity'
                                                                            className={"form-control "}
                                                                            readOnly
                                                                            disabled
                                                                        />
                                                                    }

                                                                    <div className="input-group-append">
                                                                        <span
                                                                            className="input-group-text"
                                                                            id="amountText"
                                                                        >
                                                                            {this.state.code}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div
                                                            className="input-group-app offset-top display-block inline no-margin">
                                                            <div className="form-group row form-group-white">
                                                                <div className="col-md-3 pl-0">
                                                                    <label>Effective Rate</label>
                                                                </div>
                                                                <div
                                                                    className="col-md-9 pr-0 input-group input-group-text-transparent">
                                                                    {
                                                                        !!this.state.minimumBuyRate &&
                                                                        <input
                                                                            value={Math.round((this.state.minimumBuyRate / 100000000) * Math.pow(10, this.state.decimals))}
                                                                            ref="buy_currency_rate"
                                                                            placeholder='Quantity'
                                                                            className={"form-control "}
                                                                            readOnly
                                                                            disabled
                                                                        />
                                                                    }
                                                                    <div className="input-group-append">
                                                                        <span className="input-group-text"
                                                                              id="amountText">{this.state.code}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div
                                                            className="input-group-app offset-top display-block inline no-margin">
                                                            <div className="form-group row form-group-white">
                                                                <div className="col-md-3 pl-0">
                                                                    <label>Total</label>
                                                                </div>
                                                                <div
                                                                    className="col-md-9 pr-0 input-group input-group-text-transparent">
                                                                    <Text
                                                                        field="rateATM"
                                                                        placeholder='Price'
                                                                        className={"form-control"}
                                                                        readOnly
                                                                        disabled
                                                                    />
                                                                    <div className="input-group-append">
                                                                        <span className="input-group-text"
                                                                              id="amountText">{this.state.code}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div
                                                            className="input-group-app offset-top display-block inline no-margin">
                                                            <div className="row form-group-white">
                                                                <div className="col-md-3 pl-0">
                                                                </div>
                                                                <div className="col-md-9 pr-0">
                                                                    <button className={classNames({
                                                                        'blue-disabled' : !(!!parseInt(getFormState().values.rateATM)),
                                                                        'btn': true,
                                                                        'static': true,
                                                                        'blue': true,
                                                                    })}
                                                                    >
                                                                        Sell ({this.state.code} > APL)
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </form>
                                                )}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-12 p-0 margin-top-13">
                                        <div className="row">
                                            <div className="col-md-6 display-flex pr-0">
                                                <div className="card ballance medium-padding card-flexible">
                                                    <div className="form-group-app">
                                                        <div className="form-title">
                                                            <p>Offers to sell {this.state.code}</p>
                                                        </div>
                                                        {this.state.sellOffers.length === 0 ?
                                                            <div className="info-box simple">
                                                                <p>No open sell offers. You cannot sell this currency
                                                                    now,
                                                                    but you could publish an exchange offer instead, and
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
                                                                        {this.state.sellOffers.map(offer => <OfferItem
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
                                            <div className="col-md-6 display-flex pr-0">
                                                <div className="card assets medium-padding card-flexible">
                                                    <div className="form-group-app">
                                                        <div className="form-title">
                                                            <p>Offers to buy {this.state.code}</p>
                                                        </div>
                                                        <div className="info-box simple">
                                                            {this.state.buyOffers.length === 0 ?
                                                                <div className="info-box simple">
                                                                    <p>No open buy offers. You cannot sell this currency
                                                                        now,
                                                                        but you could publish an exchange offer instead,
                                                                        and
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
                                    </div>
                                    <div className="col-md-12">
                                        <div className="card ballance medium-padding card-flexible">
                                            <div className="form-group-app">
                                                <div className="form-title">
                                                    <p>Exchange requests</p>
                                                </div>
                                                {this.state.exchangeRequest.length === 0 ?
                                                    <div className="info-box simple">
                                                        <p>No exchanges.</p>
                                                    </div>
                                                    :
                                                    <div className="transaction-table no-min-height">
                                                        <div className="transaction-table-body padding-only-top">
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
                                    <div className="col-md-12">
                                        <div className="card ballance medium-padding card-flexible" style={{marginBottom:0}}>
                                            <div className="form-group-app">
                                                <div className="form-title">
                                                    <p>Executed exchanges</p>
                                                </div>
                                                {this.state.executedExchanges.length === 0 ?
                                                    <div className="info-box simple">
                                                        <p>No exchanges.</p>
                                                    </div>
                                                    :
                                                    <div className="transaction-table no-min-height">
                                                        <div className="transaction-table-body padding-only-top">
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
                            </div>
                        </div>
                    </div>
                }
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