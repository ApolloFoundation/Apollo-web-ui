/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React from 'react';
import {connect} from 'react-redux';
import {setModalData, setModalType, setBodyModalParamsAction, saveSendModalState, openPrevModal} from '../../../modules/modals';

import crypto from  '../../../helpers/crypto/crypto';

import ModalBody             from '../../components/modals/modal-body';
import TextualInputComponent from '../../components/form-components/textual-input';


class PrivateTransactions extends React.Component {
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
        const isPassphrase = await this.validatePassphrase(params.passphrase);

        var data = {
            passphrase: params.passphrase
        };

        if (isPassphrase) {
            delete data.passphrase;
            data.secretPhrase = params.passphrase;
        }

        this.props.setModalData(data);
        this.props.setBodyModalParamsAction(null, null);
    }

    render() {
        return (
            <ModalBody
                loadForm={this.loadForm}
                modalTitle={'Show private transactions'}
                closeModal={this.props.closeModal}
                handleFormSubmit={(values) => this.handleFormSubmit(values)}
                submitButtonName={'Enter'}
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

export default connect(mapStateToProps, mapDispatchToProps)(PrivateTransactions);
