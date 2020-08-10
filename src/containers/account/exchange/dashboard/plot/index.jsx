import React from 'react';
import TradingView from '../trading-view';
import ExchangeSwitch from './ExchangeSwitch';

export default function Plot(props) {
  const {
    currentCurrency: { currency }, currencies, switchCurrency, wallet, handleLoginModal,
  } = props;

  return (
    <div className="card-block primary card card-medium pt-0 h-400">
      <div className="form-group-app overflow-hidden h-100">
        <div className="form-title form-title-lg d-flex flex-row justify-content-between align-items-center">
          <div className="d-flex align-items-center mr-2">
            <ExchangeSwitch
              currency={currency}
              currencies={currencies}
              switchCurrency={switchCurrency}
              wallet={wallet}
              handleLoginModal={handleLoginModal}
            />
          </div>
        </div>
        <div className="card-content">
          <div className="full-box overflow-hidden chart">
            <TradingView />
          </div>
        </div>
      </div>
    </div>
  );
}
