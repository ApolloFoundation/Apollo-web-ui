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
import {setBodyModalParamsAction} from "../../../modules/modals";
import {getCurrencyBalance} from "../../../actions/wallet";

class Exchanger extends React.Component {
    state = {
        wallets: null
    };

    componentDidMount() {
        let wallets = JSON.parse(localStorage.getItem('wallets'));
        if (!wallets) {
            this.props.setBodyModalParamsAction('LOGIN_EXCHANGE', {});
        } else {
            this.getCurrencyBalance(JSON.parse(wallets));
        }
    }

    componentDidUpdate() {
        if (!this.state.wallets && this.props.wallets) {
            this.getCurrencyBalance(this.props.wallets);
        }
    }

    getCurrencyBalance = async (wallets) => {
        let params = {};
        wallets.map(wallet => params[wallet.currency] = wallet.wallets[0].address);
        const balances = await this.props.getCurrencyBalance(params);
        if (balances) {
            wallets.map(wallet => wallet.wallets[0].balance = balances[`balance${wallet.currency.toUpperCase()}`]);
        }
        this.setState({wallets});
    };

    render () {
        const {currencies, currentCurrency} = this.props;
        const wallet = this.state.wallets && this.state.wallets.filter(wallet => wallet.currency === currentCurrency.currency)[0];
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
                                currencies={currencies}
                                currentCurrency={currentCurrency}
                                setCurrentCurrency={this.props.setCurrentCurrency}
                            />
                        </div>
                        <div className={'col-md-4 pr-0'}>
                            <BuyOrders currentCurrency={currentCurrency} />
                        </div>
                        <div className={'col-md-8 pr-0 pb-3'}>
                            <Plot currentCurrency={currentCurrency}/>
                        </div>
                        <div className={'col-md-4 pr-0'}>
                            <SellOrders currentCurrency={currentCurrency} />
                        </div>
                        <div className={'col-md-8 p-0'}>
                            <div className={'container-fluid p-0'}>
                                <div className={'col-md-6 pl-3 pr-0 pb-3 d-inline-flex'}>
                                    <ExchangeBuy currentCurrency={currentCurrency} wallet={wallet}/>
                                </div>
                                <div className={'col-md-6 pl-3 pr-0 pb-3 d-inline-flex'}>
                                    <ExchangeSell currentCurrency={currentCurrency} wallet={wallet}/>
                                </div>
                            </div>
                        </div>
                        <div className={'col-md-6 mb-3 pr-0'}>
                            <TradeHistoryEchanger currentCurrency={currentCurrency} />
                        </div>
                        <div className={'col-md-6 mb-3 pr-0'}>
                            <OpenOrders currentCurrency={currentCurrency} />
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
});

const mapDispatchToProps = dispatch => ({
    setCurrentCurrency: (currency) => dispatch(setCurrentCurrencyAction(currency)),
    getCurrencyBalance: (params) => dispatch(getCurrencyBalance(params)),
    setBodyModalParamsAction: (type, value) => dispatch(setBodyModalParamsAction(type, value)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Exchanger)