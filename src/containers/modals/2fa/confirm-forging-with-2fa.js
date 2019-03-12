/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React from 'react';
import { Form, Text, Radio, RadioGroup, TextArea, Checkbox } from "react-form";
import converters from '../../../helpers/converters';
import {connect} from 'react-redux';
import submitForm from '../../../helpers/forms/forms'
import {setModalData, setModalType, setBodyModalParamsAction} from '../../../modules/modals';
import store from '../../../store'
import crypto from  '../../../helpers/crypto/crypto';
import {NotificationManager} from "react-notifications";
import {getForging} from "../../../actions/login";
// import {processForm} from '../../../../actions/forms'


import ModalBody from '../../components/modals/modal-body';
import TextualInputComponent from '../../components/form-components/textual-input';



class Confirm2FAforging extends React.Component {
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
        const {account, passphrase}  = this.props
        const action = this.props.action.getStatus;

        const requestParams = {
            requestType: action,
            passphrase: passphrase,
            account: account,
            ...params
        };
        const forging = await store.dispatch(await submitForm.submitForm(requestParams, action));

        if (forging) {
            if (!forging.errorCode) {
                const forgingStatus = await this.props.getForging();

                if (action === 'startForging') {

                    NotificationManager.success('Forging has been started.', null, 5000);
                } else {
                    NotificationManager.success('Forging has been stopped.', null, 5000);
                }

                this.props.action.confirmStatus(forgingStatus);
                this.props.closeModal();
            } else {
                NotificationManager.error(forging.errorDescription, 'Error', 5000);
            }
        }
    }

    render() {
        const {action} = this.props;

        const forgingAction = action && action.getStatus === 'startForging' ? 'start' : 'stop';

        return (
            <ModalBody
                loadForm={this.loadForm}
                modalTitle={`Confirm ${forgingAction} forging`}
                modalSubTitle={`If you want to ${forgingAction} forging, type your 2FA code to confirm.`}
                closeModal={this.props.closeModal}
                handleFormSubmit={(values) => this.handleFormSubmit(values)}
                submitButtonName={`${forgingAction.charAt(0).toUpperCase() + forgingAction.slice(1)} forging`}
                isDisableSecretPhrase
                nameModel={this.props.nameModal}
            >

                <TextualInputComponent
                    field={'code2FA'}
                    type={'password'}
                    label={'2FA code'}
                    placeholder={'2FA code'}
                />
            </ModalBody>
        );
    }
}

const mapStateToProps = state => ({
    action: state.modals.modalData,
    passphrase: state.account.passPhrase,
    account: state.account.account
});

const mapDispatchToProps = dispatch => ({
    setModalData: (data) => dispatch(setModalData(data)),
    setModalType: (passphrase) => dispatch(setModalType(passphrase)),
    setBodyModalParamsAction: (passphrase) => dispatch(setBodyModalParamsAction(passphrase)),
    getForging: (reqParams) => dispatch(getForging(reqParams)),
    // processForm :(values, requestType, successMesage, successCallback) => dispatch(processForm(values, requestType, successMesage, successCallback)),
    validatePassphrase: (passphrase) => dispatch(crypto.validatePassphrase(passphrase))
});

export default connect(mapStateToProps, mapDispatchToProps)(Confirm2FAforging);
