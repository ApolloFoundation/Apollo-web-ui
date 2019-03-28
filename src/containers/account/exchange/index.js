import React from 'react';
import SiteHeader from '../../components/site-header';
import {connect} from 'react-redux';

import ExchangeHeader from './exchange-header';
import ExchangeBuy from './exchange-buy';
import ExchangeSell from './exchange-sell';
import SellOrders from './sell-orders';
import BuyOrders from './buy-orders';
import Plot from './plot';
import TradeHistoryEchanger from './trade-history';
import OpenOrders from './open-orders';

class Exchanger extends React.Component {

    render () {
        return (
            <div className="page-content">
                <SiteHeader
                    pageTitle={'Decentralized Exchange'}
                />
                <div className="exchanger page-body container-fluid pl-0">
                    <div className={'row'}>
                        <div className={'col-md-12 pr-0'}>
                            <ExchangeHeader />
                        </div>
                        <div className={'col-md-4 pr-0'}>
                            <BuyOrders />
                        </div>
                        <div className={'col-md-8 pr-0 pb-3'}>
                            <Plot/>
                        </div>
                        <div className={'col-md-4 pr-0'}>
                            <SellOrders />
                        </div>
                        <div className={'col-md-8 p-0'}>
                            <div className={'container-fluid p-0'}>
                                <div className={'col-md-6 pl-3 pr-0 pb-3 d-inline-flex'}>
                                    <ExchangeBuy/>
                                </div>
                                <div className={'col-md-6 pl-3 pr-0 pb-3 d-inline-flex'}>
                                    <ExchangeSell/>
                                </div>
                            </div>
                        </div>
                        <div className={'col-md-6 mb-3 pr-0'}>
                            <TradeHistoryEchanger />
                        </div>
                        <div className={'col-md-6 mb-3 pr-0'}>
                            <OpenOrders />
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default connect()(Exchanger)