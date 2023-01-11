/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React, { useCallback } from 'react';
import {useDispatch, useSelector} from 'react-redux';
import InfoBox from '../../components/info-box';
import {NotificationManager} from "react-notifications";
import submitForm from "../../../helpers/forms/forms";
import BackForm from '../modal-form/modal-form-container';
import { ModalBackButton } from '../../components/ModalBackButton';
import CustomInput from '../../components/custom-input/CustomInputWithFormik';
import { getModalDataSelector } from '../../../selectors';

const AddMonitor = (props) => {
    const dispatch = useDispatch();
    const modalData = useSelector(getModalDataSelector);

    const handleFormSubmit = useCallback(async values => {
        if (!values.phrase) {
            NotificationManager.error("Secret phrase is required", "Error", 5000);
        }

        const toSend = {
            property: values.property,
            interval: values.interval,
            secretPhrase: values.phrase,
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
        <div className="modal-box">
            <BackForm
                nameModal={props.nameModal}
                onSubmit={handleFormSubmit}
            >
                <div className="form-group-app">
                    <button type="button" onClick={props.closeModal} className="exit">
                        <i className="zmdi zmdi-close" />
                    </button>

                    <div className="form-title">
                        <ModalBackButton />
                        <p>Start Funding Monitor</p>
                    </div>

                    <InfoBox danger mt>
                        Your secret phrase will be sent to the server!
                    </InfoBox>

                    <div className="input-group-app offset-top display-block inline">
                        <CustomInput
                            label="Control Property"
                            name="property"
                            placeholder="Property"
                        />
                    </div>

                    <div className="input-group-app offset-top display-block inline">
                        <CustomInput
                            label="Amount"
                            name="amount"
                            placeholder="Amount"
                            type="tel"
                        />
                    </div>

                    <div className="input-group-app offset-top display-block inline">
                        <CustomInput
                            label="Threshold"
                            name="threshold"
                            placeholder="Threshold"
                            type="tel"
                        />
                    </div>

                    <div className="input-group-app offset-top display-block inline">
                        <CustomInput
                            label="Interval"
                            name="interval"
                            placeholder="Interval"
                            type="tel"
                        />
                    </div>

                    <div className="input-group-app offset-top display-block inline">
                        <CustomInput
                            label="Secret phrase"
                            name="phrase"
                            type="password"
                        />
                    </div>
                    <div className="btn-box right-conner align-right form-footer">
                        <button
                            type='button'
                            onClick={props.closeModal}
                            className="btn round round-top-left"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            name='closeModal'
                            className="btn btn-right blue round round-bottom-right"
                        >
                            Start
                        </button>
                    </div>
                </div>
            </BackForm>
        </div>
    );
}

export default AddMonitor;
