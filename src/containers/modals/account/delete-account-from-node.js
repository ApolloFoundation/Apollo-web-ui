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
import {setBodyModalParamsAction, saveSendModalState, openPrevModal} from "../../../modules/modals";
import {setAlert} from "../../../modules/modals";
import submitForm from "../../../helpers/forms/forms";
import store from '../../../store'
import {getAccountDataAction} from "../../../actions/login";
import ContentLoader from '../../components/content-loader'
import ModalFooter from '../../components/modal-footer'
import {removeAccountAction} from '../../../actions/account'
import jsPDF from "jspdf";
import QRCode from "qrcode";

import BackForm from '../modal-form/modal-form-container';

const mapStateToProps = state => ({
    modalData: state.modals.modalData,
    modalsHistory: state.modals.modalsHistory,
});

const mapDispatchToProps = dispatch => ({
    setModalData: (data) => dispatch(setModalData(data)),
    submitForm: (data, requestType) => dispatch(submitForm.submitForm(data, requestType)),
    setBodyModalParamsAction: (type, data, valueForModal) => dispatch(setBodyModalParamsAction(type, data, valueForModal)),
    setAlert: (type, message) => dispatch(setAlert(type, message)),
    validatePassphrase: (passPhrase) => dispatch(crypto.validatePassphrase(passPhrase)),
    getAccountIdAsyncApl: (passPhrase) => dispatch(crypto.getAccountIdAsyncApl(passPhrase)),
    getAccountDataAction: (reqParams) => dispatch(getAccountDataAction(reqParams)),
    saveSendModalState: (Params) => dispatch(saveSendModalState(Params)),
	openPrevModal: () => dispatch(openPrevModal()),
});

class DeleteAccountFromWebNode extends React.Component {
    constructor(props) {
        super(props);
    };

    state  ={
        tinggi:11.69,
        lebar:'08.27',
    };

    handleFormSubmit = async (values) => {
        const accountKeySeedData = await removeAccountAction(values);

        if (!accountKeySeedData.errorCode) {

            NotificationManager.success('Your account was successfully removed from this web node.', null, 5000);
            this.props.closeModal();

        } else {
            NotificationManager.error(accountKeySeedData.errorDescription, 'Error', 5000);
        }
    };

    componentDidCatch(error, info) {
        // Display fallback UI
        this.setState({ hasError: true });
        // You can also log the error to an error reporting service
    }

    generatePDF = (credentials) => {
        // e.preventDefault();

        let doc = new jsPDF({
            // orientation: 'landscape',
            unit: 'in',
            // format: [4, 2]  // tinggi, lebar
            format: [this.state.tinggi, this.state.lebar]
        });

        // TODO: migrate to QR code


        var qrcode;
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth()+1; //January is 0!
        var yyyy = today.getFullYear();


        doc.setFontSize(15);
        doc.text('The apollo wallet`s secret key', 0.5, 0.5);
        doc.setFontSize(10);

        doc.text(`${yyyy}/${mm}/${dd}`, 0.5, 0.8 + (0.3))
        doc.text(`${credentials[0].name}:`, 0.5, 0.8 + (0.3 * 2))
        doc.text(`${credentials[0].value}`, 0.5, 0.8 + (0.3 * 3))

        QRCode.toDataURL(credentials[0].value, function (err, url) {
            doc.addImage( url, 'SVG', 0.5, 1.9, 1.9, 1.9)
        })

        doc.text(`${credentials[1].name}:`, 0.5, 0.8 + (0.3 * 11))
        doc.text(`${credentials[1].value}`, 0.5, 0.8 + (0.3 * 12))

        QRCode.toDataURL(credentials[1].value, function (err, url) {
            doc.addImage( url, 'SVG', 0.5, 4.8, 1.9, 1.9)
        })
        doc.save(`apollo-wallet-${credentials[0].value}`)
    };

    render() {
        return (
            <div className="modal-box">
                <BackForm
	                nameModal={this.props.nameModal}
                    onSubmit={(values) => this.handleFormSubmit(values)}
                    render={({setValue, submitForm, values, addValue, removeValue, getFormState}) => (
                        <form className="modal-form" onChange={() => this.props.saveSendModalState(values)} onSubmit={submitForm}>

                            <div className="form-group-app">
                                <a onClick={() => this.props.closeModal()} className="exit"><i
                                    className="zmdi zmdi-close"/></a>

                                <div className="form-title">
	                                {this.props.modalsHistory.length > 1 &&
	                                <div className={"backMy"} onClick={() => {this.props.openPrevModal()}}></div>
	                                }
                                    <p>Delete Account From This Web Node</p>
                                </div>

                                <InfoBox attentionLeft>
                                    Secret Key:  <span className={'itatic'}>{this.props.modalData[1].value}</span>
                                    <br/>
                                    <br/>
                                    Account ID: <span className={'itatic'}>{this.props.modalData[0].value}</span>
                                    <br/>
                                    <br/>
                                    <a
                                        className="btn blue static"
                                        onClick={() => this.generatePDF(this.props.modalData)}
                                    >
                                        Print Secret Key
                                    </a>
                                </InfoBox>
                                <InfoBox info danger nowrap>
                                    <strong>Attention!!!</strong><br/>
                                    Make a backup of your secret key. You will lose access to your account and funds if you do not have a backup.
                                </InfoBox>

                                <div className="form-group row form-group-grey mb-15">
                                    <label className="col-sm-3 col-form-label">
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

                                <div className="btn-box align-buttons-inside absolute right-conner">
                                    <button
                                        type="submit"
                                        name={'closeModal'}
                                        className="btn absolute btn-right blue round round-top-left round-bottom-right"
                                    >
                                        Delete
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

export default connect(mapStateToProps, mapDispatchToProps)(DeleteAccountFromWebNode);
