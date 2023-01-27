/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React, { useCallback } from 'react';
import {useDispatch, useSelector, shallowEqual} from 'react-redux';
import InfoBox from '../../components/info-box';
import {NotificationManager} from "react-notifications";
import submitForm from "../../../helpers/forms/forms";
import CustomInput from '../../components/custom-input/CustomInputWithFormik';
import { getModalDataSelector } from '../../../selectors';
import ModalBody from '../../components/modals/modal-body';

const AddMonitor = (props) => {
    const dispatch = useDispatch();
    const modalData = useSelector(getModalDataSelector, shallowEqual);

    const handleFormSubmit = useCallback(async values => {
        if (!values.secretPhrase) {
            NotificationManager.error("Secret phrase is required", "Error", 5000);
        }

        const toSend = {
            property: values.property,
            interval: values.interval,
            secretPhrase: values.secretPhrase,
            feeATM: 0,
            amount: values.amount,
            threshold: values.threshold,
        };
        const res = await dispatch(submitForm.submitForm(toSend, "startFundingMonitor"))
        if (res.errorCode) {
            NotificationManager.error(res.errorDescription, 'Error', 5000)
        } else {
            NotificationManager.success('Monitor has been started!', null, 5000);
            props.closeModal();
            setTimeout(() => {
                modalData()
            }, 1000);
        }
    }, [dispatch, modalData]);

    return (
        <ModalBody
            nameModal={props.nameModal}
            handleFormSubmit={handleFormSubmit}
            modalTitle="Start Funding Monitor"
            closeModal={props.closeModal}
            submitButtonName="Start"
            initialValues={{
                feeATM: 1,
            }}
        >
            <InfoBox danger mt>
                Your secret phrase will be sent to the server!
            </InfoBox>
            <CustomInput
                label="Control Property"
                name="property"
                placeholder="Property"
            />
            <CustomInput
                label="Amount"
                name="amount"
                placeholder="Amount"
                type="tel"
            />
            <CustomInput
                label="Threshold"
                name="threshold"
                placeholder="Threshold"
                type="tel"
            />
            <CustomInput
                label="Interval"
                name="interval"
                placeholder="Interval"
                type="tel"
            />
        </ModalBody>
    );
}

export default AddMonitor;
