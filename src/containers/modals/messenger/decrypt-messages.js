/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React from 'react';
import {connect} from 'react-redux';
import {setModalType } from '../../../modules/modals';
import {setAccountPassphrase} from '../../../modules/account';
import crypto from  '../../../helpers/crypto/crypto';
import ModalBody from '../../components/modals/modal-body';
import { writeToLocalStorage } from '../../../actions/localStorage';
import { getAccountPublicKeySelector, getModalHistorySelector } from '../../../selectors';

const mapStateToProps = state => ({
    publicKey: getAccountPublicKeySelector(state),
    modalsHistory: getModalHistorySelector(state),
});

const mapDispatchToProps = {
    setModalType,
    validatePassphrase: crypto.validatePassphrase,
    setAccountPassphrase,
};
class DecryptMessage extends React.Component {
    state = {
        passphraseStatus: false
    };

    async validatePassphrase(passphrase) {
        return await this.props.validatePassphrase(passphrase);
    }

    handleFormSubmit = async (params) => {
        let passphrase = params.passphrase || params.secretPhrase;
        if (params.isRememberPassphrase) {
            writeToLocalStorage('secretPhrase',passphrase);
        }
        this.props.setAccountPassphrase(passphrase);
        this.closeModal();
    };

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
                isDisabe2FA
            />
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(DecryptMessage);
