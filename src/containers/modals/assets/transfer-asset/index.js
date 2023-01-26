/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React, { useCallback } from 'react';
import {useSelector} from 'react-redux';
import {NotificationManager} from "react-notifications";
import ModalBody from '../../../components/modals/modal-body';
import { getModalDataSelector } from '../../../../selectors';
import TransferAssetFrom from './form';

const TransferAsset = ({ processForm, closeModal, nameModal }) => {
    const modalData = useSelector(getModalDataSelector);
    const handleFormSubmit = useCallback(async(values) => {
        const data = {
            ...values,
            quantityATU: values.quantityATU * Math.pow(10, modalData.decimals)
        }

        processForm(data, 'transferAsset', 'Transfer asset request has been submitted!', () => {
            closeModal();
            NotificationManager.success('Transfer asset request has been submitted!', null, 5000);
        },(res) => {
            if (res.errorCode === 4) {
                NotificationManager.error('Invalid asset order placement quantity.', 'Error', 5000);
            } else {
                NotificationManager.error(res.errorDescription, 'Error', 5000);
            }
        });
    }, [processForm, closeModal, modalData.decimals]);

    return (
        <ModalBody
            modalTitle='Transfer asset'
            isAdvanced
            isFee
            closeModal={closeModal}
            handleFormSubmit={handleFormSubmit}
            submitButtonName='Transfer asset'
            nameModel={nameModal}
            initialValues={{
                name: modalData.assetName,
                asset: modalData.assetID,
                quantityATU: modalData.quantityATU
            }}
        >
            <TransferAssetFrom modalData={modalData} />
        </ModalBody>
    );
}

export default TransferAsset;
