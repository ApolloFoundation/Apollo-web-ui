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

export default function ({ closeModal }) {
  const dispatch = useDispatch();
  const formData = useSelector((state) => state.modals.modalData);
  const { accountRS, passPhrase: secretPhrase } = useSelector(
    (state) => state.account
  );

  const [initialFormData] = useState({
    sender: accountRS,
    secret: secretPhrase,
    address: "",
    name: "",
    params: "",
    value: 0,
    fuelLimit: 0,
    fuelPrice: 0,
  });

  const isEmptyData = !Object.keys(formData).length;

  const formSubmit = async (values) => {
    delete values.feeATM;
    delete values.source;

    const isValidForm = validationForm(values);

    if (!isValidForm) {
      let data = { ...values };

      if (isEmptyData) {
        data = { ...values, params: values.params.split(",") };
      }

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
        ...initialFormData,
        sender: accountRS,
        address: formData.address,
      }}
    >
      <MessageExecutionForm isDisabled={!isEmptyData} />
    </ModalBody>
  );
}

