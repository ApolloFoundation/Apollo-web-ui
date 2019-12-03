import React from 'react';

import BtcIcon from '../../../../../assets/BTC.png';
import EthIcon from '../../../../../assets/ETH.png';
import PaxIcon from '../../../../../assets/PAX.png';
import {NotificationManager} from "react-notifications";

const currencyIcons = {btc: BtcIcon, eth: EthIcon, pax: PaxIcon};

export default class ExchangeSwitch extends React.Component {
    state = {
        isOpen: false,
    };

    handleOpenSwitch = () => {
        this.setState((state) => ({isOpen: !state.isOpen}));
    };

    render() {
        const {currency, currencies, switchCurrency, wallet, handleLoginModal} = this.props;
        return (
            <div className={'currency-switch-wrap chart-currency'}>
                {/* <img src={EthIcon} alt="ETH"/> */}
                <p className={'title-lg'}>
                    {currency.toUpperCase()}
                    <div
                        className={'currency-switch'}
                        onClick={this.handleOpenSwitch}
                    >
                        <i className="zmdi zmdi-unfold-more"/>
                    </div>
                </p>
                    <div className={`currency-switch-dropdown ${this.state.isOpen ? 'open' : ''}`}>
                        {currencies && currencies.map(item => {
                            const currency = item.toUpperCase();
                            return (
                                <div
                                    className={'dropdown-item'}
                                    onClick={() => {
                                        if (item === 'btc') {
                                            NotificationManager.error('This functionality will be delivered in 2019.', 'Error', 5000);
                                        } else {
                                            this.handleOpenSwitch();
                                            switchCurrency(item);
                                            if (!wallet) {
                                                handleLoginModal();
                                            }
                                        }
                                    }}
                                >
                                    <img src={currencyIcons[item]} alt={currency}/> {currency}
                                </div>
                            )
                        })}
                    </div>
            </div>
        );
    }
};
