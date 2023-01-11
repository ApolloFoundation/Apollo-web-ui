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
    getModalCallbackSelector,
    getModalDataSelector,
    getTickerSelector
} from '../../../selectors';

const SellAsset = ({ closeModal, processForm, nameModal }) => {
    const modalData = useSelector(getModalDataSelector);
    const decimals = useSelector(getDecimalsSelector);
    const ticker = useSelector(getTickerSelector);
    const modalCallback = useSelector(getModalCallbackSelector);

    const handleFormSubmit = useCallback(async(values) => {
        const data = {
            ...values,
            asset: modalData.assetInfo.asset,
            priceOrder: modalData.priceATM * (decimals / Math.pow(10, modalData.assetInfo.decimals)),
            quantityOrder: (modalData.quantityATU * Math.pow(10, modalData.assetInfo.decimals)),
            name: modalData?.assetInfo?.name,
            asset: modalData?.assetInfo?.asset,
            quantityATU: modalData?.quantityATU,
        };

        processForm(data, 'placeAskOrder', 'The sell order has been submitted!', () => {
            closeModal();
            modalCallback();
            NotificationManager.success('The sell order has been submitted!', null, 5000);
        })
    }, [closeModal, processForm, modalData, decimals, modalCallback]);

    const name = modalData?.assetInfo?.name ?? '';
    const quantityATU = modalData?.quantityATU;
    const total = modalData?.total;

    return (
        <ModalBody
            modalTitle='Confirm Order (Sell)'
            isAdvanced
            isFee
            closeModal={closeModal}
            handleFormSubmit={handleFormSubmit}
            submitButtonName='Confirm Order'
            nameModel={nameModal}
        >
            <TextualInputComponent
                label='Order Description'
                text={`Sell ${quantityATU} ${name} assets at ${total / quantityATU} ${ticker} each.`}
            />
            <TextualInputComponent label='Total' text={`${total} ${ticker}`} />
        </ModalBody>
    );
}

export default SellAsset;
