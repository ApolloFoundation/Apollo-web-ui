/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React, { useCallback, useState } from 'react';
import {useDispatch, useSelector, shallowEqual} from 'react-redux';
import {NotificationManager} from "react-notifications";
import InfoBox from '../../components/info-box';
import submitForm from "../../../helpers/forms/forms";
import TextalInput from '../../components/form-components/TextualInput';
import ModalBody from '../../components/modals/modal-body';
import { getModalDataSelector, getTickerSelector } from '../../../selectors';

const RemoveMonitor = (props) => {
    const dispatch = useDispatch();
    const modalData = useSelector(getModalDataSelector, shallowEqual);
    const ticker = useSelector(getTickerSelector);
    const [isPending, setIsPending] = useState(false);
    const handleFormSubmit = useCallback(async values => {
        setIsPending(true);
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
        setIsPending(false);
    }, [dispatch, modalData, props.closeModal]);

    return (
        <ModalBody
            nameModal={props.nameModal}
            handleFormSubmit={handleFormSubmit}
            initialValues={{
                feeATM: modalData.feeATM
            }}
            modalTitle="Remove Funding Monitor"
            closeModal={props.closeModal}
            submitButtonName="Remove"
            isPending={isPending}
        >
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
                            {modalData?.property ?? '?'}
                        </div>
                    </div>
                </div>
            </div>
            <div className="input-group-app offset-top display-block inline mb-15">
                <div className="row">
                    <div className="col-md-3">
                        <label>Recipient</label>
                    </div>
                    <div className="col-md-9">
                        <div className="input-wrapper">
                            {modalData?.recipientRS ?? '?'}
                        </div>
                    </div>
                </div>
            </div>
            <TextalInput
                name="feeATM"
                placeholder="fee"
                type="float"
                label="Fee"
                code={ticker}
            />
        </ModalBody>
    );
}

export default RemoveMonitor;
