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
import {confirm2FAActon} from '../../../actions/account'

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

class Confirm2FA extends React.Component {
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

        values = {
            ...values,
            passphrase: this.props.modalData.passphrase,
            account:    this.props.modalData.account
        }

        const confirm = await confirm2FAActon(values);

        if (confirm) {
            if (confirm.errorCode) {
                NotificationManager.error(confirm.errorDescription, 'Error', 5000);
            } else {
                if (this.props.modalData.settingsReloader) {
                    this.props.modalData.settingsReloader();
                }
                this.props.setBodyModalParamsAction(null, {});
                this.props.closeModal();

                NotificationManager.success('2FA was successfully enabled!', null, 5000);
            }
        }
    };

    render() {
        return (
            <div className="modal-box">
                <Form
                    onSubmit={(values) => this.handleFormSubmit(values)}
                    render={({submitForm, values, addValue, removeValue, getFormState}) => (
                        <form className="modal-form" onSubmit={submitForm}>
                            <div className="form-group-app">
                                <a onClick={() => this.props.closeModal()} className="exit"><i className="zmdi zmdi-close" /></a>

                                <div className="form-title">
                                    <p>Confirm 2FA enabling</p>
                                </div>
                                <div className="input-group-app display-block offset-bottom">
                                    <div className="row">
                                        <div className="col-md-12 mb-15">
                                            <label>Your Google Authenticate QR code:</label>
                                        </div>
                                        <div className="col-md-12">
                                            <div>
                                                {
                                                    this.props.modalData &&
                                                    this.props.modalData.qrCodeUrl &&
                                                    <img src={this.props.modalData.qrCodeUrl} alt=""/>
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="input-group-app display-block">
                                    <div className="row">
                                        <div className="col-md-12 mb-15">
                                            <label>Your generated secret word:</label>
                                        </div>
                                        <div className="col-md-12">
                                            <div>
                                                <InfoBox
                                                    info
                                                >
                                                    {
                                                        this.props.modalData &&
                                                        this.props.modalData.secret
                                                    }
                                                </InfoBox>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="input-group-app block offset-bottom">
                                    <div className="row">
                                        <div className="col-md-3">
                                            <label>2FA code</label>
                                        </div>
                                        <div className="col-md-9">
                                            <Text
                                                type={'password'}
                                                field={'code'}
                                                placeholder="2FA code"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="btn-box align-buttons-inside absolute right-conner">
                                    <button
                                        type="submit"
                                        name={'closeModal'}
                                        className="btn absolute btn-right blue round round-top-left round-bottom-right"
                                    >
                                        Confirm enable
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

export default connect(mapStateToProps, mapDispatchToProps)(Confirm2FA);
