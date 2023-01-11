/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React, { useCallback } from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {NotificationManager} from "react-notifications";
import InfoBox from '../../components/info-box';
import submitForm from "../../../helpers/forms/forms";
import BackForm from '../modal-form/modal-form-container';
import { ModalBackButton } from '../../components/ModalBackButton';
import CustomInput from '../../components/custom-input/CustomInputWithFormik';
import { getModalDataSelector } from '../../../selectors';

const RemoveMonitor = (props) => {
    const dispatch = useDispatch();
    const modalData = useSelector(getModalDataSelector);

    const handleFormSubmit = useCallback(async values => {
        if (!values.secretPhrase) {
            NotificationManager.error("Secret phrase is required", "Error", 5000);
        }

        const toSend = {
            ...values,
            property:  modalData.property,
            recipient: modalData.recipient,
        };
        const res = await dispatch(submitForm.submitForm( toSend, "deleteAccountProperty"));
        if (res.errorCode) {
            NotificationManager.error(res.errorDescription, 'Error', 5000)
        } else {
            NotificationManager.success('Monitor has been removed!', null, 5000);
            props.closeModal();
        }
    }, [dispatch, modalData]);

    return (
        <div className="modal-box">
            <BackForm
                nameModal={props.nameModal}
                onSubmit={handleFormSubmit}
                initialValues={{
                    feeATM: modalData.feeATM
                }}
            >
                <div className="form-group-app">
                    <button type="button" onClick={props.closeModal} className="exit">
                        <i className="zmdi zmdi-close" />
                    </button>

                    <div className="form-title">
                        <ModalBackButton />
                        <p>Remove Funding Monitor</p>
                    </div>

                    <InfoBox danger mt>
                        Your secret phrase will be sent to the server!
                    </InfoBox>

                    <div className="input-group-app offset-top display-block inline">
                        <div className="row">
                            <div className="col-md-3">
                                <label>Control Property</label>
                            </div>
                            <div className="col-md-9">
                                <div className="input-wrapper" style={{alignSelf: "center"}}>
                                    {modalData.property ? modalData.property : '?'}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="input-group-app offset-top display-block inline">
                        <div className="row">
                            <div className="col-md-3">
                                <label>Recipient</label>
                            </div>
                            <div className="col-md-9">
                                <div className="input-wrapper">
                                    {modalData.recipientRS ? modalData.recipientRS : '?'}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="form-group form-group-white mb-15">
                        <CustomInput
                            name="feeATM"
                            placeholder="fee"
                            type="float"
                        />
                    </div>
                    <div className="input-group-app offset-top display-block inline">
                        <CustomInput
                            label="Secret phrase"
                            name="secretPhrase"
                            type="password"
                        />
                    </div>
                    <div className="btn-box right-conner align-right">
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
                            Remove
                        </button>
                    </div>
                </div>
            </BackForm>
        </div>
    );
}

export default RemoveMonitor;
