/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React, { useCallback } from 'react';
import { useSelector, shallowEqual } from 'react-redux';
import { NotificationManager } from "react-notifications";
import ModalBody from '../../../components/modals/modal-body';
import { getModalDataSelector } from '../../../../selectors';
import ComposeMessageForm from './form';

const ComposeMessage = ({ closeModal, processForm }) => {
    const modalData = useSelector(getModalDataSelector, shallowEqual);

    const handleFormSubmit = useCallback(({ message, ...values}) => {
        if (!values.recipient) {
            NotificationManager.error('Recipient is required.', 'Error', 5000);
            return;
        }

        const data = {
            ...values,
        }

        if (values.messageToEncrypt) {
            data.messageToEncrypt = values.message;
        } else {
            data.message = values.message;
        }

        processForm(values, 'sendMessage', 'Message has been submitted', () => {
            closeModal();
            NotificationManager.success('Message has been submitted!', null, 5000);
        })
    }, [closeModal]);

    return (
        <ModalBody
            modalTitle='Send message'
            isAdvanced
            isFee
            closeModal={closeModal}
            handleFormSubmit={handleFormSubmit}
            submitButtonName='Send message'
            initialValues={{
                messageToEncrypt: true,
                recipient:  modalData?.recipient ?? '',
            }}
        >
            <ComposeMessageForm />
        </ModalBody>
    );
}

export default ComposeMessage;
