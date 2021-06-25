/** ****************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ***************************************************************************** */

import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { validationForm } from "./form/form-validation";
import ModalBody from "../../components/modals/modal-body1";
import MessageExecutionForm from "./form";
import {
  exportTestExperationMessage,
  exportContractSubmit,
  exportConfirmationOnBoard,
} from "../../../../src/actions/contracts";

export default function ({ closeModal }) {
  const dispatch = useDispatch();
  const modalData = useSelector((state) => state.modals.modalData);
  const {
    accountRS,
    passPhrase: secretPhrase,
    ticker,
  } = useSelector((state) => state.account);

  const isEmptyData = modalData && modalData.hasOwnProperty("address");
  const isExplorerData = modalData && modalData.hasOwnProperty("params");

  let initialValues = {
    name: "",
    params: "",
    value: 0,
    fuelLimit: 0,
    fuelPrice: 0,
    sender: accountRS,
    address: isEmptyData ? modalData.address : "",
    secret: secretPhrase,
  };
  if (isExplorerData) {
    initialValues = {
      ...initialValues,
      ...modalData,
    };
  }

  const formSubmit = async (values) => {
    delete values.feeATM;
    delete values.source;

    const isValidForm = validationForm(values);

    if (!isValidForm) {
      let data = {
        ...values,
        value: Number(values.value) * Math.pow(10, 8),
        params: values.params.split(","),
      };

      const testMessage = await dispatch(exportTestExperationMessage(data));

      if (!testMessage.errorCode) {
        const publishMessage = await dispatch(
          exportContractSubmit({ tx: testMessage.tx })
        );
        if (!publishMessage.errorCode) {
          const boardMessage = await dispatch(
            exportConfirmationOnBoard({ tx: publishMessage.tx })
          );
          if (!boardMessage.errorCode) {
            closeModal();
          }
        }
      }
    }
  };

  return (
    <ModalBody
      modalTitle={
        !isExplorerData ? "Send message" : `Call method: ${modalData.name}`
      }
      closeModal={closeModal}
      handleFormSubmit={(values) => formSubmit(values)}
      submitButtonName="Execute"
      idGroup="issue-currency-modal-"
      isFee={false}
      isDisableSecretPhrase={true}
      initialValues={initialValues}
    >
      <MessageExecutionForm
        isExplorerDisabled={isExplorerData}
        isDisabled={isEmptyData}
        ticker={ticker}
      />
    </ModalBody>
  );
}