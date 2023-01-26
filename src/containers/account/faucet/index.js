/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import { useDispatch, useSelector } from 'react-redux';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import LogoImg from 'assets/logo.png';
import { getFaucetAccountInfoAction } from 'actions/faucet';
import config from "config";
import { getDecimalsSelector } from 'selectors';
import { FaucetForm } from './Form';
import './style.scss'

const Faucet = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    const [account, setAccount] = useState();
    const decimals = useSelector(getDecimalsSelector);
    const getAccountInfoAction = async () => {
        const account = await dispatch(getFaucetAccountInfoAction({
            account: 'APL-TYSU-V4Z9-VWDY-7X95C',
        }));

        if (account) {
            setAccount(account);
        }
    };

    useEffect(() => {
        getAccountInfoAction();
    }, []);

        return (
            <div className="page-content">
                <div className="page-body container-fluid">
                    <div className="faucet">
                        <div className="login-wrap">
                            <div className={'left-section'}>
                                <img className={'logo'} src={LogoImg} alt={'Apollo'}/>
                                {account && (
                                    <div className={'flex-column'}>
                                        <p className={'title'}>Testnet account</p>
                                        <p className={'sub-title'}>
                                            {account.accountRS}<br/>
                                            Balance: {account.unconfirmedBalanceATM ? (
                                                Math.round(account.unconfirmedBalanceATM / decimals).toLocaleString('en')
                                            ) : (
                                                '0'
                                            )} APL
                                        </p>
                                    </div>
                                )}
                                <div className={'flex-column text-section'}>
                                    <p>
                                        Now you’re looking at Apollo test Faucet.
                                        You can get test APL to use them in Apollo testnet&nbsp;1.
                                        Apollo testnet&nbsp;1 is a test network where you can check Apollo Wallet and Apollo API features.
                                    </p>
                                    <p>
                                        Please, note that it’s not possible to use testnet APL in the Apollo mainnet.
                                    </p>
                                    <p>
                                        Apollo testnet&nbsp;1 is available by the following link:<br/><a href={config.api.faucetUrl} target="_blank" rel="noopener noreferrer">{config.api.faucetUrl}</a>
                                    </p>
                                </div>
                            </div>
                            <div className={'right-section'}>
                                <div className={'h-100 d-flex flex-column justify-content-between'}>
                                    <div className={'dark-card login-form'}>
                                        <p className={'title'}>Testnet Faucet</p>
                                        <div className="form-tabulator">
                                            <FaucetForm />
                                        </div>
                                    </div>
                                    <div
                                        className={'button-block'}
                                        onClick={() => history.push('/login')}
                                    >
                                        <span className={'title'}>Log in</span>
                                        <span className={'sub-title'}>or create Apollo Wallet</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
}

export default Faucet;
