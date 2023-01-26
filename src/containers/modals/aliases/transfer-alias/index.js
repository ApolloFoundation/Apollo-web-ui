/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React, { useCallback, useState } from 'react';
import {NotificationManager} from "react-notifications";
import ModalBody from '../../../components/modals/modal-body';
import { useAliasDataLoader } from '../useAliasDataLoader';
import TransferCurrencyForm from './form';

const TransferAlias = ({ closeModal, processForm }) => {
    const alias = useAliasDataLoader();
    const [isPending, setIsPending] = useState(false);

    const handleFormSubmit = useCallback(async (values) => {
        setIsPending(true);

        const data = {
            ...values,
            priceATM: 0,
            aliasName: alias.aliasName
        };

        const res = await processForm(data, 'sellAlias');
        if (res && res.errorCode) {
            setIsPending(false);
            NotificationManager.error(res.errorDescription, 'Error', 5000)
        } else {
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
            isPending={isPending}
        >
            <TransferCurrencyForm alias={alias} />
        </ModalBody>
    );
}

export default TransferAlias;
