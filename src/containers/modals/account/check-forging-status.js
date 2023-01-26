/******************************************************************************
 * Copyright © 2019 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React from 'react';
import {connect} from 'react-redux';
import {setModalData, setModalType, setBodyModalParamsAction} from '../../../modules/modals';
import {setAccountPassphrase} from '../../../modules/account';
import crypto from  '../../../helpers/crypto/crypto';
import ModalBody from '../../components/modals/modal-body';
import TextualInputComponent from '../../components/form-components/textual-input';
import { writeToLocalStorage } from '../../../actions/localStorage';

class CheckForgingStatus extends React.Component {
    state = {
        passphraseStatus: false
    };

    validatePassphrase = async (passphrase) => {
        return await this.props.validatePassphrase(passphrase);
    }

    handleFormSubmit = async (params) => {
        let passphrase = params.passphrase;

        if (params.isSavePassphrase) {
            writeToLocalStorage('secretPhrase', passphrase.toString());
            delete params.isSavePassphrase;
        }

        this.props.setAccountPassphrase(passphrase);
        if (this.props.modalData && this.props.modalData.modalSubmit) {
            this.props.modalData.modalSubmit();
        }

        this.props.closeModal();
    };

    render() {
        return (
            <ModalBody
                loadForm={this.loadForm}
                modalTitle={'Confirm Secret Phrase'}
                modalSubTitle={'If you want to logout and stop forging, type your Secret Phrase to check forging status.'}
                closeModal={this.props.closeModal}
                handleFormSubmit={(values) => this.handleFormSubmit(values)}
                submitButtonName={'Check forging and logout'}
                isDisableSecretPhrase
                nameModel={this.props.nameModal}
            >
                <TextualInputComponent
                    field={'passphrase'}
                    type={'password'}
                    label={'Secret Phrase'}
                    placeholder={'Secret Phrase'}
                />
            </ModalBody>
        );
    }
}

const mapStateToProps = state => ({
    modalData: state.modals.modalData
});

const mapDispatchToProps = dispatch => ({
    setModalData: (data) => dispatch(setModalData(data)),
    setModalType: (passphrase) => dispatch(setModalType(passphrase)),
    setBodyModalParamsAction: (passphrase) => dispatch(setBodyModalParamsAction(passphrase)),
    validatePassphrase: (passphrase) => dispatch(crypto.validatePassphrase(passphrase)),
    setAccountPassphrase: (passphrase) => dispatch(setAccountPassphrase(passphrase))
});

export default connect(mapStateToProps, mapDispatchToProps)(CheckForgingStatus);
