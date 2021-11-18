/** ****************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ***************************************************************************** */

import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { processAccountRStoHex } from "apl-web-crypto";
import { convertToAPL } from "../../../../helpers/converters";
import {
  exportTestExperationMessage,
  exportExperationMessageSubmit,
  exportConfirmationOnBoard,
} from "../../../../../src/actions/contracts";
import { validationForm } from "./form/form-validation";
import ModalBody from "../../../components/modals/modal-body1";
import TransferForm from "./form";

export default function ({ closeModal }) {
  const dispatch = useDispatch();
  const { passPhrase: secretPhrase } = useSelector((state) => state.account);
  const { address } = useSelector((state) => state.modals.modalData);

  const formSubmit = async ({ feeATM, amount, ...values }) => {
    const isValidForm = validationForm({ amount, ...values });

    if (!isValidForm) {
      const convertedValue = convertToAPL(amount);
      let formData = {
        ...values,
        value: convertedValue,
        name: "transfer",
        params: [processAccountRStoHex(values.sender, true), convertedValue],
      };
      const testMessage = await dispatch(exportTestExperationMessage(formData));
      if (testMessage) {
        const publishMessage = await dispatch(
          exportExperationMessageSubmit(formData)
        );
        if (publishMessage) {
          const boardMessage = await dispatch(
            exportConfirmationOnBoard({ tx: publishMessage.tx })
          );
          if (boardMessage) {
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
        sender: "",
        amount: 0,
        fuelLimit: 300000000,
        fuelPrice: 100,
        secretPhrase: '',
        address,
      }}
    >
      <TransferForm />
    </ModalBody>
  );
}
