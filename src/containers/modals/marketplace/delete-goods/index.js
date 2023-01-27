/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React, { useCallback, useEffect, useState } from 'react';
import {useDispatch, useSelector, shallowEqual} from 'react-redux';
import {NotificationManager} from "react-notifications";
import {getDGSGoodAction} from "../../../../actions/marketplace";
import config from '../../../../config';
import ModalBody from '../../../components/modals/modal-body';
import submitForm from "../../../../helpers/forms/forms";
import crypto from "../../../../helpers/crypto/crypto";
import { getAccountRsSelector, getModalDataSelector } from '../../../../selectors';
import { useFormatTimestamp } from '../../../../hooks/useFormatTimestamp';
import Form from './form';

const MarketplaceDelete = ({ closeModal }) =>  {
    const dispatch = useDispatch();
    const [goods, setGoods] = useState(null);
    const [isPending, setIsPending] = useState(false);

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
    }, [modalData, dispatch]);

    const handleFormSubmit = useCallback(async (values) => {
        setIsPending(true);
        const publicKey = await crypto.getPublicKeyAPL(values.secretPhrase, false);

        const data = {
            ...values,
            deltaQuantity: (values.quantity - goods.quantity),
            goods: goods.goods,
            recipient: account,
            publicKey,
        };

        const res = await dispatch(submitForm.submitForm( data, 'dgsDelisting'));
        if (res.errorCode) {
            NotificationManager.error(res.errorDescription, 'Error', 5000);
        } else {
            closeModal();
            NotificationManager.success('The marketplace item has been deleted successfully!', null, 5000);
        }
        setIsPending(false);
    }, [closeModal, goods, dispatch, account]);

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
                description: goods?.description ?? null,
            }}
            submitButtonName="Delete"
            isPending={isPending}
        >
            <Form goods={goods} formatTimestamp={format}/>
        </ModalBody>
    );
}

export default MarketplaceDelete;
