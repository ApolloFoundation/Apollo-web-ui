/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import { connect } from 'react-redux';
import React from 'react';
import {Form} from 'react-form';
import {NotificationManager} from 'react-notifications';
import AccountRS from '../../components/account-rs';
import InfoBox from '../../components/info-box';
import LogoImg from '../../../assets/logo.png';
import {getCoins, getFaucetAccountInfoAction} from '../../../actions/faucet';
import config from "../../../config";
import './style.scss'

class Faucet extends React.Component {
    state = {
        form: null,
        account: null,
    };

    componentDidMount() {
        this.getAccountInfoAction();
    }

    getAccountInfoAction = async () => {
        const account = await this.props.getFaucetAccountInfoAction({
            account: 'APL-TYSU-V4Z9-VWDY-7X95C',
        });

        if (account) {
            this.setState({account});
        }
    };

    enterAccount = async (values) => {
        if (!values.accountRS || values.accountRS.length === 0) {
            NotificationManager.error('Account ID is required.', 'Error', 5000);
            return;
        }

        const result = await this.props.getCoins({
            address: values.accountRS
        });
        if (result) {
            if (result.success) {
                NotificationManager.success('Success! Sent 30,000 APL to your address', null, 5000);
                this.state.form.resetAll();
            } else {
                NotificationManager.error(result.message, 'Error', 5000);
            }
        }
    };

    getFormApi = (form) => {
        this.setState({
            form
        })
    };

    render() {
        const {account} = this.state;
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
                                                Math.round(account.unconfirmedBalanceATM / this.props.decimals).toLocaleString('en')
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
                                            <Form
                                                getApi={this.getFormApi}
                                                onSubmit={(values) => this.enterAccount(values)}
                                                render={({
                                                             submitForm, setValue, values
                                                         }) => (
                                                    <form
                                                        onSubmit={submitForm}
                                                        className="tab-body mt-4 active">
                                                        <InfoBox className={'green-text'} transparent>
                                                            Get free 30,000 APL every 60 minutes
                                                        </InfoBox>
                                                        <div className="input-group-app user">
                                                            <div>
                                                                <label htmlFor="recipient">
                                                                    Enter your testnet account address
                                                                </label>
                                                                <div>
                                                                    <div className="iconned-input-field">
                                                                        <AccountRS
                                                                            field={'accountRS'}
                                                                            setValue={setValue}
                                                                            placeholder={'Account ID'}
                                                                            defaultValue={values.accountRS || ''}
                                                                            value={values.accountRS}
                                                                        />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <button
                                                            type="submit"
                                                            name={'closeModal'}
                                                            className="btn"
                                                        >
                                                            Get testnet APL
                                                        </button>
                                                    </form>
                                                )}
                                            />
                                        </div>
                                    </div>
                                    <div
                                        className={'button-block'}
                                        onClick={() => this.props.history.push('/login')}
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
}

const mapStateToProps = state => ({
  decimals: state.account.decimals,
});

const mapDipatchToProps = dispatch => ({
    getCoins: (requestParams) => dispatch(getCoins(requestParams)),
    getFaucetAccountInfoAction: (account) => dispatch(getFaucetAccountInfoAction(account)),
});

export default connect(mapStateToProps, mapDipatchToProps)(Faucet);
