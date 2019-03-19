/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React from 'react';
import { Form, Text, Radio, RadioGroup, TextArea, Checkbox } from "react-form";
import converters from '../../../helpers/converters';
import {connect} from 'react-redux';
import {setModalData, setModalType, setBodyModalParamsAction, saveSendModalState, openPrevModal} from '../../../modules/modals';
import {setAccountPassphrase} from '../../../modules/account';
import curve25519 from '../../../helpers/crypto/curve25519'
import crypto from  '../../../helpers/crypto/crypto';
import InputForm from '../../components/input-form'
import InfoBox from '../../components/info-box';

import ModalBody from '../../components/modals/modal-body';
import BackForm from '../modal-form/modal-form-container';

const mapStateToProps = state => ({
    publicKey: state.account.publicKey,
    modalsHistory: state.modals.modalsHistory,
});

const mapDispatchToProps = dispatch => ({
    setModalData: (data) => dispatch(setModalData(data)),
    setModalType: (passphrase) => dispatch(setModalType(passphrase)),
    setBodyModalParamsAction: (passphrase) => dispatch(setBodyModalParamsAction(passphrase)),
    validatePassphrase: (passphrase) => dispatch(crypto.validatePassphrase(passphrase)),
    setAccountPassphrase: (passphrase) => dispatch(setAccountPassphrase(passphrase)),
    saveSendModalState: (Params) => dispatch(saveSendModalState(Params)),
	openPrevModal: () => dispatch(openPrevModal()),
});

class DecryptMessage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            passphraseStatus: false
        };

        this.handleFormSubmit = this.handleFormSubmit.bind(this);
    }

    async validatePassphrase(passphrase) {
        return await this.props.validatePassphrase(passphrase);
    }

    async handleFormSubmit(params) {
        let passphrase = params.passphrase;
        if (params.passphrase) {
            delete params.secretPhrase;
            if (params.isRememberPassphrase) {
                localStorage.setItem('secretPhrase', JSON.stringify(params.passphrase))
            }
            this.props.setAccountPassphrase(params.passphrase);
            this.closeModal();
        }
        if (params.secretPhrase) {
            delete params.passphrase;
            if (params.isRememberPassphrase) {
                localStorage.setItem('secretPhrase', JSON.stringify(params.secretPhrase))
            }
            this.props.setAccountPassphrase(params.secretPhrase);
            this.closeModal();
        }
    }

    closeModal = () => {
        const modalWindow = document.querySelector('.modal-window');

        if (Object.values(modalWindow.classList).indexOf('active') !== -1) {
            modalWindow.classList.remove('active');
            setTimeout(() => {
                this.props.setModalType(null);

            }, 300);
        }
    };

    render() {
        return (
            <ModalBody
                modalTitle={'Decrypt messages'}
                submitButtonName={'Decrypt messages'}
                handleFormSubmit={values => this.handleFormSubmit(values)}
                closeModal={this.props.closeModal}
            />
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(DecryptMessage);
