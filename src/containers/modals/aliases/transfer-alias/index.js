/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React, { useCallback } from 'react';
import {NotificationManager} from "react-notifications";
import ModalBody from '../../../components/modals/modal-body';
import { useAliasDataLoader } from '../useAliasDataLoader';
import TransferCurrencyForm from './form';

const TransferAlias = ({ closeModal, processForm }) => {
    const alias = useAliasDataLoader();

    const handleFormSubmit = useCallback(async (values) => {
        const data = {
            ...values,
            priceATM: 0,
            aliasName: alias.aliasName
        };

        const res = await processForm(data, 'sellAlias');
        if (res && !res.errorCode) {
            closeModal();
            NotificationManager.success('Alias has been transferred!', null, 5000);
        }
    }, [processForm, alias, closeModal]);

    return (
        <ModalBody
            modalTitle='Transfer Alias'
            isAdvanced
            isFee
            closeModal={closeModal}
            handleFormSubmit={handleFormSubmit}
            submitButtonName='Transfer Alias'
            initialValues={{
                add_message: false,
                encrypt_message: false,
                permanent_message: false,
                message: '',
                recipient: '',
            }}
        >
            <TransferCurrencyForm alias={alias} />
        </ModalBody>
    );
}

export default TransferAlias;
