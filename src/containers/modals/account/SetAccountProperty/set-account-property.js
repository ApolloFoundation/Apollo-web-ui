/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React, { useCallback, useState } from 'react';
import { useDispatch, useSelector, shallowEqual} from 'react-redux';
import {NotificationManager} from "react-notifications";
import submitForm from "../../../../helpers/forms/forms";
import ModalBody from "../../../components/modals/modal-body";
import { getModalDataSelector } from '../../../../selectors';
import SetAccountPropertyForm from "./set-account-property-form";

const SetAccountProperty = (props) => {
    const dispatch = useDispatch();
    const [isPending, setIsPending] = useState(false);
    const modalData = useSelector(getModalDataSelector, shallowEqual);

    const handleFormSubmit = useCallback(async (values) => {
        if (!isPending) {
            setIsPending(true);

            const res = await dispatch(submitForm.submitForm({ ...values }, 'setAccountProperty'));
            if (res.errorCode) {
                NotificationManager.error(res.errorDescription, 'Error', 5000)
            } else {
                props.closeModal();
                NotificationManager.success('Account property has been saved!', null, 5000);
            }
            setIsPending(false);
        }
    }, [dispatch, props.closeModal])

    return (
        <ModalBody
            modalTitle={`${modalData.property ? 'Update' : 'Set'} Account Property`}
            closeModal={props.closeModal}
            handleFormSubmit={handleFormSubmit}
            submitButtonName='Set Property'
            isFee
            idGroup='set-account-property-'
            isPending={isPending}
            initialValues={{
                feeATM: 1,
                property: modalData.property,
            }}
        >
            <SetAccountPropertyForm
                recipientRS={modalData?.recipientRS}
                property={modalData?.property}
            />
        </ModalBody>
    );
}

export default SetAccountProperty;
