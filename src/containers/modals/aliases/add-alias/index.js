/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React, { useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';
import submitForm from "../../../../helpers/forms/forms";
import {NotificationManager} from "react-notifications";
import ModalBody from '../../../components/modals/modal-body';
import AddAliasForm from './form';

const aliasTypeData = [
    { value: 'uri',     label: 'URI' },
    { value: 'account', label: 'Account' },
    { value: 'general', label: 'Other' },
];

const AddAlias = ({ closeModal }) => {
    const dispatch = useDispatch();
    const [isPending, setIsPending] = useState(false);

    const handleFormSubmit = useCallback(async (values) => {
        if (!isPending) {
            setIsPending(true);
            const res = await dispatch(submitForm.submitForm({ ...values }, 'setAlias'));
            if ((res && res?.errorCode) || !res) {
                setIsPending(false);
                NotificationManager.error(res.errorDescription, 'Error', 5000)
            } else {
                closeModal();
                NotificationManager.success('Alias has been listed!', null, 5000);
            }
        }
    }, [dispatch, closeModal, isPending]);

    return (
        <ModalBody
            modalTitle='Add Alias'
            isAdvanced
            isFee
            closeModal={closeModal}
            isPending={isPending}
            handleFormSubmit={handleFormSubmit}
            submitButtonName='Add Alias'
            idGroup="add-alias-fee"
            initialValues={{
                type: aliasTypeData[0].value,
            }}
        >
            <AddAliasForm aliasTypeData={aliasTypeData} />
        </ModalBody>
    );
}

export default AddAlias;
