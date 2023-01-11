import React, { useCallback } from 'react';
import { useHistory } from 'react-router-dom'
import { useDispatch, useSelector} from 'react-redux';
import {NotificationManager} from "react-notifications";
import {logOutAction} from "../../../../actions/login";
import {logout} from "../../../../actions/wallet";
import ModalBody from '../../../components/modals/modal-body';
import TextualInputComponent from '../../../components/form-components/TextualInput';
import { getAccountSelector } from '../../../../selectors';

const LogoutExchange = ({ closeModal, nameModal }) => {
    const dispatch = useDispatch();
    const history = useHistory();
    const account = useSelector(getAccountSelector);

    const handleFormSubmit = useCallback(({ passphrase }) => {
        if (!passphrase || passphrase.length === 0) {
            NotificationManager.error('Secret Phrase is required.', 'Error', 5000);
            return;
        }
        dispatch(
            logout({
                accountid: account,
                passphrase,
            })
        ).then((res) => {
            if (!res.errorCode) {
                logOutAction('simpleLogOut', history);
                closeModal();
            } 
        });
    }, [dispatch, closeModal, account])

    return (
        <ModalBody
            modalTitle='Logout'
            closeModal={closeModal}
            handleFormSubmit={handleFormSubmit}
            submitButtonName='Confirm'
            isDisableSecretPhrase
            nameModel={nameModal}
        >
            <p className='text-danger'>Warning:</p>
            <p>Log out terminates the automated exchange. To continue with any exchange operations, logging in is required.</p>
            <br />
            <TextualInputComponent
                name='passphrase'
                type='password'
                label='Secret Phrase'
                placeholder='Secret Phrase'
            />
        </ModalBody>
    );
}

export default LogoutExchange;