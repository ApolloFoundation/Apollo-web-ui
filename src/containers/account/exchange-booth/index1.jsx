/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React from 'react';
import {connect} from 'react-redux';
import {Form} from 'react-form';
import {NotificationManager} from "react-notifications";
import classNames from "classnames";
import {getAllCurrenciesAction, getCurrencyAction} from "../../../actions/currencies";
import {BlockUpdater} from "../../block-subscriber";
import {ONE_APL} from '../../../constants';
import {openPrevModal, saveSendModalState, setBodyModalParamsAction} from "../../../modules/modals";
import {getBlockAction} from "../../../actions/blocks";
import {
  getAccountExchangeAction,
  getBuyOffersAction,
  getExchangesAction,
  getSellOffersAction
} from "../../../actions/exchange-booth";
import {getTransactionAction} from "../../../actions/transactions";
import BackForm from '../../modals/modal-form/modal-form-container';
import SiteHeader from '../../components/site-header'
import SidebarContent from '../../components/sidebar-list';
import NummericInput from "../../components/form-components/numeric-input";
import CustomTable from "../../components/tables/table";
import ExchangeItem from './exchange-item/ExchangeItem'
import ExecutedItem from './executed-item/ExecutedItem'
import SidebarCurrency from './sdiebar-item';
import OfferItem from './offer-item/'

const itemsPerPage = 5;

export default function ExchangeBooth() {

}

