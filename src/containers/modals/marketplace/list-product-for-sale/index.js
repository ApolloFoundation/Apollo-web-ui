/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React, { useCallback } from 'react';
import { useSelector } from 'react-redux';
import {NotificationManager} from 'react-notifications';
import ModalBody from '../../../components/modals/modal-body';
import { getTickerSelector } from '../../../../selectors';
import ListProductForSaleFrom from './form';

const ListProductForSale = ({ processForm, closeModal }) => {
    const ticker = useSelector(getTickerSelector);

    const handleFormSubmit = useCallback((values) => {
        if (!values.secretPhrase || values.secretPhrase.length === 0) {
            NotificationManager.error('Secret Phrase is required.', 'Error', 5000);
            return;
        }
        if (!values.quantity || parseFloat(values.quantity) === 0) {
            NotificationManager.error('Quantity is required.', 'Error', 5000);
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
            <ListProductForSaleFrom ticker={ticker} />
        </ModalBody>

    );
}

export default ListProductForSale;
