/** ****************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ***************************************************************************** */

import React, { useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { convertToATM, convertToToken } from '../../../../helpers/converters';

import {
  testSmcMethod,
  callSmcMethod,
  publishSmcTransaction,
} from "../../../../actions/contracts";
import ModalBody from "../../../components/modals/modal-body1";
import ByForm from "./form";
import { validationForm } from "../../../../helpers/forms/contractValidator"

export default function ({ closeModal }) {
  const dispatch = useDispatch();
  const { ticker, accountRS } = useSelector((state) => state.account);
  const modalData = useSelector((state) => state.modals.modalData);

  const [isLoading, setLoading] = useState(false);

  const handleChangeAmount = (setFieldValue) => (value) => {
    const convertedValue = convertToToken(value * modalData?.smcInfo?.rate)
    setFieldValue("token", convertedValue);
  };

  const formSubmit = useCallback(async ({ token, advance, feeATM, ...values }) => {
    const isValidForm = validationForm(values);

    if (!isValidForm) {
      let data = {
        ...values,
        name: "buy",
        value: convertToATM(values.value),
        params: values.params.split(","),
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
      closeModal()
    }
  },
    [dispatch, closeModal]
  );

  return (
    <ModalBody
      id="modal-buy-token"
      modalTitle={`Buy token ${modalData?.smcInfo?.name}`}
      closeModal={closeModal}
      handleFormSubmit={formSubmit}
      submitButtonName="Execute"
      isPending={isLoading}
      initialValues={{
        address: modalData?.address,
        sender: accountRS,
        value: 0,
        token: 0,
        fuelLimit: 500000000,
        fuelPrice: 10000,
        params: "",
        secretPhrase: "",
      }}
    >
      <ByForm
        onChangeAmount={handleChangeAmount}
        ticker={ticker}
      />
    </ModalBody>
  );
}
