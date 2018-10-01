/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import { connect } from 'react-redux';
import { Redirect } from  'react-router-dom';
import crypto from '../../../helpers/crypto/crypto';
import React from 'react';
import './Login.css'
import account from "../../../modules/account";
import { getAccountDataAction, getAccountDataBySecretPhrasseAction } from '../../../actions/login';
import {setBodyModalParamsAction} from "../../../modules/modals";
import classNames from "classnames";
import AccountRS from '../../components/account-rs';
import {Form, Text} from "react-form";
import {getConstantsAction} from '../../../actions/login'

class Login extends React.Component {
    constructor(props) {
        super(props);
    }

    state = {
        activeTab: 0
    };

    componentDidMount () {
        this.props.getConstantsAction();
    }

    enterAccount = (values) => {
        this.props.getAccountAction({
            account: values.accountRS
        });
    };

    enterAccountByPassphrase = (values) => {
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
                        <div className="modal-form">
                            <div className="form-group-app" style={{boxShadow: '0 0 30px #000'}}>
                                <div className="form-title">
                                    <p>Welcome to Apollo</p>
                                </div>
                                <div
                                    style={{margin: '55px -35px -35px -35px'}}
                                    className="form-tabulator active"
                                >
                                    <div className="form-tab-nav-box justify-left">
                                        <a onClick={(e) => this.handleTab(e, 0)} className={classNames({
                                            "form-tab": true,
                                            "active": this.state.activeTab === 0
                                        })}>
                                            <p>Enter by Account ID</p>
                                        </a>
                                        <a onClick={(e) => this.handleTab(e, 1)} className={classNames({
                                            "form-tab": true,
                                            "active": this.state.activeTab === 1
                                        })}>
                                            <p>Enter by Secret Phrase</p>
                                        </a>
                                    </div>
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
                                                <div className="input-group-app form-group display-block inline user offset-top mb-0">
                                                    <div className="row form-group-white">
                                                        <label htmlFor="recipient" className="col-sm-3 col-form-label">
                                                            Account ID
                                                        </label>
                                                        <div className="col-sm-9">
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
                                                <div className="btn-box align-buttons-inside absolute right-conner">
                                                    <a
                                                        className="btn btn-left round round-bottom-left round-top-right"
                                                        onClick={() => this.props.setBodyModalParamsAction('CREATE_USER')}
                                                    >
                                                        Create account
                                                    </a>
                                                    <button
                                                        type="submit"
                                                        name={'closeModal'}
                                                        className="btn btn-right blue round round-bottom-right round-top-left"
                                                    >
                                                        Enter
                                                    </button>

                                                </div>
                                            </form>
                                        )}
                                    />
                                    <Form
                                        onSubmit={(values) => this.enterAccountByPassphrase(values)}
                                        render={({
                                                     submitForm
                                                 }) => (
                                            <form
                                                onSubmit={submitForm}
                                                className={classNames({
                                                "tab-body": true,
                                                "active": this.state.activeTab === 1
                                            })}>
                                                <div className="form-group row form-group-white offset-top mb-0">
                                                    <label className="col-sm-3 col-form-label">
                                                        Secret Phrase
                                                    </label>
                                                    <div className="col-sm-9 mb-0 no-left-padding">
                                                        <Text className="form-control" field="secretPhrase"
                                                              placeholder="Secret Phrase" type={'password'}/>
                                                    </div>
                                                </div>
                                                <div className="btn-box align-buttons-inside absolute right-conner">
                                                    <a
                                                        className="btn btn-left round round-bottom-left round-top-right"
                                                        onClick={() => this.props.setBodyModalParamsAction('CREATE_USER')}
                                                    >
                                                        Create account
                                                    </a>
                                                    <button
                                                        type="submit"
                                                        name={'closeModal'}
                                                        className="btn btn-right blue round round-bottom-right round-top-left"
                                                    >
                                                        Enter
                                                    </button>

                                                </div>
                                            </form>
                                        )}
                                    />
                                </div>

                            </div>
                        </div>
                        <p
                            style={{
                                position: "absolute",
                                bottom: "30px",
                                color: 'white',
                                width: '100%',
                                textAlign: 'center',
                                left: '0'
                            }}
                        >
                            Copyright © 2017-2018 Apollo Foundation. Apollo Version: {!!this.props.appState && this.props.appState.version} <br/>
                        </p>
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
        setBodyModalParamsAction: (type, data) => dispatch(setBodyModalParamsAction(type, data)),
        getConstantsAction: () => dispatch(getConstantsAction()),
    };
};

export default connect(
    mapStateToProps,
    mapDipatchToProps
)(Login);