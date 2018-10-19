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
import {exportAccountAction} from '../../../actions/account'
import {CopyToClipboard} from 'react-copy-to-clipboard';

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

class ExportAccount extends React.Component {
    constructor(props) {
        super(props);
    };

    handleFormSubmit = async (values) => {
        console.log(values);
        const accountKeySeedData = await exportAccountAction(values);

        if (accountKeySeedData) {
            console.log(accountKeySeedData);

            if (!accountKeySeedData.errorCode) {
                this.setState({
                    accountKeySeedData
                })

            } else {
                NotificationManager.error(accountKeySeedData.errorDescription, 'Error', 5000);
            }
        }
    };

    componentDidCatch(error, info) {
        // Display fallback UI
        this.setState({ hasError: true });
        // You can also log the error to an error reporting service
    }

    render() {
        return (
            <div className="modal-box">
                <Form
                    onSubmit={(values) => this.handleFormSubmit(values)}
                    render={({setValue, submitForm, values, addValue, removeValue, getFormState}) => (
                        <form className="modal-form" onSubmit={submitForm}>

                            <div className="form-group-app">
                                <a onClick={() => this.props.closeModal()} className="exit"><i
                                    className="zmdi zmdi-close"/></a>

                                <div className="form-title">
                                    <p>Export Account</p>
                                </div>
                                <InfoBox info>
                                    Please enter your account key seed.
                                </InfoBox>


                                <div className="form-group row form-group-grey mb-15">
                                    <label className="col-sm-3 col-form-label align-self-start">
                                        Account ID
                                    </label>
                                    <div className="col-sm-9">
                                        <Text
                                            className="form-control"
                                            placeholder="Account ID"
                                            field="account"
                                        />
                                    </div>
                                </div>

                                <ModalFooter
                                    setValue={setValue}
                                    getFormState={getFormState}
                                    values={values}
                                />

                                {

                                    this.state && this.state.accountKeySeedData &&
                                    <CopyToClipboard
                                        text={this.state.accountKeySeedData.secretBytes}
                                        onCopy={() => {
                                            NotificationManager.success('The key seed has been copied to clipboard.')
                                        }}
                                    >
                                        <InfoBox info>
                                            {this.state.accountKeySeedData.secretBytes}
                                        </InfoBox>
                                    </CopyToClipboard>

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
                            </div>
                        </form>
                    )}
                />
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ExportAccount);
