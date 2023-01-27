/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React, { useCallback } from 'react';
import {useSelector} from 'react-redux';
import {NotificationManager} from "react-notifications";
import ModalBody from '../../components/modals/modal-body';
import TextualInputComponent from '../../components/form-components/TextualInput';
import NumericInputComponent from '../../components/form-components/NumericInput';
import { getModalDataSelector } from '../../../selectors';
import { numberToLocaleString } from 'helpers/format';

const DeleteShares = ({ closeModal, nameModal, processForm }) => {
    const modalData = useSelector(getModalDataSelector);

    const handleFormSubmit = useCallback((values) => {
        const data = {
            ...values,
            asset: modalData?.assetID,
            name: modalData?.assetName,
            quantityATU: values.quantityATU * Math.pow(10, modalData?.decimals)
        };

        processForm(data, 'deleteAssetShares', 'Delete asset request has been submitted!', () => {
            closeModal();
            NotificationManager.success('Delete asset request has been submitted!', null, 5000);
        })
    }, [closeModal, processForm, modalData?.decimals, modalData?.assetName, modalData?.assetID]);

    const decimals = modalData ? modalData.decimals : null

    return (
        <ModalBody
            modalTitle='Delete Shares'
            isAdvanced
            isFee
            closeModal={closeModal}
            handleFormSubmit={handleFormSubmit}
            submitButtonName='Delete'
            nameModel={nameModal}
        >
            <TextualInputComponent
                label='Asset'
                text={`${modalData?.assetName} - ${numberToLocaleString(modalData?.quantityATU, {
                        minimumFractionDigits: decimals,
                        maximumFractionDigits: decimals
                    })
                } availiable`}
            />
            <NumericInputComponent
                label='Quantity'
                placeholder='Quantity'
                name='quantityATU'
            />
        </ModalBody>
    );
}

export default DeleteShares;
