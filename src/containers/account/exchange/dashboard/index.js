// import React from 'react';
// import {connect} from 'react-redux';
// import {NotificationManager} from "react-notifications";
// import SiteHeader from '../../../components/site-header';
// import InfoBox from '../../../components/info-box';

// import ExchangeHeader from './exchange-header';
// import Plot from './plot';
// import TradeHistoryExchange from './trade-history';
// import OpenOrders from './open-orders';
// import {setCurrentCurrencyAction} from "../../../../modules/exchange";
// import {setBodyModalParamsAction, resetTrade} from "../../../../modules/modals";
// import {
//     getBuyOpenOffers,
//     getCurrencyBalance,
//     getMyOpenOffers,
//     getPlotBuyOpenOffers,
//     getPlotSellOpenOffers,
//     getSellOpenOffers,
// } from "../../../../actions/wallet";
// import Orderbook from "./orderbook";
// import TradeApollo from "./trade-apollo";
// import TwitterBanner from "../../../../assets/banner-small.png";

// class Exchange extends React.Component {
//     state = {
//         wallets: null
//     };

//     componentDidMount() {
//         NotificationManager.info('After creating an order, you should keep your node online, leaving enough funds on your account to cover the exchange fees (min 12 APL), until the exchange completes', null, 1000000);
//         let wallets = localStorage.getItem('wallets');
//         if (!wallets) {
//             this.handleLoginModal();
//         } else {
//             this.getCurrencyBalance(JSON.parse(wallets));
//         }
//         this.props.getBuyOpenOffers();
//         this.props.getSellOpenOffers();
//         this.props.getPlotBuyOpenOffers();
//         this.props.getPlotSellOpenOffers();
//         this.props.getMyOpenOffers();
//     }

//     componentDidUpdate() {
//         if (!this.state.wallets && this.props.wallets) {
//             this.getCurrencyBalance(this.props.wallets);
//         }
//     }

//     getCurrencyBalance = async (wallets) => {
//         let params = {};
//         wallets.map(wallet => {
//             params[wallet.currency] = [];
//             wallet.wallets.map(walletItem => {
//                 params[wallet.currency].push(walletItem.address);
//                 return walletItem;
//             });
//             return wallet;
//         });
//         const walletsBalances = await this.props.getCurrencyBalance(params);
//         if (walletsBalances) {
//             this.setState({wallets: walletsBalances});
//         }
//     };

//     handleLoginModal = () => {
//         this.props.setBodyModalParamsAction('LOGIN_EXCHANGE', {});
//     };

//     switchCurrency = (currency) => {
//         this.props.resetTrade();
//         this.props.setCurrentCurrency(currency);
//         this.props.getBuyOpenOffers(currency);
//         this.props.getSellOpenOffers(currency);
//         this.props.getPlotBuyOpenOffers(currency);
//         this.props.getPlotSellOpenOffers(currency);
//         this.props.getMyOpenOffers(currency);
//     };

//     render() {
//         const {currencies, currentCurrency, buyOrders, sellOrders, plotBuyOrders, plotSellOrders, myOrders} = this.props;
//         const wallet = this.state.wallets && this.state.wallets['eth'];
//         const buyOrdersCurrency = buyOrders[currentCurrency.currency];
//         const sellOrdersCurrency = sellOrders[currentCurrency.currency];
//         const plotBuyOrdersCurrency = plotBuyOrders[currentCurrency.currency];
//         const plotSellOrdersCurrency = plotSellOrders[currentCurrency.currency];

