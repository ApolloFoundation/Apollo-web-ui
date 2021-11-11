/** ****************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ***************************************************************************** */

import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { convertToAPL, convertToToken } from "../../../../helpers/converters";

import {
  exportTestExperationMessage,
  exportExperationMessageSubmit,
  exportConfirmationOnBoard,
} from "../../../../../src/actions/contracts";
import { validationForm } from "./form-validation";
import ModalBody from "../../../components/modals/modal-body1";
import TransferForm from "./form";

export default function ({ closeModal }) {
  const dispatch = useDispatch();
  const { passPhrase: secretPhrase } = useSelector((state) => state.account);
  const { address } = useSelector((state) => state.modals.modalData);

  const formSubmit = async ({ feeATM, ...values }) => {
    const isValidForm = validationForm(values);

    if (!isValidForm) {
      const convertedValue = convertToAPL(values.value);
      let formData = {
        ...values,
        value: convertedValue,
        params: values.params.split(","),
      };
      const testMessage = await dispatch(exportTestExperationMessage(formData));
      if (!testMessage.errorCode) {
        const publishMessage = await dispatch(
          exportExperationMessageSubmit(formData)
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
      id="modal-smart-contract-transfer"
      modalTitle={`Transfer ${address}`}
      closeModal={closeModal}
      handleFormSubmit={formSubmit}
      submitButtonName="Transfer"
      initialValues={{
        recipient: "",
        amount: "",
        fuelLimit: 300000000,
        fuelPrice: 100,
        secretPhrase,
      }}
    >
      <TransferForm />
    </ModalBody>
  );
}
