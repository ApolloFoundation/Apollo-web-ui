/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React from 'react';
import {connect} from 'react-redux';
import {setModalData} from '../../../modules/modals';
import {NotificationContainer, NotificationManager} from 'react-notifications';
import {generateAccountAction} from '../../../actions/account'

import AdvancedSettings from '../../components/advanced-transaction-settings'
import InfoBox from '../../components/info-box'
import {Form, Text, TextArea, Number, Checkbox} from 'react-form';
import crypto from '../../../helpers/crypto/crypto';
import {setBodyModalParamsAction} from "../../../modules/modals";
import {setAlert} from "../../../modules/modals";
import submitForm from "../../../helpers/forms/forms";
import store from '../../../store'
import {getAccountDataAction} from "../../../actions/login";
import ContentLoader from '../../components/content-loader'
import ModalFooter from '../../components/modal-footer'
import {importAccountAction} from "../../../actions/account";
import classNames from "classnames";
import InputForm from "../../components/input-form";

const mapStateToProps = state => ({
    account: state.account.account,
    modalData: state.modals.modalData,
});

const mapDispatchToProps = dispatch => ({
    setModalData: (data) => dispatch(setModalData(data)),
    submitForm: (data, requestType) => dispatch(submitForm.submitForm(data, requestType)),
    setBodyModalParamsAction: (type, data) => dispatch(setBodyModalParamsAction(type, data)),
    setAlert: (type, message) => dispatch(setAlert(type, message)),
    validatePassphrase: (passPhrase) => dispatch(crypto.validatePassphrase(passPhrase)),
    getAccountIdAsyncApl: (passPhrase) => dispatch(crypto.getAccountIdAsyncApl(passPhrase)),
    getAccountDataAction: (reqParams) => dispatch(getAccountDataAction(reqParams)),
});

