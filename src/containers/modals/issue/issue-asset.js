/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React, { useCallback } from 'react';
import {NotificationManager} from 'react-notifications';
import ModalBody from '../../components/modals/modal-body';
import TextualInputComponent from '../../components/form-components/textual-input/textual-input1';
import CustomTextArea from '../../components/form-components/text-area1';
import NummericInputForm from '../../components/form-components/NumericInput/numeric-input1'

const IssueAsset = ({ closeModal, processForm }) => {
    const handleFormSubmit = useCallback((values) => {
        const data = {
            ...values,
            quantityATU: values.quantityATU * Math.pow(10, values.decimals)
        };

        processForm(data, 'issueAsset', 'Transaction has been submitted!', () => {
            closeModal();
            NotificationManager.success('Asset has been submitted!', null, 5000);
        });
    }, [closeModal, processForm]);

    return (
        <ModalBody
            modalTitle='Issue Asset'
            isAdvanced
            isFee
            closeModal={closeModal}
            handleFormSubmit={handleFormSubmit}
            submitButtonName='Issue Asset'
            idGroup='issue-asset-modal-'
        >
            <TextualInputComponent
                label='Asset name'
                placeholder='Asset name'
                name='name'
            />
            <CustomTextArea
                label='Description'
                placeholder='Description'
                name='description'
            />
            <NummericInputForm
                label='Quantity'
                placeholder='Quantity'
                name='quantityATU'
            />
            <NummericInputForm
                label='Decimals'
                placeholder='Decimals'
                name='decimals'
            />
        </ModalBody>
    );
}

export default IssueAsset;
