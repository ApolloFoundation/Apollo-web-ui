/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React, { useEffect, useCallback } from 'react';
import {connect, useDispatch} from 'react-redux';
import {Form} from 'react-form';
import { useRouteMatch } from 'react-router-dom';
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
// Forms
import BuyForm from './buy-form';
import SellForm from './sell-form';
// Tables
import OffersToBuyTable from './tables/offers-to-buy-table';
import OffersToSellTable from './tables/offers-to-sell-table';
import ExchangeRequestsTable from './tables/exchange-requests-table'
import ExecutedExcahngeTable from './tables/executed-exchange-table'

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
  const dispatch = useDispatch();

  const { account } = useSelector(state => state.account);

  const [dataCurrency, setDataCurrency] = useState(null);
  const [dataCurrencies, setDataCurrencies] = useState(null);
  const [dataAccountCurrency, setDataAccountCurrency] = useState(null);
  const [currencyInfo, setCurrencyInfo] = useState(null);

  const match = useRouteMatch();

  const getCurrencies = useCallback(async reqParams => {
    const allCurrencies = await dispatch(getAllCurrenciesAction(reqParams));

    if (allCurrencies) {
      setDataCurrencies(allCurrencies.currencies);
    }
  }, []);

  const getAccountCurrency = useCallback(async reqParams => {
    let accountCurrency = await dispatch(getCurrencyAction(reqParams));

    if (accountCurrency) {
      const newAccountCurrency = accountCurrency.accountCurrencies.find((el) =>  el.code === match.params.currency);
      setDataAccountCurrency(newAccountCurrency);
    }
  }, []);

  const getCurrency = useCallback(async currentCode => {
    const currency = await dispatch(getCurrencyAction(currentCode));

    if (currency) {
      // ! check if needed setState
      // this.setState({
      //   ...currency,
      // });
      setCurrencyInfo(currency);

      const id = currency.currency;

      getBuyOffers(id);
      getSellOffers(id);
      getAccountExchanges(id, account);
      getExchanges(id);
    }
  }, []);

  const listener = useCallback(data => {
    if (dataCurrency) {
      getAccountCurrency({
        requestType: 'getAccountCurrencies',
        account: account,
        includeCurrencyInfo: true,
        currency: dataCurrency.currency
      });
    }

    getCurrency({code: match.params.currency});
    getCurrencies();
  }, []);

  useEffect(() => {
    getAccountCurrency({
      requestType: 'getAccountCurrencies',
      account: account,
      includeCurrencyInfo: true,
      code: match.params.currency,
    });
    getCurrency({code: match.params.currency});
    getCurrencies();
  }, []);

  useEffect(() => {
    BlockUpdater.on("data", listener);

    return () => BlockUpdater.removeListener("data", listener);
  }, []);
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
                            {this.state.currency && (
                              <div className="row">
                                <BuyForm />
                                <BuyForm />
                              </div>
                            )}
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
                                    {this.state.currency && (
                                        <div className="row">
                                            <div className="col-md-12 p-0">
                                                <div className="row">
                                                  <OffersToBuyTable
                                                    balanceBuy={balanceBuy}
                                                  />
                                                  <OffersToSellTable
                                                    balanceSell={balanceSell}
                                                  />
                                                </div>
                                            </div>
                                            <ExchangeRequestsTable />
                                            <ExecutedExcahngeTable />
                                        </div>
                                    )}
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
