/** ****************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ***************************************************************************** */

 import React, { useCallback, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { processAccountRStoHex } from "apl-web-crypto";
import { convertToAPL } from "../../../../helpers/converters";
import {
  testSmcMethod,
  callSmcMethod,
  publishSmcTransaction,
} from "../../../../../src/actions/contracts";
import { validationForm } from "./form/form-validation";
import ModalBody from "../../../components/modals/modal-body1";
import TransferForm from "./form";

export default function ({ closeModal }) {
  const dispatch = useDispatch();

  const { passPhrase, accountRS } = useSelector((state) => state.account);
  const { address, smcInfo } = useSelector((state) => state.modals.modalData);

  const [isLoading, setLoading] = useState(false);

  const formSubmit = useCallback(async ({ feeATM, amount, recipient, ...values }) => {
    const isValidForm = validationForm(
      { amount, recipient, ...values },
      passPhrase
    );

    if (!isValidForm) {
      const convertedValue = convertToAPL(amount);
      let data = {
        ...values,
        name: "transfer",
        params: [processAccountRStoHex(recipient, true), convertedValue],
        sender: accountRS,
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
      modalTitle={`Transfer ${smcInfo?.name}`}
      closeModal={closeModal}
      handleFormSubmit={formSubmit}
      submitButtonName="Transfer"
      isPending={isLoading}
      initialValues={{
        recipient: "",
        amount: 0,
        fuelLimit: 500000000,
        fuelPrice: 100,
        secretPhrase: "",
        address
      }}
    >
      <TransferForm />
    </ModalBody>
  );
}
