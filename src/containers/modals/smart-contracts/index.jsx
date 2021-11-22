/** ****************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ***************************************************************************** */

import React, { useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { validationForm } from "./form/form-validation";
import ModalBody from "../../components/modals/modal-body1";
import MessageExecutionForm from "./form";
import {
  exportTestExperationMessage,
  exportExperationMessageSubmit,
  exportConfirmationOnBoard,
} from "../../../../src/actions/contracts";
import { convertToAPL } from "../../../helpers/converters";
import { setTransaction } from "../../../modules/smartContract";

export default function ({ closeModal }) {
  const dispatch = useDispatch();
  const modalData = useSelector((state) => state.modals.modalData);
  const {
    accountRS,
    passPhrase,
    ticker,
  } = useSelector((state) => state.account);

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

  const formSubmit = useCallback(
    async ({ feeATM, source, formIndex, ...values }) => {
      const isValidForm = validationForm(values, passPhrase);
      if (!isValidForm) {
        let data = {
          ...values,
          value: convertToAPL(values.value),
          params: values.params.split(","),
        };

        const testMessage = await dispatch(exportTestExperationMessage(data));

        if (!testMessage.errorCode) {
          const publishMessage = await dispatch(
            exportExperationMessageSubmit(data)
          );
          if (!publishMessage.errorCode) {
            const boardMessage = await dispatch(
              exportConfirmationOnBoard({ tx: publishMessage.tx })
            );
            if (!boardMessage.errorCode) {
              dispatch(setTransaction(formIndex, boardMessage.transaction));
              closeModal();
            }
          }
        }
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
