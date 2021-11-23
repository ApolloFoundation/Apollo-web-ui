/** ****************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ***************************************************************************** */

import React, { useCallback, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import ModalBody from "../../../components/modals/modal-body1";
import MessageExecutionForm from "./form";
import {
  testSmcMethod,
  callSmcMethod,
  publishSmcTransaction,
} from "../../../../actions/contracts";
import { convertToAPL } from "../../../../helpers/converters";
import { setTransaction } from "../../../../modules/smartContract";
import { validationForm } from "../../../../helpers/forms/contractValidator"

export default function ({ closeModal }) {
  const dispatch = useDispatch();
  const modalData = useSelector((state) => state.modals.modalData);
  const {
    accountRS,
    passPhrase,
    ticker,
  } = useSelector((state) => state.account);

  const [isLoading, setLoading] = useState(false);

  const isEmptyData = modalData?.hasOwnProperty("address");
  const isExplorerData = modalData?.hasOwnProperty("params");

  let initialValues = {
    name: "",
    params: "",
    value: 0,
    fuelLimit: 0,
    fuelPrice: 0,
    sender: accountRS,
    address: isEmptyData ? modalData.address : "",
    secretPhrase: ''
  };
  if (isExplorerData) {
    initialValues = {
      ...initialValues,
      ...modalData,
      fuelLimit: 500000000,
      fuelPrice: 100,
    };
  }

  const formSubmit = useCallback(async ({ feeATM, source, formIndex, ...values }) => {
      const isValidForm = validationForm(values, passPhrase);
      
      if (!isValidForm) {
        let data = {
          ...values,
          value: convertToAPL(values.value),
          params: values.params.split(","),
        };

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

        dispatch(setTransaction(formIndex, publishData.transaction));
        closeModal();
        }
    },
    [dispatch, closeModal]
  );

  return (
    <ModalBody
      modalTitle={
        !isExplorerData ? "Send message" : `Call method: ${modalData.name}`
      }
      closeModal={closeModal}
      handleFormSubmit={formSubmit}
      submitButtonName="Execute"
      idGroup="issue-currency-modal-"
      isPending={isLoading}
      isFee={false}
      isDisableSecretPhrase
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
