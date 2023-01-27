/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React, { useCallback } from 'react';
import {NotificationManager} from "react-notifications";
import ModalBody from "containers/components/modals/modal-body";
import { useAliasDataLoader } from '../useAliasDataLoader';

const CancelSell = ({ closeModal, processForm }) => {
    const alias = useAliasDataLoader();


    const handleFormSubmit = useCallback((values) => {
        const data = {
            ...values,
            recipient: alias?.accountRS,
            aliasName: alias?.aliasName,
            priceATM:  0,

        };

        processForm(data, 'sellAlias', null, (res) => {
            res = {
                transactionBytes: res.transactionBytes,
                prunableAttachmentJSON: JSON.stringify({...(res.transactionJSON.attachment), priceNQT: 0, uri: undefined, "version.AliasSell":1})
            };

            processForm(res, 'broadcastTransaction', 'Alias sell has been canceled!', () => {
                closeModal();
                NotificationManager.success('Alias sell has been canceled!', null, 5000);
            });
        });
    }, [processForm, closeModal, alias]);

    return (
        <ModalBody
            modalTitle='Cancel Alias Sale'
            closeModal={closeModal}
            handleFormSubmit={handleFormSubmit}
            isFee
            submitButtonName='Cancel alias sale'
        >
            <div className="form-group mb-15">
                <label>
                    Alias
                </label>
                <div>
                    <span>{alias?.aliasName}</span>
                </div>
            </div>
        </ModalBody>
    );
}

export default CancelSell;
