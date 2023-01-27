/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React, { useCallback } from 'react';
import {NotificationManager} from "react-notifications";
import ModalBody from 'containers/components/modals/modal-body';
import AddAliasForm from './form';

const aliasTypeData = [
    { value: 'uri',     label: 'URI' },
    { value: 'account', label: 'Account' },
    { value: 'general', label: 'Other' },
];

const AddAlias = ({ closeModal, processForm }) => {

    const handleFormSubmit = useCallback(async (values) => {
        const res = await processForm({ ...values }, 'setAlias');
        if (res && !res.errorCode) {
            closeModal();
            NotificationManager.success('Alias has been listed!', null, 5000);
        }
    }, [closeModal, processForm]);

    return (
        <ModalBody
            modalTitle='Add Alias'
            isAdvanced
            isFee
            closeModal={closeModal}
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