//         return (
//             <div className="page-content">
//                 <SiteHeader
//                     pageTitle={'Decentralized Exchange'}
//                 />
//                 <div className="page-body exchange">
//                     <div className={'container-fluid p-0'}>
//                         <div className={'cards-wrap row'}>
//                             <div className={'col-md-12 p-0'}>
//                                 <InfoBox info>
//                                     Welcome to the Beta version of the Apollo DEX, more functions are to follow.
//                                 </InfoBox>
//                             </div>
//                         </div>
//                         <div className={'cards-wrap row'}>
//                             <div className={'col-md-9 col-sm-7 p-0 tradingview'}>
//                                 <div className={'row'}>
//                                     <div className={'col-md-8 col-sm-12 p-0 tv-chart'}>
//                                         <Plot
//                                             currentCurrency={currentCurrency}
//                                             buyOrders={plotBuyOrdersCurrency}
//                                             sellOrders={plotSellOrdersCurrency}
//                                             currencies={currencies}
//                                             switchCurrency={this.switchCurrency}
//                                             wallet={wallet}
//                                             handleLoginModal={this.handleLoginModal}
//                                         />
//                                     </div>
//                                     <div className={'col-md-4 col-sm-12 p-0 trade'}>
//                                         <TradeApollo
//                                             currentCurrency={currentCurrency}
//                                             wallet={wallet}
//                                             handleLoginModal={this.handleLoginModal}
//                                         />
//                                     </div>
//                                     <div className={'col-md-3 col-sm-5 p-0 order-book'}>
//                                         <div className={'d-flex flex-column h-100'}>
//                                             <Orderbook
//                                                 currentCurrency={currentCurrency}
//                                                 buyOrders={buyOrdersCurrency}
//                                                 sellOrders={sellOrdersCurrency}
//                                             />
//                                         </div>
//                                     </div>
//                                 </div>
//                                 <div className={'row bottom'}>
//                                     <div className={'col-md-4 col-sm-12 p-0'}>
//                                         <TradeHistoryExchange
//                                             currentCurrency={currentCurrency}
//                                             wallet={wallet}
//                                             handleLoginModal={this.handleLoginModal}
//                                         />
//                                     </div>
//                                     <div className={'col-md-4 col-sm-6 p-0'}>
//                                         <OpenOrders
//                                             currentCurrency={currentCurrency}
//                                             handleLoginModal={this.handleLoginModal}
//                                             myOrders={myOrders[currentCurrency.currency]}
//                                         />
//                                     </div>
//                                     <div className={'col-md-4 col-sm-6 p-0'}>
//                                         <div className={'wrap-card-square'}>
//                                             <a
//                                                 href={'https://twitter.com/ApolloCurrency'}
//                                                 target="_blank"
//                                                 rel="noopener noreferrer"
//                                                 className={`card card-square`}
//                                                 style={{backgroundImage: `url(${TwitterBanner})`}}
//                                             />
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         )
//     }
// }

// const mapStateToProps = ({exchange, account}) => ({
//     wallets: account.wallets,
//     currencies: exchange.currencies,
//     currentCurrency: exchange.currentCurrency,
//     buyOrders: exchange.buyOrders,
//     sellOrders: exchange.sellOrders,
//     plotBuyOrders: exchange.plotBuyOrders,
//     plotSellOrders: exchange.plotSellOrders,
//     myOrders: exchange.myOrders,
// });

// const mapDispatchToProps = dispatch => ({
//     setCurrentCurrency: (currency) => dispatch(setCurrentCurrencyAction(currency)),
//     getCurrencyBalance: (params) => dispatch(getCurrencyBalance(params)),
//     setBodyModalParamsAction: (type, value) => dispatch(setBodyModalParamsAction(type, value)),
//     getBuyOpenOffers: (currency) => dispatch(getBuyOpenOffers(currency)),
//     getSellOpenOffers: (currency) => dispatch(getSellOpenOffers(currency)),
//     getPlotBuyOpenOffers: (currency) => dispatch(getPlotBuyOpenOffers(currency)),
//     getPlotSellOpenOffers: (currency) => dispatch(getPlotSellOpenOffers(currency)),
//     getMyOpenOffers: (currency) => dispatch(getMyOpenOffers(currency)),
//     resetTrade: () => dispatch(resetTrade()),
// });

// export default connect(mapStateToProps, mapDispatchToProps)(Exchange)
