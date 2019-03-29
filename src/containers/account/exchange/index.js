import React from 'react';
import {connect} from 'react-redux';
import SiteHeader from '../../components/site-header';
import InfoBox from '../../components/info-box';

import ExchangeHeader from './exchange-header';
import ExchangeBuy from './exchange-buy';
import ExchangeSell from './exchange-sell';
import SellOrders from './sell-orders';
import BuyOrders from './buy-orders';
import Plot from './plot';
import TradeHistoryEchanger from './trade-history';
import OpenOrders from './open-orders';
import {setCurrentCurrencyAction} from "../../../modules/exchange";

class Exchanger extends React.Component {

    render () {
        return (
            <div className="page-content">
                <SiteHeader
                    pageTitle={'Decentralized Exchange'}
                />
                <div className="exchange page-body container-fluid pl-0">
                    <div className={'row'}>
                        <div className={'col-md-12 pr-0'}>
                            <InfoBox info>
                                Please, notice - this is the firs version on Apollo Exchange. Functionality of trading will be delivered in April 2019. At the moment you can deposit in ETH and PAX.
                                Please, check our updates in the official <a href={'https://t.me/apolloofficialannouncements'} target='_blank'>Telegram channel</a> to be the first to use Apollo Exchange
                            </InfoBox>
                        </div>
                        <div className={'col-md-12 pr-0'}>
                            <ExchangeHeader
                                currencies={this.props.currencies}
                                currentCurrency={this.props.currentCurrency}
                                setCurrentCurrency={this.props.setCurrentCurrency}
                            />
                        </div>
                        <div className={'col-md-4 pr-0'}>
                            <BuyOrders currentCurrency={this.props.currentCurrency} />
                        </div>
                        <div className={'col-md-8 pr-0 pb-3'}>
                            <Plot currentCurrency={this.props.currentCurrency}/>
                        </div>
                        <div className={'col-md-4 pr-0'}>
                            <SellOrders currentCurrency={this.props.currentCurrency} />
                        </div>
                        <div className={'col-md-8 p-0'}>
                            <div className={'container-fluid p-0'}>
                                <div className={'col-md-6 pl-3 pr-0 pb-3 d-inline-flex'}>
                                    <ExchangeBuy currentCurrency={this.props.currentCurrency}/>
                                </div>
                                <div className={'col-md-6 pl-3 pr-0 pb-3 d-inline-flex'}>
                                    <ExchangeSell currentCurrency={this.props.currentCurrency}/>
                                </div>
                            </div>
                        </div>
                        <div className={'col-md-6 mb-3 pr-0'}>
                            <TradeHistoryEchanger currentCurrency={this.props.currentCurrency} />
                        </div>
                        <div className={'col-md-6 mb-3 pr-0'}>
                            <OpenOrders currentCurrency={this.props.currentCurrency} />
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = ({exchange}) => ({
    currencies: exchange.currencies,
    currentCurrency: exchange.currentCurrency,
});

const mapDispatchToProps = dispatch => ({
    setCurrentCurrency: (currency) => dispatch(setCurrentCurrencyAction(currency)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Exchanger)