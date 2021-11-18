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
} from "../../../../actions/contracts";
import { validationForm } from "./form/form-validation";
import ModalBody from "../../../components/modals/modal-body1";
import TransferForm from "./form";

export default function ({ closeModal }) {
  const dispatch = useDispatch();
  const { passPhrase: secretPhrase } = useSelector((state) => state.account);
  const { address } = useSelector((state) => state.modals.modalData);

  const formSubmit = async ({ feeATM, amount, token, ...values }) => {
    const isValidForm = validationForm({ amount, token, ...values });

    if (!isValidForm) {
      const convertedValue = convertToAPL(amount);
      let formData = {
        ...values,
        value: convertedValue,
        params: [
          processAccountRStoHex(values.sender, true),
          processAccountRStoHex(token, true),
          convertedValue,
        ],
        name: "deposit",
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
      modalTitle={`Deposit ${address}`}
      closeModal={closeModal}
      handleFormSubmit={formSubmit}
      submitButtonName="Deposit"
      initialValues={{
        sender: "",
        token: "",
        amount: 0,
        fuelLimit: 300000000,
        fuelPrice: 100,
        secretPhrase,
        address,
      }}
    >
      <TransferForm />
    </ModalBody>
  );
}
