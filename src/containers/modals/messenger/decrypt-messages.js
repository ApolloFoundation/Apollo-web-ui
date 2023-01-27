/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React, { useCallback } from 'react';
import { NotificationManager } from "react-notifications";
import { useDispatch } from 'react-redux';
import {setAccountPassphrase} from 'modules/account';
import crypto from  'helpers/crypto/crypto';
import ModalBody from 'containers/components/modals/modal-body';
import { writeToLocalStorage } from 'actions/localStorage';

const DecryptMessage = ({ closeModal }) =>  {
    const dispatch = useDispatch();

    const handleFormSubmit = useCallback(async (params) => {
        let passphrase = params.passphrase || params.secretPhrase;

        const isValidPhrase = await dispatch(crypto.validatePassphrase(passphrase));
        if (!isValidPhrase) {
            NotificationManager.error('Secret phrase is incorrect.', 'Error', 5000);
            return;
        }
        if (params.isRememberPassphrase) {
            writeToLocalStorage('secretPhrase',passphrase);
        }
        dispatch(setAccountPassphrase(passphrase));
        closeModal();
    }, [closeModal, dispatch]);
    
    return (
        <ModalBody
            modalTitle='Decrypt messages'
            submitButtonName='Decrypt messages'
            handleFormSubmit={handleFormSubmit}
            closeModal={closeModal}
            isDisabe2FA
        />
    );
}

export default DecryptMessage;
