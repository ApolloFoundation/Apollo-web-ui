import React from 'react';
import BtcIcon from '../../../../assets/BTC.png';
import EthIcon from '../../../../assets/ETH.png';
import PaxIcon from '../../../../assets/PAX.png';

const ExchangeHeader = () => (
    <div className={'row'}>
        <div className={'pb-4'}>
            <div className={'btn-light-box'}>
                <button
                    type={'button'}
                    className={'btn-light primary d-inline-block mt-0'}
                >
                    <img src={BtcIcon} alt="BTH"/> BTC
                </button>
                <button
                    type={'button'}
                    className={'btn-light primary ml-3 d-inline-block mt-0 active'}
                >
                    <img src={EthIcon} alt="ETH"/> ETH
                </button>
                <button
                    type={'button'}
                    className={'btn-light primary ml-3 d-inline-block mt-0'}
                >
                    <img src={PaxIcon} alt="PAX"/> PAX
                </button>
            </div>
        </div>
    </div>
);

export default ExchangeHeader;