class ExchangeBooth extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currency: null,
            sellOffers: [],
            buyOffers: [],
            exchangeRequest: [],
            executedExchanges: [],
            pagination: {
                sellOffers: {
                    page: 1,
                    firstIndex: 0,
                    lastIndex: itemsPerPage,
                },
                buyOffers: {
                    page: 1,
                    firstIndex: 0,
                    lastIndex: itemsPerPage,
                },
                exchangeRequest: {
                    page: 1,
                    firstIndex: 0,
                    lastIndex: itemsPerPage,
                },
                executedExchanges: {
                    page: 1,
                    firstIndex: 0,
                    lastIndex: itemsPerPage,
                },
            },
            minimumSellRate: null,
            minimumBuyRate: null,
            totalBuyRate: 0,
            totalSellRate: 0
        };
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

    getBuyOffers = async (currency, pagination) => {
        if (!pagination) {
            pagination = {
                firstIndex: this.state.pagination.buyOffers.firstIndex,
                lastIndex: this.state.pagination.buyOffers.lastIndex,
            }
        }
        const buyOffers = await this.props.getBuyOffers({
            currency,
            firstIndex: pagination.firstIndex,
            lastIndex: pagination.lastIndex
        });
        const offers = buyOffers.offers;

        const values = Math.min.apply(null, offers.map((el) => {
            return el.rateATM
        }));

        const newPagination = this.state.pagination;
        newPagination.buyOffers = {
            ...newPagination.buyOffers,
            ...pagination
        };

        this.setState({
            buyOffers: offers,
            minimumBuyRate: '0',
            pagination: newPagination,
        }, () => {
            if (offers.length) {
                this.setState({
                    minimumBuyRate: isFinite(values) ? values : 0
                })
            }
        })
    };

    getSellOffers = async (currency, pagination) => {
        if (!pagination) {
            pagination = {
                firstIndex: this.state.pagination.sellOffers.firstIndex,
                lastIndex: this.state.pagination.sellOffers.lastIndex,
            }
        }
        const sellOffers = await this.props.getSellOffers({
            currency,
            firstIndex: pagination.firstIndex,
            lastIndex: pagination.lastIndex
        });
        const offers = sellOffers.offers;

        const values = Math.min.apply(null, offers.map((el) => {
            return el.rateATM
        }));

        const newPagination = this.state.pagination;
        newPagination.sellOffers = {
            ...newPagination.sellOffers,
            ...pagination
        };

        this.setState({
            sellOffers: offers,
            minimumSellRate: '0',
            pagination: newPagination,
        }, () => {
            if (offers.length) {
                this.setState({
                    minimumSellRate: isFinite(values) ? values : 0
                })
            }
        })
    };

    getAccountExchanges = async (currency, account, pagination) => {
        if (!pagination) {
            pagination = {
                firstIndex: this.state.pagination.exchangeRequest.firstIndex,
                lastIndex: this.state.pagination.exchangeRequest.lastIndex,
            }
        }
        const accountExchanges = await this.props.getAccountExchanges({
            currency,
            account,
            firstIndex: pagination.firstIndex,
            lastIndex: pagination.lastIndex
        });
        const exchanges = accountExchanges.exchangeRequests;

        const newPagination = this.state.pagination;
        newPagination.exchangeRequest = {
            ...newPagination.exchangeRequest,
            ...pagination
        };

        this.setState({
            exchangeRequest: exchanges,
            pagination: newPagination,
        });
    };

    getExchanges = async (currency, pagination) => {
        if (!pagination) {
            pagination = {
                firstIndex: this.state.pagination.executedExchanges.firstIndex,
                lastIndex: this.state.pagination.executedExchanges.lastIndex,
            }
        }
        const exchanges = (await this.props.getExchanges({
            currency,
            firstIndex: pagination.firstIndex,
            lastIndex: pagination.lastIndex
        })).exchanges;

        const newPagination = this.state.pagination;
        newPagination.executedExchanges = {
            ...newPagination.executedExchanges,
            ...pagination
        };

        this.setState({
            executedExchanges: exchanges,
            pagination: newPagination,
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

    getBlock = async (type, blockHeight) => {
        const requestParams = {
            height: blockHeight
        };

        const block = await this.props.getBlockAction(requestParams);

        if (block) {
            this.props.setBodyModalParamsAction('INFO_BLOCK', block)
        }
    };

    getTransaction = async (requestParams) => {
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

    onPaginate = (type, page) => {
        const pagination = {
            page: page,
            firstIndex: page * itemsPerPage - itemsPerPage,
            lastIndex: page * itemsPerPage
        };
        if (type === 'buyOffers') {
            this.getBuyOffers(this.state.currency.currency, pagination);
        } else if (type === 'sellOffers') {
            this.getSellOffers(this.state.currency.currency, pagination);
        } else if (type === 'exchangeRequest') {
            this.getAccountExchanges(this.state.currency.currency, this.props.account, pagination);
        } else if (type === 'executedExchanges') {
            this.getExchanges(this.state.currency.currency, pagination);
        }
    };

    render() {
        const isGoBack = !!Object.values(this.props.match.params).length;
        const balanceBuy = Math.round(this.props.balanceATM / ONE_APL);
        const balanceSell = !!this.state.accountCurrency && !!this.state.accountCurrency.unconfirmedUnits ? (this.state.accountCurrency.unconfirmedUnits / Math.pow(10, this.state.accountCurrency.decimals)) : 0;
        return (
          <div className="page-content">
            <SiteHeader pageTitle={'Exchange booth'}>
              {this.state.currency && (
                <React.Fragment>
                    <button
                        type={'button'}
                        onClick={() => dispatch(setBodyModalParamsAction('OFFER_CURRENCY', this.state.currencyInfo))}
                        className="btn btn-green btn-sm"
                    >
                        Offer
                    </button>
                    <button
                        type={'button'}
                        onClick={() => dispatch(setBodyModalParamsAction('TRANSFER_CURRENCY', this.state.currencyInfo))}
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
              )}
            </SiteHeader>
            <div className="page-body container-fluid exchange-booth">
              <div className="row">
                <div className={`col-md-9 col-sm-8 p-0`}>
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
                                                                                  id="amountText">APL/{this.state.code}</span>
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
                                                                                  id="amountText">APL/{this.state.code}</span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <NummericInput
                                                                    setValue={setValue}
                                                                    label="Total"
                                                                    field="rateATM"
                                                                    type={"tel"}
                                                                    placeholder="Price"
                                                                    counterLabel={'APL'}
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
                                                                                  id="amountText">APL/{this.state.code}</span>
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
                                                                                  id="amountText">APL/{this.state.code}</span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <NummericInput
                                                                    setValue={setValue}
                                                                    label="Total"
                                                                    field="rateATM"
                                                                    type={"tel"}
                                                                    placeholder="Price"
                                                                    counterLabel={'APL'}
                                                                    disabled
                                                                />
                                                                <button
                                                                    className={classNames({
                                                                        "btn btn-lg btn-green submit-button": true,
                                                                        'disabled': !(!!parseInt(getFormState().values.rateATM)),
                                                                    })}
                                                                >
                                                                    Buy ({this.state.code} > APL)
                                                                </button>
                                                            </form>
                                                        )
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            }
                        </>
                    )}
                </div>
            </div>
                    <div className="row">
                        <div className={`col-md-3 col-sm-4 p-0 mb-3`}>
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
                        <div className={`col-md-9 col-sm-8 p-0`}>
                            {(window.innerWidth > 767 || isGoBack) && (
                                <>
                                    {
                                        this.state.currency &&
                                        <div className="row">
                                            <div className="col-md-12 p-0">
                                                <div className="row">
                                                    <div className="col-md-6 display-flex pr-0 mb-3">
                                                        <div className={'card h-auto'}>
                                                            <div className="card-title">
                                                                Offers to sell {this.state.code}
                                                            </div>
                                                            <div className="card-body h-auto">
                                                                <CustomTable
                                                                    header={[
                                                                        {
                                                                            name: 'Account',
                                                                            alignRight: false
                                                                        }, {
                                                                            name: 'Units',
                                                                            alignRight: true
                                                                        }, {
                                                                            name: 'Limit',
                                                                            alignRight: true
                                                                        }, {
                                                                            name: 'Rate',
                                                                            alignRight: true
                                                                        }
                                                                    ]}
                                                                    className={'p-0'}
                                                                    emptyMessage={'No open sell offers. You cannot sell this currency now, but you can publish an exchange offer instead, and wait for others to fill it.'}
                                                                    TableRowComponent={OfferItem}
                                                                    tableData={this.state.sellOffers}
                                                                    passProps={{decimals: this.state.currencyInfo.decimals}}
                                                                    isPaginate
                                                                    itemsPerPage={itemsPerPage}
                                                                    page={this.state.pagination.sellOffers.page}
                                                                    previousHendler={() => this.onPaginate('sellOffers', this.state.pagination.sellOffers.page - 1)}
                                                                    nextHendler={() => this.onPaginate('sellOffers', this.state.pagination.sellOffers.page + 1)}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6 display-flex pr-0 mb-3">
                                                        <div className={'card h-auto'}>
                                                            <div className="card-title">
                                                                Offers to buy {this.state.code}
                                                            </div>
                                                            <div className="card-body h-auto">
                                                                <CustomTable
                                                                    header={[
                                                                        {
                                                                            name: 'Account',
                                                                            alignRight: false
                                                                        }, {
                                                                            name: 'Units',
                                                                            alignRight: true
                                                                        }, {
                                                                            name: 'Limit',
                                                                            alignRight: true
                                                                        }, {
                                                                            name: 'Rate',
                                                                            alignRight: true
                                                                        }
                                                                    ]}
                                                                    className={'p-0'}
                                                                    emptyMessage={'No open buy offers. You cannot sell this currency now, but you can publish an exchange offer instead, and wait for others to fill it.'}
                                                                    TableRowComponent={OfferItem}
                                                                    tableData={this.state.buyOffers}
                                                                    passProps={{decimals: this.state.currencyInfo.decimals}}
                                                                    isPaginate
                                                                    itemsPerPage={itemsPerPage}
                                                                    page={this.state.pagination.buyOffers.page}
                                                                    previousHendler={() => this.onPaginate('buyOffers', this.state.pagination.buyOffers.page - 1)}
                                                                    nextHendler={() => this.onPaginate('buyOffers', this.state.pagination.buyOffers.page + 1)}
                                                                />
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
                                                        <CustomTable
                                                            header={[
                                                                {
                                                                    name: 'Height',
                                                                    alignRight: false
                                                                }, {
                                                                    name: 'Type',
                                                                    alignRight: false
                                                                }, {
                                                                    name: 'Units',
                                                                    alignRight: true
                                                                }, {
                                                                    name: 'Rate',
                                                                    alignRight: true
                                                                }, {
                                                                    name: 'Total',
                                                                    alignRight: true
                                                                }
                                                            ]}
                                                            className={'p-0'}
                                                            emptyMessage={'No exchange requests found.'}
                                                            TableRowComponent={ExchangeItem}
                                                            tableData={this.state.exchangeRequest}
                                                            passProps={{
                                                                decimals: this.state.currencyInfo.decimals,
                                                                setBlockInfo: this.getBlock
                                                            }}
                                                            isPaginate
                                                            itemsPerPage={itemsPerPage}
                                                            page={this.state.pagination.exchangeRequest.page}
                                                            previousHendler={() => this.onPaginate('exchangeRequest', this.state.pagination.exchangeRequest.page - 1)}
                                                            nextHendler={() => this.onPaginate('exchangeRequest', this.state.pagination.exchangeRequest.page + 1)}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-md-12 pr-0 pb-3">
                                                <div className={'card h-auto'}>
                                                    <div className="card-title">
                                                        Executed exchanges
                                                    </div>
                                                    <div className="card-body h-auto">
                                                        <CustomTable
                                                            header={[
                                                                {
                                                                    name: 'Date',
                                                                    alignRight: false
                                                                }, {
                                                                    name: 'Seller',
                                                                    alignRight: false
                                                                }, {
                                                                    name: 'Buyer',
                                                                    alignRight: false
                                                                }, {
                                                                    name: 'Units',
                                                                    alignRight: true
                                                                }, {
                                                                    name: 'Rate',
                                                                    alignRight: true
                                                                }, {
                                                                    name: 'Total',
                                                                    alignRight: true
                                                                }
                                                            ]}
                                                            className={'p-0'}
                                                            emptyMessage={'No executed exchanges found.'}
                                                            TableRowComponent={ExecutedItem}
                                                            tableData={this.state.executedExchanges}
                                                            passProps={{
                                                                decimals: this.state.currencyInfo.decimals,
                                                                setTransactionInfo: this.getTransaction
                                                            }}
                                                            isPaginate
                                                            itemsPerPage={itemsPerPage}
                                                            page={this.state.pagination.executedExchanges.page}
                                                            previousHendler={() => this.onPaginate('executedExchanges', this.state.pagination.executedExchanges.page - 1)}
                                                            nextHendler={() => this.onPaginate('executedExchanges', this.state.pagination.executedExchanges.page + 1)}
                                                        />
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

    getBuyOffers: reqParams => dispatch(getBuyOffersAction(reqParams)),
    getSellOffers: reqParams => dispatch(getSellOffersAction(reqParams)),
    getAccountExchanges: reqParams => dispatch(getAccountExchangeAction(reqParams)),
    getExchanges: reqParams => dispatch(getExchangesAction(reqParams)),

    setBodyModalParamsAction: (type, data, valueForModal) => dispatch(setBodyModalParamsAction(type, data, valueForModal)),
    getCurrencyAction: (reqParams) => dispatch(getCurrencyAction(reqParams)),
    getAllCurrenciesAction: (reqParams) => dispatch(getAllCurrenciesAction(reqParams)),
    getBlockAction: (requestParams) => dispatch(getBlockAction(requestParams)),
    getTransactionAction: (data) => dispatch(getTransactionAction(data)),
    saveSendModalState: (Params) => dispatch(saveSendModalState(Params)),
    openPrevModal: () => dispatch(openPrevModal()),
});

export default connect(mapStateToProps, mapDispatchToProps)(ExchangeBooth);
