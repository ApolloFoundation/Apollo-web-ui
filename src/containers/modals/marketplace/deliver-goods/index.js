/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import config from '../../../../config';
import Form from './form';
import ModalBody from '../../../components/modals/modal-body';
import {NotificationManager} from "react-notifications";
import submitForm from "../../../../helpers/forms/forms";
import {
    getAccountRsSelector,
    getDecimalsSelector,
    getModalDataSelector,
    getTickerSelector
} from '../../../../selectors';
import { useFormatTimestamp } from '../../../../hooks/useFormatTimestamp';
import {getDGSPurchaseAction} from "../../../../actions/marketplace";

const MarketplaceDeliver = ({ closeModal }) => {
    const dispatch = useDispatch();
    const [goods, setGoods] = useState(null);
    const [isPending, setIsPending] = useState(false);

    const modalData = useSelector(getModalDataSelector);
    const account = useSelector(getAccountRsSelector);
    const decimals = useSelector(getDecimalsSelector);
    const ticker = useSelector(getTickerSelector);
    const format = useFormatTimestamp();

    const handleImageLoadint = useCallback(async () => {
        const productData = await dispatch(getDGSPurchaseAction({
            purchase: modalData
        }));

        if (productData) {
            setGoods(productData);
        }
    }, [dispatch, modalData]);

    const handleFormSubmit = useCallback(async (values) => {
        setIsPending(true);
        const data = {
            ...values,
            discountATM: values.discountATM * decimals,
            priceATM: parseInt(goods.priceATM) / decimals,
            purchase: goods.purchase,
            recipient: account,
        };

        const res = await dispatch(submitForm.submitForm( data, 'dgsDelivery'));
        if (res.errorCode) {
            NotificationManager.error(res.errorDescription, 'Error', 5000)
        } else {
            closeModal();
            NotificationManager.success('Goods has been purchased!', null, 5000);
        }
        setIsPending(false);
    }, [dispatch, closeModal, decimals, account, goods]);

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
            submitButtonName="Deliver Goods"
            initialValues={{
                discountATM: 1,
            }}
            isPending={isPending}
        >
            <Form goods={goods} decimals={decimals} ticker={ticker} formatTimestamp={format} />
        </ModalBody>
    );
}



export default MarketplaceDeliver;
