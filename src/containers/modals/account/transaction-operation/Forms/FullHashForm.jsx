import React, { useCallback } from 'react';
import { useDispatch } from "react-redux";
import {NotificationManager} from "react-notifications";
import submitForm from "../../../../../helpers/forms/forms";
import ModalBody from "../../../../components/modals/modal-body";
import TextualInputComponent from "../../../../components/form-components/textual-input";
import CustomTextArea from "../../../../components/form-components/text-area";

export const FullHashForm = ({ closeModal }) => {
  const dispatch = useDispatch();
  const handleFormSubmit = useCallback(async (values) => {
    const toSendCalculate = {
      unsignedTransactionBytes: values.calculateBytes,
      unsignedTransactionJSON: values.calculateJson,
      signatureHash: values.calculateHash,
      feeATM: 0,
      random: Math.random()
    };
    const res = await dispatch(submitForm.submitForm(toSendCalculate, "calculateFullHash"));
    if (res.errorCode) {
        NotificationManager.error(res.errorDescription, "Error", 5000)
    } else {
        NotificationManager.success("Hash calculated", null, 5000);
    }
  }, [dispatch])

  return (
    <ModalBody
        closeModal={closeModal}
        handleFormSubmit={handleFormSubmit}
        isDisabe2FA
        isPour
        isDisableSecretPhrase
        submitButtonName='Calculate Full Hash'
    >
        <CustomTextArea
            label='Unsigned Transaction Bytes'
            field='calculateBytes'
            placeholder='Unsigned Transaction Bytes'
        />
        <CustomTextArea
            label='Unsigned Transaction JSON'
            field='calculateJson'
            placeholder='Unsigned Transaction JSON'
        />
        <TextualInputComponent
            label='Signature Hash'
            field="calculateHash"
            placeholder="Signature Hash"
            type="text"
        />
    </ModalBody>
  );
}