class ImportAccount extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            generatedPassphrase: null,
            generatedAccount: null,
            isValidating: false,
            isAccountLoaded: false
        }
    };

    componentWillReceiveProps(newProps) {
        if (newProps.account) {
            this.props.closeModal();
        }
    }

    handleFormSubmit = async (values) => {

        const importAccount = await importAccountAction(values);

        if (importAccount) {
            if (importAccount.errorCode) {
                NotificationManager.error(importAccount.errorDescription, 'Error', 5000);
            } else {
                this.setState({
                    isGenerated: true,
                    importAccount
                });
            }
        }
    };

    goToValidation = () => {
        this.setState({
            isValidating: true
        })
    }

    hnandleEnterAccount = (values) => {
        if (values.account !== this.state.importAccount.accountRS) {
            NotificationManager.error('Account do not match each other', 'Error', 5000);
            return;
        }
        if (values.passphrase !== this.state.importAccount.passphrase) {
            NotificationManager.error('Your entered passphrase do not match the generated one', 'Error', 5000);
            return;
        }

        this.setState({
            isPending: true
        })

        const account = this.props.getAccountDataAction({account: values.account});
    }


    componentDidCatch(error, info) {
        // Display fallback UI
        this.setState({ hasError: true });
        // You can also log the error to an error reporting service
    }

    render() {
        if (this.state.hasError) {
            return (<h2>Oops something went wrong. Please reload page</h2>)
        } else {
            return (
                <div className="modal-box">
                    {
                        !this.state.isValidating &&
                        <Form
                            onSubmit={(values) => this.handleFormSubmit(values)}
                            render={({submitForm, values, addValue, removeValue, getFormState}) => (
                                <form className="modal-form" onSubmit={submitForm}>

                                    <div className="form-group-app">
                                        <a onClick={() => this.props.closeModal()} className="exit"><i
                                            className="zmdi zmdi-close"/></a>

                                        <div className="form-title">
                                            <p>Import Account</p>
                                        </div>
                                        <InfoBox info>
                                            Please enter your account key seed.
                                        </InfoBox>

                                        <React.Fragment>

                                            <div className="form-group row form-group-grey mb-15">
                                                <label className="col-sm-3 col-form-label align-self-start">
                                                    Key Seed
                                                </label>
                                                <div className="col-sm-9">
                                                    <TextArea className="form-control" placeholder="Key Seed" field="secretBytes" cols="30" rows="3" />
                                                </div>
                                            </div>

                                            {
                                                this.state.importAccount &&
                                                <React.Fragment>
                                                    <div className="input-group-app display-block offset-bottom">
                                                        <div className="row">
                                                            <div className="col-md-12 mb-15">
                                                                <label>Account RS:</label>
                                                            </div>
                                                            <div className="col-md-12">
                                                                <div
                                                                    style={{
                                                                        width: "100%"
                                                                    }}
                                                                >
                                                                    <InfoBox info>
                                                                        {this.state.importAccount.accountRS}
                                                                    </InfoBox>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="input-group-app display-block offset-bottom">
                                                        <div className="row">
                                                            <div className="col-md-12 mb-15">
                                                                <label>Secret Phrase</label>
                                                            </div>
                                                            <div className="col-md-12">
                                                                <div
                                                                    style={{
                                                                        width: "100%"
                                                                    }}
                                                                >
                                                                    <InfoBox info>
                                                                        {this.state.importAccount.passphrase}
                                                                    </InfoBox>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </React.Fragment>
                                            }
                                            <div className="btn-box align-buttons-inside absolute right-conner">


                                                {
                                                    !this.state.isGenerated &&
                                                    <button
                                                        type="submit"
                                                        name={'closeModal'}
                                                        className="btn absolute btn-right blue round round-top-left round-bottom-right"
                                                    >
                                                        Restore account
                                                    </button>
                                                }
                                                {
                                                    this.state.isGenerated &&
                                                    <a
                                                        onClick={() => this.goToValidation()}
                                                        name={'closeModal'}
                                                        className="btn absolute btn-right blue round round-top-left round-bottom-right"
                                                    >
                                                        Next
                                                    </a>
                                                }




                                            </div>
                                        </React.Fragment>


                                    </div>
                                </form>
                            )}
                        />
                    }
                    {
                        this.state.isValidating &&
                        <div className="modal-form">
                            <Form
                                onSubmit={(values) => this.hnandleEnterAccount(values)}
                                render={({
                                             submitForm, setValue, values, getFormState
                                         }) => (
                                    <form
                                        className={classNames({
                                            "tab-body": true,
                                            "active": this.state.activeTab === 0
                                        })}
                                        onSubmit={submitForm}
                                    >

                                        <div className="form-group-app">
                                            <div className="form-title">
                                                <p>Restore Your Wallet</p>
                                            </div>

                                            <div className="form-group row form-group-white mb-15">
                                                <label className="col-sm-3 col-form-label">
                                                    Account
                                                </label>
                                                <div className="col-sm-9">
                                                    <InputForm
                                                        type="text"
                                                        field="account"
                                                        placeholder="Account ID"
                                                        setValue={setValue}
                                                    />
                                                </div>
                                            </div>

                                            <div className="form-group row form-group-white mb-15">
                                                <label className="col-sm-3 col-form-label">
                                                    Secret phrase
                                                </label>
                                                <div className="col-sm-9">
                                                    <InputForm
                                                        type="password"
                                                        field="passphrase"
                                                        placeholder="Secret Phrase"
                                                        setValue={setValue}
                                                    />
                                                </div>
                                            </div>

                                            <div className="btn-box align-buttons-inside absolute right-conner">
                                                <button
                                                    style={{
                                                        width: 121.5
                                                    }}
                                                    type="submit"
                                                    name={'closeModal'}
                                                    className="btn absolute btn-right blue round round-top-left round-bottom-right"
                                                >
                                                    Confirm restore
                                                </button>

                                                {
                                                    !!this.state.isPending ?
                                                        <div
                                                            style={{
                                                                width: 121.5
                                                            }}
                                                            className="btn absolute btn-right blue round round-top-left round-bottom-right"
                                                        >
                                                            <div className="ball-pulse">
                                                                <div></div>
                                                                <div></div>
                                                                <div></div>
                                                            </div>
                                                        </div> :
                                                        <button

                                                            type="submit"
                                                            name={'closeModal'}
                                                            className="btn absolute btn-right blue round round-top-left round-bottom-right"
                                                        >
                                                            Create new Account
                                                        </button>
                                                }

                                            </div>
                                        </div>

                                    </form>
                                )}
                            />
                        </div>
                    }
                </div>
            );
        }

    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ImportAccount);
