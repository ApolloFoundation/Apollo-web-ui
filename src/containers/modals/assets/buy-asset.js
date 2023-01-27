/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React, { useCallback } from 'react';
import {useSelector} from 'react-redux';
import {NotificationManager} from "react-notifications";
import ModalBody from '../../components/modals/modal-body';
import TextualInputComponent from '../../components/form-components/TextualInput';
import {
    getDecimalsSelector,
    getModalDataSelector,
    getModalCallbackSelector,
    getTickerSelector
} from '../../../selectors';
import CustomInput from '../../components/custom-input/CustomInputWithFormik';

const BuyAsset = ({ processForm, closeModal, nameModal }) => {
    const modalData = useSelector(getModalDataSelector);
    const decimals = useSelector(getDecimalsSelector);
    const modalCallback = useSelector(getModalCallbackSelector);
    const ticker = useSelector(getTickerSelector);

    const handleFormSubmit = useCallback((values) => {
        const data = {
            ...values,
            asset: modalData.assetInfo.asset,
            priceOrder: modalData.priceATM * (decimals / Math.pow(10, modalData.assetInfo.decimals)),
            quantityOrder: (modalData.quantityATU * Math.pow(10, modalData.assetInfo.decimals))
        };

        processForm(data, 'placeBidOrder', 'The buy order has been submitted!', () => {
            modalCallback();
            closeModal()
            NotificationManager.success('The buy order has been submitted!', null, 5000);
        }, (res) => {
            if (res.errorCode === 4) {
                NotificationManager.error('Invalid asset order placement quantity.', 'Error', 5000);
            } else {
                NotificationManager.error('Error', res.errorDescription, 5000);
            }
        });
    }, [modalData, processForm, closeModal, modalCallback, decimals]);


    const name        = modalData && modalData.assetInfo ? modalData.assetInfo.name : '';
    const assetID     = modalData && modalData.assetInfo ? modalData.assetInfo.assetID : '';
    const quantityATU = modalData && modalData.quantityATU;
    const total       = modalData && modalData.total;

    return (
        <ModalBody
            modalTitle='Confirm Order (Buy)'
            isAdvanced
            isFee
            closeModal={closeModal}
            handleFormSubmit={handleFormSubmit}
            submitButtonName='Confirm Order'
            nameModel={nameModal}
            initialValues={{
                name,
                asset: assetID,
                quantityATU,
                feeATM: 1,
            }}
        >
            <CustomInput defaultValue={name} type="hidden" name='name' />
            <CustomInput defaultValue={assetID} type="hidden" name='asset' />
            <CustomInput defaultValue={quantityATU} placeholder='Quantity' type="hidden" name='quantityATU' />
            <TextualInputComponent
                label='Order Description'
                text={`Buy ${quantityATU} ${name} assets at ${total / quantityATU} ${ticker} each.`}
            />
            <TextualInputComponent
                label='Total'
                text={`${total} ${ticker}`}
            />
        </ModalBody>
    );
}

export default BuyAsset;
