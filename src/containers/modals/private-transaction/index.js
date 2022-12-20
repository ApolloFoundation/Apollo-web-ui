/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React, { useCallback } from 'react';
import {useDispatch} from 'react-redux';
import {setModalData} from '../../../modules/modals';
import crypto from  '../../../helpers/crypto/crypto';
import ModalBody from '../../components/modals/modal-body';
import CustomInput from '../../components/custom-input';
// TODO update
const PrivateTransactions = ({ closeModal, nameModal }) => {
    const dispatch = useDispatch();

    const handleFormSubmit = useCallback( async ({ passphrase }) => {
        const isPassphrase = await dispatch(crypto.validatePassphrase(passphrase));

        const data = {};

        if (isPassphrase) {
            data.secretPhrase = passphrase;
        } else {
            data.passphrase = passphrase;
        }

        dispatch(setModalData(data));
        closeModal();
    }, [dispatch, closeModal]);

    return (
        <ModalBody
            modalTitle='Show private transactions'
            closeModal={closeModal}
            handleFormSubmit={handleFormSubmit}
            submitButtonName='Submit'
            isDisableSecretPhrase
            nameModel={nameModal}
        >
            <CustomInput
                name='passphrase'
                type='password'
                label='Secret Phrase'
                placeholder='Secret Phrase'
            />
        </ModalBody>
    );
}

export default PrivateTransactions;
