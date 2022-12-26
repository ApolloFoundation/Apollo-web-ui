/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React from 'react';
import {connect} from 'react-redux';
import {setModalData, setModalType, setBodyModalParamsAction, saveSendModalState, openPrevModal} from '../../../modules/modals';
import {setAccountPassphrase} from '../../../modules/account';
import crypto from  '../../../helpers/crypto/crypto';

import ModalBody from '../../components/modals/modal-body';
import { writeToLocalStorage } from '../../../actions/localStorage';

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
