/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React, { useCallback } from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import {NotificationManager} from 'react-notifications';
import i18n from 'i18next';
import ModalBody from '../../../components/modals/modal-body';
import { getConstantsSelector, getTickerSelector } from '../../../../selectors';
import ListProductForSaleFrom from './form';

const ListProductForSale = ({ processForm, closeModal }) => {
    const ticker = useSelector(getTickerSelector);
    const constants = useSelector(getConstantsSelector, shallowEqual);

    const handleFormSubmit = useCallback((values) => {
        if (!values.secretPhrase || values.secretPhrase.length === 0) {
            NotificationManager.error('Secret Phrase is required.', 'Error', 5000);
            return;
        }
        if (!values.quantity || parseFloat(values.quantity) === 0) {
            NotificationManager.error('Quantity is required.', 'Error', 5000);
            return;
        }
        if (!values.messageFile) {
            NotificationManager.error(i18n.t("error_no_file_chosen"), 'Error', 5000);
            return;
        }
    
        processForm({ ...values }, 'dgsListing', 'Product has been listed!',() => {
            closeModal();
            NotificationManager.success('Product has been listed!', null, 5000);
        })
    }, [processForm, closeModal]);

    return (
        <ModalBody
            modalTitle='List Product For Sale'
            isAdvanced
            isFee
            closeModal={closeModal}
            handleFormSubmit={handleFormSubmit}
            submitButtonName='List Product'
        >
            <ListProductForSaleFrom ticker={ticker} maxSize={constants?.maxPrunableMessageLength} />
        </ModalBody>

    );
}

export default ListProductForSale;
