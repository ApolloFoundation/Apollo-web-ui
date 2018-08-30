import { connect } from 'react-redux';
import { Redirect } from  'react-router-dom';
import crypto from '../../../helpers/crypto/crypto';
import React from 'react';
import './Login.css'
import account from "../../../modules/account";
import { getAccountDataAction, getAccountDataBySecretPhrasseAction } from '../../../actions/login';
import {setBodyModalParamsAction} from "../../../modules/modals";
import classNames from "classnames";
import {Form, Text} from "react-form";

class Login extends React.Component {
    constructor(props) {
        super(props);
    }

    state = {
        activeTab: 0
    };

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
                            <div className="form-group" style={{boxShadow: '0 0 30px #000'}}>
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
                                            <p>Enter by Account RS</p>
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
                                                     submitForm
                                                 }) => (
                                            <form
                                                onSubmit={submitForm}
                                                className={classNames({
                                                "tab-body": true,
                                                "active": this.state.activeTab === 0
                                            })}>
                                                <div className="input-group block offset-bottom offset-top">
                                                    <div className="row">
                                                        <div className="col-md-3">
                                                            <label>Account RS</label>
                                                        </div>
                                                        <div className="col-md-9">
                                                            <Text rows={5} type="text" field={'accountRS'} placeholder="Account RS"/>
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
                                                <div className="input-group block offset-bottom offset-top">

                                                    <div className="row">
                                                        <div className="col-md-3">
                                                            <label>Secret Phrase</label>
                                                        </div>
                                                        <div className="col-md-9">
                                                            <Text rows={5} type="text" field={'secretPhrase'} placeholder="Secret Phrase"/>
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
    account: state.account
});

const mapDipatchToProps = dispatch => {
    return {
        getAccountAction: (requestParams) => dispatch(getAccountDataAction(requestParams)),
        getAccountDataBySecretPhrasseAction: (requestParams) => dispatch(getAccountDataBySecretPhrasseAction(requestParams)),
        setBodyModalParamsAction: (type, data) => dispatch(setBodyModalParamsAction(type, data))
    };
};

export default connect(
    mapStateToProps,
    mapDipatchToProps
)(Login);