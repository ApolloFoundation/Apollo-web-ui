/** ****************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ***************************************************************************** */

import React, { useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { processAccountRStoHex } from "apl-web-crypto";
import { convertToATM } from "../../../../helpers/converters";
import {
  testSmcMethod,
  callSmcMethod,
  publishSmcTransaction,
} from "../../../../actions/contracts";
import ModalBody from "../../../components/modals/modal-body1";
import TransferForm from "./form";
import { validationForm } from "../../../../helpers/forms/contractValidator"

export default function ({ closeModal }) {
  const dispatch = useDispatch();
  const { passPhrase } = useSelector((state) => state.account);
  const modalData = useSelector((state) => state.modals.modalData);

  const [isLoading, setLoading] = useState(false);

  const formSubmit = useCallback(async ({ feeATM, amount, token, ...values }) => {
    const isValidForm = validationForm({ amount, token, ...values },passPhrase);

    if (!isValidForm) {
      let data = {
        ...values,
        name: "deposit",
        params: [
          processAccountRStoHex(values.sender, true),
          processAccountRStoHex(token, true),
          convertToATM(amount),
        ],
        address: modalData?.address,
      };

      setLoading(true);

      const testData = await dispatch(testSmcMethod(data));
      if (!testData) {
        setLoading(false);
        return;
      }

      const callData = await dispatch(callSmcMethod(data));
      if (!callData) {
        setLoading(false);
        return;
      }

      const publishData = await dispatch(publishSmcTransaction({ tx: callData.tx }));
      if (!publishData) {
        setLoading(false);
        return;
      }

      setLoading(false);
      closeModal();
    }
  },
  [dispatch, closeModal]
);

  return (
    <ModalBody
      id="modal-smart-contract-transfer"
      modalTitle={`Deposit ${modalData?.address}`}
      closeModal={closeModal}
      handleFormSubmit={formSubmit}
      submitButtonName="Deposit"
      isPending={isLoading}
      initialValues={{
        sender: "",
        token: "",
        amount: 0,
        fuelLimit: 500000000,
        fuelPrice: 100,
        secretPhrase: "",
      }}
    >
      <TransferForm />
    </ModalBody>
  );
}
