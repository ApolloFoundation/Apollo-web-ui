/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React, { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {NotificationManager} from "react-notifications";
import submitForm from "../../../helpers/forms/forms";
import InfoBox from "../../components/info-box";
import crypto from "../../../helpers/crypto/crypto";
import { getModalDataSelector } from '../../../selectors';
import ModalBody from '../../components/modals/modal-body';

const OrderCancel = ({ closeModal }) => {
    const dispatch = useDispatch();
    const [isPending, setIsPending] = useState(false);
    const modalData = useSelector(getModalDataSelector);

    const handleFormSubmit = useCallback(async (values) => {
        setIsPending(true);

        values.publicKey = await crypto.getPublicKeyAPL(values.secretPhrase);
        const res = await dispatch(submitForm.submitForm({
            ...values,
            order: modalData.order,
            phased: false,
            deadline: 0,
            phasingHashedSecretAlgorithm: 2,
        }, modalData.type === 'bid' ? 'cancelBidOrder' : modalData.type === 'ask' ? 'cancelAskOrder' : modalData.type));
        if (res.errorCode) {
            NotificationManager.error(res.errorDescription, 'Error', 5000)
        } else {
            closeModal();
            NotificationManager.success('Your order has been canceled!', null, 5000);
        }
        setIsPending(false);
    }, [dispatch, closeModal, modalData]);

    return (
        <ModalBody
            modalTitle='Confirm Order Cancellation'
            closeModal={closeModal}
            submitButtonName="Cancel my order"
            cancelButtonName="No, do not cancel"
            handleFormSubmit={handleFormSubmit}
            isPending={isPending}
            isFee
        >
            <InfoBox default>
                If you are sure you want to cancel your order, type your passphrase to confirm.
            </InfoBox>
        </ModalBody>
    );
}

export default OrderCancel;
