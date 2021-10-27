/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React from 'react';
import { Form, Text, Radio, RadioGroup, TextArea, Checkbox } from "react-form";
import converters from '../../../helpers/converters';
import {connect} from 'react-redux';
import {setModalData, setModalType, setBodyModalParamsAction, saveSendModalState, openPrevModal} from '../../../modules/modals';

import curve25519 from '../../../helpers/crypto/curve25519'
import crypto from  '../../../helpers/crypto/crypto';

import InfoBox from '../../components/info-box';

import BackForm from '../modal-form/modal-form-container';

class EnterAdminPassword extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            passphraseStatus: false
        }

        this.handleFormSubmit = this.handleFormSubmit.bind(this);
    }

    async validatePassphrase(passphrase) {
        return await this.props.validatePassphrase(passphrase);
    }

    async handleFormSubmit(params) {
        let passphrase = params.passphrase;

        const privateKey = crypto.getPrivateKeyAPL(passphrase);
        const publicKey  = this.props.publicKey;

        var sharedKey;

        sharedKey = crypto.getSharedSecretJava(
            converters.hexStringToByteArray(crypto.getPrivateKeyAPL(passphrase)),
            converters.hexStringToByteArray(this.props.publicKey)
        );

        sharedKey = new Uint8Array(sharedKey);

        const data = {
            publicKey: publicKey,
            privateKey: privateKey
        };

        this.props.setModalData(data);
        this.props.setBodyModalParamsAction(null, null);
    }

    render() {
        return (
            <div className="modal-box">
                <BackForm
	                nameModal={this.props.nameModal}
                    onSubmit={values => this.handleFormSubmit(values)}
                    render={({
                                 submitForm, values
                             }) => (
                        <form className="modal-form" onChange={() => this.props.saveSendModalState(values)} onSubmit={submitForm}>
                            <div className="form-group-app">
                                <button type="button" onClick={this.props.closeModal} className="exit"><i className="zmdi zmdi-close" /></button>

                                <div className="form-title">
                                    {this.props.modalsHistory.length > 1 &&
	                                    <div className={"backMy"} onClick={() => {this.props.openPrevModal()}}></div>
                                    }
                                    <p>Enter admin password</p>
                                </div>
                                <div className="input-group-app">
                                    <div className="row">
                                        <div className="col-md-3">
                                            <label>Admin password</label>
                                        </div>
                                        <div className="col-md-9">
                                            <Text field="adminPassword" placeholder='Admin password' type={'password'}/>
                                        </div>
                                    </div>
                                </div>

                                {
                                    this.state.passphraseStatus &&
                                    <InfoBox danger mt>
                                        Incorect admin password.
                                    </InfoBox>
                                }

                                <button type="submit" className="btn btn-right">Enter</button>
                            </div>
                        </form>
                    )} />
            </div>
        );
    }
}

const mapStateToProps = state => ({
    publicKey: state.account.publicKey,
    modalsHistory: state.modals.modalsHistory,
});

const mapDispatchToProps = dispatch => ({
    setModalData: (data) => dispatch(setModalData(data)),
    setModalType: (passphrase) => dispatch(setModalType(passphrase)),
    setBodyModalParamsAction: (passphrase) => dispatch(setBodyModalParamsAction(passphrase)),
    validatePassphrase: (passphrase) => dispatch(crypto.validatePassphrase(passphrase)),
    saveSendModalState: (Params) => dispatch(saveSendModalState(Params)),
	openPrevModal: () => dispatch(openPrevModal()),
});

export default connect(mapStateToProps, mapDispatchToProps)(EnterAdminPassword);
