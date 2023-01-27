/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React, { useCallback, useState } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import {NotificationManager} from "react-notifications";
import submitForm from "../../../helpers/forms/forms";
import TextualInput from '../../components/form-components/TextualInput';
import ModalBody from '../../components/modals/modal-body';
import { getModalDataSelector } from '../../../selectors';

const ConnectPeer = ({ closeModal }) => {
    const dispatch = useDispatch();
    const [isPending, setIsPending] = useState(false);
    const modalData = useSelector(getModalDataSelector, shallowEqual);

    const handleFormSubmit = useCallback(async (values) => {
        setIsPending(true);
        const toSend = {
            adminPassword: values.adminPassword,
            peer: modalData || values.peer,
        };
        const res = await dispatch(submitForm.submitForm(toSend, "addPeer"));
        if (res.errorCode) {
            NotificationManager.error(res.errorDescription, 'Error', 5000)
        } else {
            NotificationManager.success('Peer has been conected!', null, 5000);
            closeModal();
        }
        setIsPending(false);
    }, [dispatch, closeModal, modalData]);

    return (
        <ModalBody
            modalTitle={modalData ? 'Connect Peer' : 'Add Peer'}
            closeModal={closeModal}
            handleFormSubmit={handleFormSubmit}
            submitButtonName='Send'
            idGroup='peers-modal-'
            isDisableSecretPhrase
            isPending={isPending}
        >
            <>
                {modalData ?
                    <div className="input-wrapper mb-15">
                        {modalData}
                    </div>
                    :
                    <TextualInput
                        label="Address"
                        name="peer"
                        placeholder="Peer Address"
                    />
                }
            </>
            <TextualInput
                label="Admin Password"
                name="adminPassword"
                placeholder="Peer Address"
                type='password'
            />
        </ModalBody>
    );
}

export default ConnectPeer;
