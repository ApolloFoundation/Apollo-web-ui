import React from 'react';
import {NotificationManager} from "react-notifications";

const ExchangeHeader = ({currencies, currentCurrency, setCurrentCurrency}) => (
    <div className={'row'}>
        <div className={'pb-4'}>
            <div className={'btn-light-box'}>
                {currencies && currencies.map(item => {
                    const currency = item.toUpperCase();
                    return (
                        <button
                            type={'button'}
                            className={`btn-light primary d-inline-block ml-3 mt-0 ${item === currentCurrency.currency ? 'active' : ''}`}
                            onClick={() => {
                                if (item === 'btc') {
                                    NotificationManager.error('This functionality will be delivered in April 2019.', 'Error', 5000);
                                } else {
                                    setCurrentCurrency(item);
                                }
                            }}
                        >
                            <img src={require(`../../../../assets/${currency}.png`)} alt={currency}/> {currency}
                        </button>
                    )
                })}
            </div>
        </div>
    </div>
);

export default ExchangeHeader;