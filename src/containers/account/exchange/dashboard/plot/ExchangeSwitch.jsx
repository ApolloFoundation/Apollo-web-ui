import React, { useCallback, useState } from 'react';
import { NotificationManager } from 'react-notifications';
import BtcIcon from 'assets/BTC.png';
import EthIcon from 'assets/ETH.png';
import PaxIcon from 'assets/PAX.png';

const currencyIcons = {
  btc: BtcIcon, eth: EthIcon, pax: PaxIcon,
};

export default function ExchangeSwitch({
  currency, currencies, switchCurrency, wallet, handleLoginModal, ticker,
}) {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpenSwitch = useCallback(() => {
    setIsOpen(!isOpen);
  }, [isOpen]);

  return (
    <div className="currency-switch-wrap">
      <p className="title-lg">
        {ticker}
        /
        {currency.toUpperCase()}
        <div
          className="currency-switch"
          onClick={handleOpenSwitch}
        >
          <i className="zmdi zmdi-unfold-more" />
        </div>
      </p>
      <div className={`currency-switch-dropdown ${isOpen ? 'open' : ''}`}>
        {currencies && currencies.map(item => {
          const currentCurrency = item.toUpperCase();
          return (
            <div
              className="dropdown-item"
              onClick={() => {
                if (item === 'btc') {
                  NotificationManager.error('This functionality will be delivered in 2019.', 'Error', 5000);
                } else {
                  handleOpenSwitch();
                  switchCurrency(item);
                  if (!wallet) {
                    handleLoginModal();
                  }
                }
              }}
            >
              <img src={currencyIcons[item]} alt={currentCurrency} />
              {' '}
              {currentCurrency}
            </div>
          );
        })}
      </div>
    </div>
  );
}
