/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React from 'react';
import {connect} from 'react-redux';
import {NotificationManager} from 'react-notifications';
import {setBodyModalParamsAction, setModalData, setModalType} from '../../../modules/modals';
import {getForging} from '../../../actions/login';
import {CheckboxFormInput} from '../../components/form-components/check-button-input';
import {setAccountPassphrase} from "../../../modules/account";
import TextualInputComponent from '../../components/form-components/textual-input';
import ModalBody from '../../components/modals/modal-body';
import submitForm from '../../../helpers/forms/forms'
import crypto from '../../../helpers/crypto/crypto';
import InfoBox from '../../components/info-box';
import store from '../../../store'
import { writeToLocalStorage } from '../../../actions/localStorage';

class ConfirmForging extends React.Component {

    validatePassphrase = async (passphrase) => {
        return await this.props.validatePassphrase(passphrase);
    };

    handleFormSubmit = async (params) => {
        if (!this.props.balanceATM || (this.props.balanceATM / this.props.decimals) < 1000) {
            NotificationManager.error('Your effective balance must be greater than 1000 APL to forge.', 'Error', 5000);
            return;
        }
        const action = this.props.action.getStatus;
        const passphrase = this.checkPassphrase() || params.passphrase;
        const requestParams = {
            requestType: action,
            passphrase: passphrase,
            account: this.props.account,
            ...params
        };
        const forging = await store.dispatch(await submitForm.submitForm(requestParams, action));

        if (forging) {
            if (!forging.errorCode) {
                const forgingStatus = await this.props.getForging();

                if (action === 'startForging') {
                    NotificationManager.success(`Forging has been ${action === 'startForging' ? 'started' : 'stopped'}.`, null, 5000);
                }

                if (params.isSavePassphrase) {
                    writeToLocalStorage('secretPhrase', passphrase.toString());
                }

                this.props.setAccountPassphrase(passphrase);
                this.props.action.handleSuccess(forgingStatus);
                this.props.closeModal();
            } else {
                NotificationManager.error(forging.errorDescription, 'Error', 5000);
            }
        }
    };

    checkPassphrase = () => {
        console.log('check passprase');
        return localStorage.getItem('secretPhrase') ? JSON.parse(localStorage.getItem('secretPhrase')) : this.props.passphrase;
    }
    render() {
        const {action, is2FA} = this.props;
        const forgingAction = action && action.getStatus === 'startForging' ? 'start' : 'stop';
        const passphrase = this.checkPassphrase();

        return (
            <ModalBody
                loadForm={this.loadForm}
                modalTitle={`Confirm ${forgingAction} forging`}
                modalSubTitle={`If you want to ${forgingAction} forging, type your ${!passphrase ? 'Secret Phrase':''} ${(!passphrase && is2FA) ? 'and':''} ${is2FA ? '2FA code':''} to confirm.`}
                closeModal={this.props.closeModal}
                handleFormSubmit={(values) => this.handleFormSubmit(values)}
                submitButtonName={`${forgingAction.charAt(0).toUpperCase() + forgingAction.slice(1)} forging`}
                isDisableSecretPhrase
                nameModel={this.props.nameModal}
            >
                {action.getStatus === 'startForging' && (
                    <InfoBox info>
                        Your effective balance must be greater than 1000 APL to forge.
                    </InfoBox>
                )}

                {!passphrase && (
                    <div>
                        <TextualInputComponent
                            field={'passphrase'}
                            type={'password'}
                            label={'Secret Phrase'}
                            placeholder={'Secret Phrase'}
                        />

                        {forgingAction === 'start' && (
                            <CheckboxFormInput
                                checkboxes={[
                                    {
                                        field: 'isSavePassphrase',
                                        handler: null,
                                        label: 'Keep forging?'
                                    }
                                ]}
                            />
                        )}
                    </div>
                )}
                {is2FA && (
                    <TextualInputComponent
                        field={'code2FA'}
                        type={'password'}
                        label={'2FA code'}
                        placeholder={'2FA code'}
                    />
                )}
            </ModalBody>
        );
    }
}

const mapStateToProps = state => ({
    action: state.modals.modalData,
    passphrase: state.account.passPhrase,
    decimals: state.account.decimals,
    account: state.account.account,
    is2FA: state.account.is2FA,
    balanceATM: state.account.balanceATM,
});

const mapDispatchToProps = dispatch => ({
    setModalData: (data) => dispatch(setModalData(data)),
    setModalType: (passphrase) => dispatch(setModalType(passphrase)),
    setBodyModalParamsAction: (passphrase) => dispatch(setBodyModalParamsAction(passphrase)),
    getForging: (reqParams) => dispatch(getForging(reqParams)),
    validatePassphrase: (passphrase) => dispatch(crypto.validatePassphrase(passphrase)),
    setAccountPassphrase: (passphrase) => dispatch(setAccountPassphrase(passphrase)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ConfirmForging);
