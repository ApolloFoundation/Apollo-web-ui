import React, { useCallback } from 'react';
import { useDispatch } from "react-redux";
import {NotificationManager} from "react-notifications";
import submitForm from "../../../../../helpers/forms/forms";
import ModalBody from "../../../../components/modals/modal-body";
import CustomTextArea from "../../../../components/form-components/TextArea/TextAreaWithFormik";

export const ParseTransactionForm = ({ closeModal }) => {
  const dispatch = useDispatch();

  const handleFormSubmit = useCallback(async (values) => {
    const toSendParse = {
        transactionBytes: values.parseBytes,
        transactionJSON: values.parseJson,
        feeATM: 0,
        random: Math.random()
    };
    const res = await dispatch(submitForm.submitForm(toSendParse, "parseTransaction"));
    if (res.errorCode) {
        NotificationManager.error(res.errorDescription, "Error", 5000)
    } else {
        NotificationManager.success("Transaction parsed!", null, 5000);
    }
  }, [dispatch]);
  
  return (
    <ModalBody
        closeModal={closeModal}
        handleFormSubmit={handleFormSubmit}
        isDisabe2FA
        isPour
        isDisableSecretPhrase
        submitButtonName='Parse Transaction'
    >
        <CustomTextArea
            label='Transaction Bytes'
            name='parseBytes'
            placeholder='Signed Transaction Bytes'
        />
        <CustomTextArea
            label='Transaction JSON'
            name='parseJson'
            placeholder='Transaction JSON'
        />
    </ModalBody>
  );
}
