/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import { connect } from 'react-redux';
import React from 'react';
import {NotificationManager} from "react-notifications";
import { getAccountDataAction, getAccountDataBySecretPhrasseAction } from '../../../actions/login';
import {setBodyModalParamsAction} from "../../../modules/modals";
import AccountRS from '../../components/account-rs';
import {Form} from "react-form";
import {getConstantsAction} from '../../../actions/login'
import InfoBox from "../../components/info-box";

import LogoImg from '../../../assets/logo.png';
import './style.scss'

class Faucet extends React.Component {
    componentDidMount () {
        this.props.getConstantsAction();
    }

    enterAccount = (values) => {
        if (!values.accountRS || values.accountRS.length === 0) {
            NotificationManager.error('Account ID is required.', 'Error', 5000);
            return;
        }

        // this.props.getAccountAction({
        //     account: values.accountRS
        // });
    };

    render() {
        return (
            <div className="page-content">
                <div className="page-body container-fluid">
                    <div className="faucet">
                        <div className="login-wrap">
                            <div className={'left-section'}>
                                <img className={'logo'} src={LogoImg} alt={'Apollo'}/>
                                <div className={'flex-column'}>
                                    <p className={'title'}>Testnet account</p>
                                    <p className={'sub-title'}>APL-NZKH-MZRE-2CTT-98NPZ<br/>Balance: 2,523,574 APL</p>
                                </div>
                            </div>
                            <div className={'right-section'}>
                                    <div className={'h-100 d-flex flex-column justify-content-between'}>
                                        <div className={'dark-card login-form'}>
                                            <p className={'title'}>Testnet Faucet</p>
                                            <div className="form-tabulator">
                                                    <Form
                                                        onSubmit={(values) => this.enterAccount(values)}
                                                        render={({
                                                                     submitForm, setValue
                                                                 }) => (
                                                            <form
                                                                onSubmit={submitForm}
                                                                className="tab-body mt-4 active">
                                                                <InfoBox className={'green-text'} transparent>
                                                                    Get free Apollo (APL) every 240 minutes
                                                                </InfoBox>
                                                                <div className="input-group-app user">
                                                                    <div>
                                                                        <label htmlFor="recipient">
                                                                            Enter your testnet account address
                                                                        </label>
                                                                        <div>
                                                                            <div className="iconned-input-field">
                                                                                <AccountRS
                                                                                    value={''}
                                                                                    field={'accountRS'}
                                                                                    setValue={setValue}
                                                                                    placeholder={'Account ID'}
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

const mapStateToProps = state =>  ({
    account: state.account,
    appState: state.account.blockchainStatus
});

const mapDipatchToProps = dispatch => {
    return {
        getAccountAction: (requestParams) => dispatch(getAccountDataAction(requestParams)),
        getAccountDataBySecretPhrasseAction: (requestParams) => dispatch(getAccountDataBySecretPhrasseAction(requestParams)),
        setBodyModalParamsAction: (type, data, valueForModal) => dispatch(setBodyModalParamsAction(type, data, valueForModal)),
        getConstantsAction: () => dispatch(getConstantsAction()),
    };
};

export default connect(
    mapStateToProps,
    mapDipatchToProps
)(Faucet);