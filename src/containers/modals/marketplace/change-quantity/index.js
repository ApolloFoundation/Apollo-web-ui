/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React, { useCallback, useEffect, useState } from 'react';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import { NotificationManager } from "react-notifications";
import  { getDGSGoodAction } from "actions/marketplace";
import config from 'config';
import ModalBody from 'containers/components/modals/modal-body';
import { getAccountRsSelector, getModalDataSelector } from 'selectors';
import { useFormatTimestamp } from 'hooks/useFormatTimestamp';
import Form from './form';

const MarketplaceChangeQuantity = ({ closeModal, processForm }) => {
    const dispatch = useDispatch();
    const [goods, setGoods] = useState(null);
    const modalData = useSelector(getModalDataSelector, shallowEqual);
    const account = useSelector(getAccountRsSelector);
    const format = useFormatTimestamp();

    const handleImageLoadint = useCallback(async () => {
        const productData = await dispatch(getDGSGoodAction({
            goods: modalData,
        }));

        if (productData) {
            setGoods(productData);
        }
    }, [dispatch, modalData]);

    const handleFormSubmit = useCallback((values) => {
        const data = {
            ...values,
            deltaQuantity: (values.quantity - goods.quantity),
            goods: goods.goods,
            recipient: account,
        };

        processForm(data, 'dgsQuantityChange', 'The marketplace item\'s quantity has been changed successfully!', () => {
            closeModal();
            NotificationManager.success('The marketplace item\'s quantity has been changed successfully!', null, 5000);
        })
    }, [processForm, closeModal, account, goods]);

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
                priceATM: goods?.priceATM ?? null,
                name: goods?.name ?? null,
                hasImage: goods?.hasImage ?? null,
                image:  `${config.api.serverUrl}requestType=downloadPrunableMessage&transaction=${goods?.goods ?? null}&retrieve=true`,
                description: goods?.description ?? null
            }}
            submitButtonName="Change quantity"
            initialValues={{
                quantity: 1,
            }}
        >
            <Form goods={goods} formatTimestamp={format}/>
        </ModalBody>
    );
}



export default MarketplaceChangeQuantity;
