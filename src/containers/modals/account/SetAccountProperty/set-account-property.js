/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React, { useCallback } from 'react';
import { useSelector, shallowEqual} from 'react-redux';
import {NotificationManager} from "react-notifications";
import ModalBody from "containers/components/modals/modal-body";
import { getModalDataSelector } from 'selectors';
import SetAccountPropertyForm from "./set-account-property-form";

const SetAccountProperty = (props) => {
    const modalData = useSelector(getModalDataSelector, shallowEqual);

    const handleFormSubmit = useCallback(async (values) => {
        const res = await props.processForm({ ...values }, 'setAccountProperty');
        if (!res.errorCode) {
            props.closeModal();
            NotificationManager.success('Account property has been saved!', null, 5000);
        }
    }, [props.closeModal, props.processForm])

    return (
        <ModalBody
            modalTitle={`${modalData.property ? 'Update' : 'Set'} Account Property`}
            closeModal={props.closeModal}
            handleFormSubmit={handleFormSubmit}
            submitButtonName='Set Property'
            isFee
            idGroup='set-account-property-'
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
