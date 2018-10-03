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

const mapStateToProps = state => ({
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

    handleFormSubmit = async (values) => {

        const importAccount = await importAccountAction(values);

        if (importAccount)  {
            if (importAccount.errorCode) {
                NotificationManager.error(importAccount.errorDescription, 'Error', 5000);
            } else {
                this.setState({
                    importAccount
                });
            }
        }
    };

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
                                                <TextArea className="form-control" placeholder="Key Seed" field="keySeed" cols="30" rows="3" />
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
                                            <button
                                                type="submit"
                                                name={'closeModal'}
                                                className="btn absolute btn-right blue round round-top-left round-bottom-right"
                                            >
                                                Import
                                            </button>

                                        </div>
                                    </React.Fragment>


                                </div>
                            </form>
                        )}
                    />

                </div>
            );
        }

    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ImportAccount);
