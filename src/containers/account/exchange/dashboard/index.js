import React from 'react';
import {connect} from 'react-redux';
import SiteHeader from '../../../components/site-header';
import InfoBox from '../../../components/info-box';

import ExchangeHeader from './exchange-header';
import ExchangeBuy from './exchange-buy';
import ExchangeSell from './exchange-sell';
import SellOrders from './sell-orders';
import BuyOrders from './buy-orders';
import Plot from './plot';
import TradeHistoryExchange from './trade-history';
import OpenOrders from './open-orders';
import {setCurrentCurrencyAction} from "../../../../modules/exchange";
import {setBodyModalParamsAction} from "../../../../modules/modals";
import {getCurrencyBalance, getBuyOpenOffers, getSellOpenOffers, getPlotBuyOpenOffers, getPlotSellOpenOffers, getMyOpenOffers} from "../../../../actions/wallet";

class Exchange extends React.Component {
    state = {
        wallets: null
    };

    componentDidMount() {
        let wallets = localStorage.getItem('wallets');
        if (!wallets) {
            this.handleLoginModal();
        } else {
            this.getCurrencyBalance(JSON.parse(wallets));
        }
        this.props.getBuyOpenOffers();
        this.props.getSellOpenOffers();
        this.props.getPlotBuyOpenOffers();
        this.props.getPlotSellOpenOffers();
        this.props.getMyOpenOffers();
    }

    componentDidUpdate() {
        if (!this.state.wallets && this.props.wallets) {
            this.getCurrencyBalance(this.props.wallets);
        }
    }

    getCurrencyBalance = async (wallets) => {
        let params = {};
        wallets.map(wallet => {
            params[wallet.currency] = [];
            wallet.wallets.map(walletItem => {
                params[wallet.currency].push(walletItem.address);
                return walletItem;
            });
            return wallet;
        });
        const walletsBalances = await this.props.getCurrencyBalance(params);
        if (walletsBalances) {
            this.setState({wallets: walletsBalances});
        }
    };

    handleLoginModal = () => {
        this.props.setBodyModalParamsAction('LOGIN_EXCHANGE', {});
    };

    switchCurrency = (currency) => {
        this.props.getBuyOpenOffers(currency);
        this.props.getSellOpenOffers(currency);
        this.props.getPlotBuyOpenOffers(currency);
        this.props.getPlotSellOpenOffers(currency);
        this.props.getMyOpenOffers(currency);
        this.props.setCurrentCurrency(currency);
    };

    render () {
        const {currencies, currentCurrency, buyOrders, sellOrders, plotBuyOrders, plotSellOrders, myOrders} = this.props;
        const wallet = this.state.wallets && this.state.wallets['eth'];
        const buyOrdersCurrency = buyOrders[currentCurrency.currency];
        const sellOrdersCurrency = sellOrders[currentCurrency.currency];
        const plotBuyOrdersCurrency = plotBuyOrders[currentCurrency.currency];
        const plotSellOrdersCurrency = plotSellOrders[currentCurrency.currency];
        return (
            <div className="page-content">
                <SiteHeader
                    pageTitle={'Decentralized Exchange'}
                />
                <div className="exchange page-body container-fluid pl-0">
                    <div className={'row'}>
                        <div className={'col-md-12 pr-0 pb-3'}>
                            <InfoBox info>
                                Please, notice - this is the first version on Apollo Exchange. Functionality of trading will be delivered in future release. At the moment you can deposit in ETH and PAX.
                                Please, check our updates in the official <a href={'https://t.me/apolloofficialannouncements'} target='_blank' rel='noopener noreferrer'>Telegram channel</a> to be the first to use Apollo Exchange
                            </InfoBox>
                        </div>
                        <div className={'col-md-12 pr-0 pb-3 pb-4'}>
                            <ExchangeHeader
                                currencies={currencies}
                                currentCurrency={currentCurrency}
                                switchCurrency={this.switchCurrency}
                                wallet={wallet}
                                handleLoginModal={this.handleLoginModal}
                            />
                        </div>
                        <div className={'col-md-4 pr-0 pb-3'}>
                            <BuyOrders currentCurrency={currentCurrency} buyOrders={buyOrdersCurrency} />
                        </div>
                        <div className={'col-md-8 pr-0 pb-3'}>
                            <Plot
                                currentCurrency={currentCurrency}
                                buyOrders={plotBuyOrdersCurrency}
                                sellOrders={plotSellOrdersCurrency}
                            />
                        </div>
                        <div className={'col-md-4 pr-0 pb-3'}>
                            <SellOrders currentCurrency={currentCurrency} sellOrders={sellOrdersCurrency} />
                        </div>
                        <div className={'col-md-8 p-0'}>
                            <div className={'container-fluid p-0 h-100'}>
                                <div className={'col-md-6 pl-3 pr-0 pb-3 d-inline-flex h-100'}>
                                    <ExchangeBuy
                                        currentCurrency={currentCurrency}
                                        wallet={wallet}
                                        handleLoginModal={this.handleLoginModal}
                                    />
                                </div>
                                <div className={'col-md-6 pl-3 pr-0 pb-3 d-inline-flex h-100'}>
                                    <ExchangeSell
                                        currentCurrency={currentCurrency}
                                        wallet={wallet}
                                        handleLoginModal={this.handleLoginModal}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className={'col-md-6 mb-3 pr-0'}>
                            <TradeHistoryExchange
                                currentCurrency={currentCurrency}
                                wallet={wallet}
                                handleLoginModal={this.handleLoginModal}
                            />
                        </div>
                        <div className={'col-md-6 mb-3 pr-0'}>
                            <OpenOrders
                                currentCurrency={currentCurrency}
                                handleLoginModal={this.handleLoginModal}
                                myOrders={myOrders[currentCurrency.currency]}
                            />
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = ({exchange, account}) => ({
    wallets: account.wallets,
    currencies: exchange.currencies,
    currentCurrency: exchange.currentCurrency,
    buyOrders: exchange.buyOrders,
    sellOrders: exchange.sellOrders,
    plotBuyOrders: exchange.plotBuyOrders,
    plotSellOrders: exchange.plotSellOrders,
    myOrders: exchange.myOrders,
});

const mapDispatchToProps = dispatch => ({
    setCurrentCurrency: (currency) => dispatch(setCurrentCurrencyAction(currency)),
    getCurrencyBalance: (params) => dispatch(getCurrencyBalance(params)),
    setBodyModalParamsAction: (type, value) => dispatch(setBodyModalParamsAction(type, value)),
    getBuyOpenOffers: (currency) => dispatch(getBuyOpenOffers(currency)),
    getSellOpenOffers: (currency) => dispatch(getSellOpenOffers(currency)),
    getPlotBuyOpenOffers: (currency) => dispatch(getPlotBuyOpenOffers(currency)),
    getPlotSellOpenOffers: (currency) => dispatch(getPlotSellOpenOffers(currency)),
    getMyOpenOffers: (currency) => dispatch(getMyOpenOffers(currency)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Exchange)