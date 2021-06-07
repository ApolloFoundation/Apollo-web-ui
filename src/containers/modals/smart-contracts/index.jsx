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
} from "../../../../src/actions/contracts";

const INITIAL_FORM_DATA = {
  name: "",
  params: "",
  value: 0,
  fuelLimit: 0,
  fuelPrice: 0,
};

export default function ({ closeModal }) {
  const dispatch = useDispatch();
  const modalData = useSelector((state) => state.modals.modalData);
  const {
    accountRS,
    passPhrase: secretPhrase,
    ticker,
  } = useSelector((state) => state.account);

  const isEmptyData = modalData;

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

      const test = await dispatch(exportTestExperationMessage(data));

      if (!test.errorCode) {
        const publish = await dispatch(exportContractSubmit({ tx: test.tx }));
        if (!publish.errorCode) {
          closeModal();
        }
      }
    }
  };

  return (
    <ModalBody
      modalTitle="Send message"
      closeModal={closeModal}
      handleFormSubmit={(values) => formSubmit(values)}
      submitButtonName="Execute"
      idGroup="issue-currency-modal-"
      isFee={false}
      isDisableSecretPhrase={true}
      initialValues={{
        ...INITIAL_FORM_DATA,
        sender: accountRS,
        address: (isEmptyData && modalData.address) || "",
        secret: secretPhrase,
      }}
    >
      <MessageExecutionForm isDisabled={isEmptyData} ticker={ticker} />
    </ModalBody>
  );
}
