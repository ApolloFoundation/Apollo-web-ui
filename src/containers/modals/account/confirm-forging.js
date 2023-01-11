/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React, { useCallback } from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {NotificationManager} from 'react-notifications';
import {getForging} from '../../../actions/login';
import CheckboxFormInput from '../../components/check-button-input/CheckboxWithFormik';
import {setAccountPassphrase} from "../../../modules/account";
import ModalBody from '../../components/modals/modal-body';
import submitForm from '../../../helpers/forms/forms'
import InfoBox from '../../components/info-box';
import { writeToLocalStorage } from '../../../actions/localStorage';
import CustomInput from '../../components/custom-input';
import {
    getAccountSelector,
    getDecimalsSelector,
    getPassPhraseSelector,
    get2FASelector,
    getBalanceATMSelector,
    getModalDataSelector,
} from '../../../selectors';

const ConfirmForging = (props) => {
    const dispatch = useDispatch();
    const passPhrase = useSelector(getPassPhraseSelector);
    const decimals = useSelector(getDecimalsSelector);
    const account = useSelector(getAccountSelector);
    const is2FA = useSelector(get2FASelector);
    const balanceATM = useSelector(getBalanceATMSelector);
    const action = useSelector(getModalDataSelector);

    const checkPassphrase = useCallback(
        () => JSON.parse(localStorage.getItem('secretPhrase')) || passPhrase
    , [passPhrase]);

    const handleFormSubmit = useCallback(async (params) => {
        if (!balanceATM || (balanceATM / decimals) < 1000) {
            NotificationManager.error('Your effective balance must be greater than 1000 APL to forge.', 'Error', 5000);
            return;
        }
        const actionData = action.getStatus;
        const passphrase = checkPassphrase();
        const requestParams = {
            requestType: actionData,
            passphrase,
            account,
            ...params
        };
        const forging = await dispatch(await submitForm.submitForm(requestParams, actionData));

        if (forging) {
            if (!forging.errorCode) {
                const forgingStatus = await dispatch(getForging());

                if (actionData === 'startForging') {
                    NotificationManager.success(`Forging has been ${actionData === 'startForging' ? 'started' : 'stopped'}.`, null, 5000);
                }

                if (params.isSavePassphrase) {
                    writeToLocalStorage('secretPhrase', passphrase.toString());
                }
                dispatch(setAccountPassphrase(passphrase));
                action.handleSuccess(forgingStatus);
                props.closeModal();
            } else {
                NotificationManager.error(forging.errorDescription, 'Error', 5000);
            }
        }
    }, [dispatch, balanceATM, decimals, account, passPhrase, checkPassphrase, props.closeModal, action]);

    const forgingAction = action && action.getStatus === 'startForging' ? 'start' : 'stop';
    const passphrase = checkPassphrase();

    return (
        <ModalBody
            modalTitle={`Confirm ${forgingAction} forging`}
            modalSubTitle={`If you want to ${forgingAction} forging, type your ${!passphrase ? 'Secret Phrase':''} ${(!passphrase && is2FA) ? 'and':''} ${is2FA ? '2FA code':''} to confirm.`}
            closeModal={props.closeModal}
            handleFormSubmit={handleFormSubmit}
            submitButtonName={`${forgingAction.charAt(0).toUpperCase() + forgingAction.slice(1)} forging`}
            isDisableSecretPhrase
            nameModel={props.nameModal}
        >
            {action.getStatus === 'startForging' && (
                <InfoBox info>
                    Your effective balance must be greater than 1000 APL to forge.
                </InfoBox>
            )}

            {!passphrase && (
                <div>
                    <CustomInput
                        name='passphrase'
                        type='password'
                        label='Secret Phrase'
                        placeholder='Secret Phrase'
                    />

                    {forgingAction === 'start' && (
                        <CheckboxFormInput
                            name="isSavePassphrase"
                            label="Keep forging?"
                            id="confirm-forging-checkbox"
                            isTopOffset
                        />
                    )}
                </div>
            )}
            {is2FA && (
                <CustomInput
                    name='code2FA'
                    type='password'
                    label='2FA code'
                    placeholder='2FA code'
                />
            )}
        </ModalBody>
    );
}

export default ConfirmForging;