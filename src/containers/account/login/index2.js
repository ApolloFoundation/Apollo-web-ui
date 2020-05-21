/******************************************************************************
 * Copyright © 2020 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/

import React from 'react';
import { connect } from 'react-redux';
import {Form, Text} from "react-form";
import classNames from "classnames";
import {NotificationManager} from "react-notifications";
import { getAccountDataAction, getAccountDataBySecretPhrasseAction } from '../../../actions/login';
import {setBodyModalParamsAction} from "../../../modules/modals";
import {getConstantsAction} from '../../../actions/login'
import AccountRS from '../../components/account-rs';
import InfoBox from "../../components/info-box";
import ImportAccount from "./import-account";
import CreateUser from "./create-user";

import LogoImg from '../../../assets/logo.png';
import './Login.scss'

class Login extends React.Component {
    state = {
        activeTab: 0,
        activeSection: 'LOGIN',
    };

    componentDidMount () {
        this.props.getConstantsAction();
    }

    enterAccount = (values) => {
        if (!values.accountRS || values.accountRS.length === 0) {
            NotificationManager.error('Account ID is required.', 'Error', 5000);
            return;
        }

        this.props.getAccountAction({
            account: values.accountRS
        });
    };

    enterAccountByPassphrase = (values) => {
        if (!values.secretPhrase || values.secretPhrase.length === 0) {
            NotificationManager.error('Secret Phrase is required.', 'Error', 5000);
            return;
        }

        this.props.getAccountDataBySecretPhrasseAction({
            secretPhrase: values.secretPhrase
        });
    };

    handleTab = (e, index) => {
        e.preventDefault();

        this.setState({
            ...this.props,
            activeTab: index
        })
    };

    handleModal = (section) => this.setState({activeSection: section});

    render() {
        return (
            <div className="page-content">
                <div className="page-body container-fluid">
                    <div className="login">
                        <div className="login-wrap">
                            <div className={'left-section'}>
                                <img className={'logo'} src={LogoImg} alt={'Apollo'}/>
                                <div className={'flex-column'}>
                                    <p className={'title'}>Welcome Home,<br/>Apollonaut!</p>
                                    <p className={'sub-title'}>Apollo command center</p>
                                </div>
                            </div>
                            <div className={'right-section'}>
                                {this.state.activeSection === 'LOGIN' && (
                                    <div>
                                        <div className={'dark-card login-form'}>
                                            <p className={'title'}>Log in</p>
                                            <div className="form-tabulator">
                                                <div className="form-tab-nav-box">
                                                    <a onClick={(e) => this.handleTab(e, 0)} className={classNames({
                                                        "form-tab": true,
                                                        "active": this.state.activeTab === 0
                                                    })}>
                                                        <p>With Account ID</p>
                                                    </a>
                                                    <a onClick={(e) => this.handleTab(e, 1)} className={classNames({
                                                        "form-tab": true,
                                                        "active": this.state.activeTab === 1
                                                    })}>
                                                        <p>With Secret Phrase</p>
                                                    </a>
                                                </div>
                                                {
                                                    this.state.activeTab === 0 &&
                                                    <Form
                                                        onSubmit={(values) => this.enterAccount(values)}
                                                        render={({
                                                                     submitForm, setValue
                                                                 }) => (
                                                            <form
                                                                onSubmit={submitForm}
                                                                className={classNames({
                                                                    "tab-body mt-4": true,
                                                                    "active": this.state.activeTab === 0
                                                                })}>
                                                                <div className="input-group-app user">
                                                                    <div>
                                                                        <label htmlFor="recipient">
                                                                            Enter your ID or choose from saved
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
                                                                    Initiate
                                                                </button>
                                                            </form>
                                                        )}
                                                    />
                                                }
                                                {
                                                    this.state.activeTab === 1 &&
                                                    <Form
                                                        onSubmit={(values) => this.enterAccountByPassphrase(values)}
                                                        render={({
                                                                     submitForm
                                                                 }) => (
                                                            <React.Fragment>
                                                                <form
                                                                    onSubmit={submitForm}
                                                                    className={classNames({
                                                                        "tab-body": true,
                                                                        "active": this.state.activeTab === 1
                                                                    })}>
                                                                    <InfoBox className={'green-text'} transparent>
                                                                        This option works only for standard wallets.
                                                                    </InfoBox>
                                                                    <div className={'d-flex flex-column'}>
                                                                        <label>
                                                                            Secret Phrase
                                                                        </label>
                                                                        <div>
                                                                            <Text className="form-control" field="secretPhrase"
                                                                                  placeholder="Secret Phrase" type={'password'}/>
                                                                        </div>
                                                                    </div>
                                                                    <button
                                                                        type="submit"
                                                                        name={'closeModal'}
                                                                        className="btn"
                                                                    >
                                                                        Initiate
                                                                    </button>
                                                                </form>
                                                            </React.Fragment>
                                                        )}
                                                    />
                                                }
                                            </div>
                                        </div>
                                        <div
                                            className={'button-block'}
                                            onClick={() => this.handleModal('IMPORT_ACCOUNT')}
                                        >
                                            <span className={'title'}>Advanced user?</span>
                                            <span className={'sub-title'}>Import Vault Wallet</span>
                                        </div>
                                        <div
                                            className={'button-block'}
                                            onClick={() => this.handleModal('CREATE_USER')}
                                        >
                                            <span className={'title'}>New user?</span>
                                            <span className={'sub-title'}>Create Apollo Wallet</span>
                                        </div>
                                    </div>
                                )}
                                {this.state.activeSection === 'IMPORT_ACCOUNT' && (
                                    <ImportAccount handleClose={() => this.handleModal('LOGIN')} />
                                )}
                                {this.state.activeSection === 'CREATE_USER' && (
                                    <CreateUser handleClose={() => this.handleModal('LOGIN')} />
                                )}
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
)(Login);
