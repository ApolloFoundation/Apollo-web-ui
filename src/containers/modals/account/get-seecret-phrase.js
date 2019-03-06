/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React from 'react';
import { Form, Text, Radio, RadioGroup, TextArea, Checkbox } from "react-form";
import {connect} from 'react-redux';
import {setModalData, setModalType, setBodyModalParamsAction} from '../../../modules/modals';
import {setAccountPassphrase} from '../../../modules/account';
import {getForging} from "../../../actions/login"
import crypto from  '../../../helpers/crypto/crypto';

import InfoBox from '../../components/info-box';

import ModalBody             from '../../components/modals/modal-body';
import TextualInputComponent from '../../components/form-components/textual-input';
import {CheckboxFormInput}   from '../../components/form-components/check-button-input';


class PrivateTransactions extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            passphraseStatus: false
        };
    }

    async validatePassphrase(passphrase) {
        return await this.props.validatePassphrase(passphrase);
    }

    handleFormSubmit = async (params) => {
        let passphrase = params.passphrase;

        if (params.isSavePassphrase) {
            localStorage.setItem('secretPhrase', JSON.stringify(passphrase.toString()));
            delete params.isSavePassphrase;
        }

        this.props.setAccountPassphrase(passphrase);
        this.props.getForging();
        // this.props.setBodyModalParamsAction(null, null);

        this.props.closeModal();
    }

    render() {
        return (
            <ModalBody
                loadForm={this.loadForm}
                modalTitle={'Confirm getting forging status'}
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

                <CheckboxFormInput
                    checkboxes={[
                        {
                            field : 'isSavePassphrase',
                            handler : null,
                            label : 'Keep forging?'
                        }
                    ]}
                />

            </ModalBody>
        );
    }
}

const mapStateToProps = state => ({
    publicKey: state.account.publicKey
});

const mapDispatchToProps = dispatch => ({
    setModalData: (data) => dispatch(setModalData(data)),
    setModalType: (passphrase) => dispatch(setModalType(passphrase)),
    setBodyModalParamsAction: (passphrase) => dispatch(setBodyModalParamsAction(passphrase)),
    validatePassphrase: (passphrase) => dispatch(crypto.validatePassphrase(passphrase)),
    setAccountPassphrase: (passphrase) => dispatch(setAccountPassphrase(passphrase)),
    getForging: (reqParams) => dispatch(getForging(reqParams)),

});

export default connect(mapStateToProps, mapDispatchToProps)(PrivateTransactions);
