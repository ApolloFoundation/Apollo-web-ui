/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React from 'react';
import SiteHeader from 'containers/components/site-header'
import { OrderSell } from './order-sell';
import { OrderBuy } from './order-buy';

const OpenOrders = () => (
    <div className="page-content">
        <SiteHeader pageTitle='Open orders' />
        <div className="page-body container-fluid mb-3">
            <div className="row">
                <div className="col-md-6 pr-0 pl-0">
                    <div className='card full-height'>
                        <div className="card-title">Sell Orders</div>
                        <div className="card-body">
                            <OrderSell />
                        </div>
                    </div>
                </div>
                <div className="col-md-6 pr-0">
                    <div className='card full-height'>
                        <div className="card-title">Buy Orders</div>
                        <div className="card-body">
                            <OrderBuy />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

export default OpenOrders;