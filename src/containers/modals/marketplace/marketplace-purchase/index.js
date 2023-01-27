/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import {NotificationManager} from "react-notifications";
import {getDGSPurchaseAction, getDGSGoodAction} from "actions/marketplace";
import config from 'config';
import ModalBody from 'containers/components/modals/modal-body';
import {
    getAccountRsSelector,
    getDecimalsSelector,
    getModalDataSelector,
    getTickerSelector
} from 'selectors';
import Form from './form';

const MarketplacePurchase = ({ closeModal, processForm }) => {
    const dispatch = useDispatch();
    const modalData = useSelector(getModalDataSelector, shallowEqual);
    const account = useSelector(getAccountRsSelector);
    const decimals = useSelector(getDecimalsSelector);
    const ticker = useSelector(getTickerSelector);
    
    const [goods, setGoods] = useState(null);

    const handleImageLoadint = useCallback(async () => {
        const productData = await dispatch(getDGSPurchaseAction({
            purchase: modalData
        }));

        const productGoods = await dispatch(getDGSGoodAction({
            goods: modalData
        }));

        if (productData && !productData.errorCode) {
            setGoods(productData);
            return;
        }
        if (productGoods && !productGoods.errorCode) {
            setGoods(productGoods);
            return;
        }
    }, [dispatch, modalData]);

    const handleFormSubmit = useCallback(async(values) => {
        if (!values.secretPhrase || values.secretPhrase.length === 0) {
            NotificationManager.error('Secret Phrase is required.', 'Error', 5000);
            return;
        }
        if (!values.quantity || parseInt(values.quantity) === 0) {
            NotificationManager.error('Quantity must be greater than 0.', 'Error', 5000);
            return;
        }

        const data = {
            ...values,
            priceATM: parseInt(goods.priceATM) / decimals,
            goods: goods.goods,
            recipient: account,
        };

        processForm(data, 'dgsPurchase', 'Goods has been purchased', () => {
            closeModal();
            NotificationManager.success('Goods has been purchased!', null, 5000);
        })
    }, [processForm, closeModal, goods]);

    useEffect(() => {
        handleImageLoadint();
    }, [handleImageLoadint]);

    return (
        <ModalBody
            handleFormSubmit={handleFormSubmit}
            closeModal={closeModal}
            isAdvanced
            isFee
            marketplace={{
                priceATM: goods ? goods.priceATM : null,
                name: goods ? goods.name : null,
                hasImage: goods ? goods.hasImage : null,
                image:  `${config.api.serverUrl}requestType=downloadPrunableMessage&transaction=${goods ? goods.goods : null}&retrieve=true`,
                description: goods ? goods.description : null
            }}
            submitButtonName="Purchase"
            initialValues={{
                deliveryDeadlineTimestamp: 168,
                quantity: 1,
            }}
        >
            <Form goods={goods} ticker={ticker} decimals={decimals} />
        </ModalBody>
    );
}

export default MarketplacePurchase;
