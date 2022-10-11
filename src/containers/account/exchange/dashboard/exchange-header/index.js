import React from 'react';
import classNames from "classnames";
import {NotificationManager} from "react-notifications";
import BtcIcon from '../../../../../assets/BTC.png';
import EthIcon from '../../../../../assets/ETH.png';
import PaxIcon from '../../../../../assets/PAX.png';

const currencyIcons = {btc: BtcIcon, eth: EthIcon, pax: PaxIcon};

const ExchangeHeader = ({currencies, currentCurrency, switchCurrency, wallet, handleLoginModal}) => (
    <div className='btn-light-box'>
        {currencies && currencies.map(item => {
            const currency = item.toUpperCase();
            return (
                <button
                    key={item}
                    type='button'
                    className={classNames({
                        "btn-light primary d-inline-block ml-3 mt-0" : true,
                        "active" : item === currentCurrency.currency,
                    })}
                    onClick={() => {
                        if (item === 'btc') {
                            NotificationManager.error('This functionality will be delivered in 2019.', 'Error', 5000);
                        } else {
                            switchCurrency(item);
                            if (!wallet) {
                                handleLoginModal();
                            }
                        }
                    }}
                >
                    <img src={currencyIcons[item]} alt={currency}/> {currency}
                </button>
            )
        })}
    </div>
);

export default ExchangeHeader;