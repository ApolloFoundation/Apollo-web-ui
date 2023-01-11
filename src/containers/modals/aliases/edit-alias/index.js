/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React, { useCallback } from 'react';
import {NotificationManager} from "react-notifications";
import ModalBody from '../../../components/modals/modal-body';
import { useAliasDataLoader } from '../useAliasDataLoader';
import EditAliasForm from './form';

const typeData = [
    { value: 'uri',     label: 'URI' },
    { value: 'account', label: 'Account' },
    { value: 'general', label: 'Other' },
];

const EditAlias = ({ closeModal, processForm }) => {
    const alias = useAliasDataLoader();

    const handleFormSubmit = useCallback(async (values) => {
        const data = {
            ...values,
            aliasName: alias.aliasName,
        };

        processForm(data, 'setAlias', 'Alias has been edited!', () => {
            closeModal();
            NotificationManager.success('Alias has been edited!', null, 5000);
        });
    }, [closeModal, alias?.aliasName])

    return (
        <ModalBody
            modalTitle='Edit Alias'
            isAdvanced
            isFee
            closeModal={closeModal}
            handleFormSubmit={handleFormSubmit}
            submitButtonName='Edit Alias'
            initialValues={{
                type: typeData[0].value,
            }}
        >
            <EditAliasForm alias={alias} typeData={typeData} />
        </ModalBody>
    );
}

export default EditAlias;
