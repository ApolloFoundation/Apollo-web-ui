import React, { useCallback } from 'react';
import {NotificationManager} from "react-notifications";
import ModalBody from "containers/components/modals/modal-body";
import CustomTextArea from "containers/components/form-components/TextArea/TextAreaWithFormik";

export const ParseTransactionForm = ({ closeModal, processForm }) => {
  const handleFormSubmit = useCallback(async (values) => {
    const toSendParse = {
        transactionBytes: values.parseBytes,
        transactionJSON: values.parseJson,
        feeATM: 0,
        random: Math.random()
    };
    const res = await processForm(toSendParse, "parseTransaction");
    if (!res.errorCode) {
        NotificationManager.success("Transaction parsed!", null, 5000);
    }
  }, [processForm]);
  
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
