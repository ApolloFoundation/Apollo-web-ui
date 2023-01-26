/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React, { useCallback } from 'react';
import {useDispatch} from 'react-redux';
import {NotificationManager} from "react-notifications";
import { setBodyModalParamsAction } from '../../../../modules/modals';
import ModalBody from '../../../components/modals/modal-body';
import CreateShufflngForm from './form';

const CreateShuffling = ({ processForm, closeModal }) => {
    const dispatch = useDispatch();

    const handleFormSubmit = useCallback((values) => {
        const data = {
            ...values,
            amount: values.amount * 100000000,
            registrationPeriod: 1439
        };

        processForm(data, 'shufflingCreate', 'Shuffling Created!', (res) => {
            NotificationManager.success('Shuffling Created!', null, 5000);

            const reqParams = {
                transactionBytes: res.transactionBytes || res.unsignedTransactionBytes,
                prunableAttachmentJSON: JSON.stringify({...(res.transactionJSON.attachment), "version.ShufflingCreation": 1}),
                createNoneTransactionMethod: true
            };

            processForm(reqParams, 'broadcastTransaction', 'Shuffling Created!', (broadcast) => {
                dispatch(setBodyModalParamsAction('START_SHUFFLING', {broadcast}));
            });
        });
    }, [dispatch, processForm]);

    return (
        <ModalBody
            modalTitle='Create shuffling'
            isAdvanced
            isFee
            closeModal={closeModal}
            handleFormSubmit={handleFormSubmit}
            submitButtonName='Create shuffling'
        >
            <CreateShufflngForm />
        </ModalBody>
    );
}

export default CreateShuffling;
