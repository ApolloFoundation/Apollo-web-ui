/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import { connect } from 'react-redux';
import React from 'react';
import {NotificationManager} from "react-notifications";
import { getAccountDataAction, getAccountDataBySecretPhrasseAction } from '../../../actions/login';
import {setBodyModalParamsAction} from "../../../modules/modals";
import classNames from "classnames";
import AccountRS from '../../components/account-rs';
import {Form, Text} from "react-form";
import {getConstantsAction} from '../../../actions/login'
import InfoBox from "../../components/info-box";

import LogoImg from '../../../assets/logo.png';
import './Login.scss'

class Login extends React.Component {
    state = {
        activeTab: 0
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

    render() {
        return (
            <div className="page-content">
                <div className="page-body container-fluid">
                    <div className="login">
                        <div className="login-wrap">
                            <div className={'left-section'}>
                                <img className={'logo'} src={LogoImg} alt={'Apollo'}/>
                                <span className={'title'}>
                                Welcome Home,<br/>
                                Apollonaut!</span>
                                <span className={'sub-title'}>This is Apollo command center</span>
                            </div>
                            <div className={'right-section'}>
                                <div>
                                    <div className={'form-block'}>
                                        <p className={'title'}>Log in</p>
                                        <div className="form-tabulator active">
                                            <div className="form-tab-nav-box justify-left">
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
                                                                "tab-body": true,
                                                                "active": this.state.activeTab === 0
                                                            })}>
                                                            <div className="input-group-app user">
                                                                <div>
                                                                    <label htmlFor="recipient">
                                                                        Account ID
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
                                                                <InfoBox transparent>
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
                                        onClick={() => this.props.setBodyModalParamsAction('IMPORT_ACCOUNT')}
                                    >
                                        <span className={'title'}>Advanced user?</span>
                                        <span className={'sub-title'}>Import vault wallet</span>
                                    </div>
                                    <div
                                        className={'button-block'}
                                        onClick={() => this.props.setBodyModalParamsAction('CREATE_USER')}
                                    >
                                        <span className={'title'}>New user?</span>
                                        <span className={'sub-title'}>Create Apollo wallet</span>
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
)(Login);