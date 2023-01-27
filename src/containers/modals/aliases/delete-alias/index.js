/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React, { useCallback } from 'react';
import { useSelector, shallowEqual} from 'react-redux';
import {NotificationManager} from "react-notifications";
import TextualInputComponent from 'containers/components/form-components/TextualInput';
import ModalBody from 'containers/components/modals/modal-body';
import { getModalDataSelector } from 'selectors';
import { useAliasDataLoader } from '../useAliasDataLoader';

const DeleteAlias = ({ processForm, closeModal }) => {
    const alias = useAliasDataLoader();
    const modalData = useSelector(getModalDataSelector, shallowEqual);
    const handleFormSubmit = useCallback(async (values) => {
        const data = {
            ...values,
            priceATM: 0,
            alias: modalData
        };

        processForm(data, 'deleteAlias', 'Alias has been deleted!', () => {
            closeModal();
            NotificationManager.success('Alias has been deleted!', null, 5000);
        });
    }, [processForm, modalData, closeModal]);

    return (
        <ModalBody
            modalTitle='Delete Alias'
            isAdvanced
            isFee
            closeModal={closeModal}
            handleFormSubmit={handleFormSubmit}
            submitButtonName='Delete Alias'
        >
            <TextualInputComponent 
                label='Alias'
                text={alias ? alias.aliasName : ''}
            />
        </ModalBody>
    );
}

export default DeleteAlias;
