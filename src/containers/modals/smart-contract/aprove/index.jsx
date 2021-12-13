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
  const modalData = useSelector((state) => state.modals.modalData);
  const { accountRS } = useSelector((state) => state.account);
  const [isLoading, setLoading] = useState(false);

  const formSubmit = useCallback(async ({ feeATM, amount, token, ...values }) => {
    const isError = validationForm({ amount, token, ...values });

    if (!isError) {
      let data = {
        ...values,
        name: "approve",
        params: [
          processAccountRStoHex(modalData.address, true),
          convertToATM(amount),
        ],
        address: token,
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
      id="modal-smart-contract-approve"
      modalTitle={`Approve ${modalData?.address}`}
      closeModal={closeModal}
      handleFormSubmit={formSubmit}
      submitButtonName="Approve"
      isPending={isLoading}
      initialValues={{
        sender: accountRS,
        token: "",
        amount: 0,
        fuelLimit: 500000000,
        fuelPrice: 10000,
        secretPhrase: "",
      }}
    >
      <TransferForm />
    </ModalBody>
  );
}
