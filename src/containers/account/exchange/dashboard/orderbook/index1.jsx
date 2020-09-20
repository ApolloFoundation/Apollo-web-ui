import React, { useState } from 'react';
import BuyOrders from './BuyOrders.jsx';
import SellOrders from './SellOrders.jsx';

export default function Orderbook(props) {
  const {
    currentCurrency, buyOrders, sellOrders, ticker,
  } = props;

  const [actionType, setActionType] = useState(0);

  return (
    <div className="card card-light h-100">
      <div className="card-title">
        <div className="title">Orderbook</div>
      </div>
      <div className="card-body">
        <div className="tabs-wrap tabs-primary mb-3">
          <div
            className={`tab-item ${actionType === 0 ? 'active' : ''}`}
            onClick={() => setActionType(0)}
          >
            All
          </div>
          <div
            className={`tab-item ${actionType === 1 ? 'active' : ''}`}
            onClick={() => setActionType(1)}
          >
            Buy Orders
          </div>
          <div
            className={`tab-item ${actionType === 2 ? 'active' : ''}`}
            onClick={() => setActionType(2)}
          >
            Sell Orders
          </div>
        </div>
        {(actionType === 0 || actionType === 2) && (
        <SellOrders
          currentCurrency={currentCurrency}
          sellOrders={sellOrders}
          ticker={ticker}
        />
        )}
        {(actionType === 0 || actionType === 1) && (
          <BuyOrders
            currentCurrency={currentCurrency}
            buyOrders={buyOrders}
            ticker={ticker}
          />
        )}
      </div>
    </div>
  );
}
