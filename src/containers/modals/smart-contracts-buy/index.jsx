/** ****************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ***************************************************************************** */

import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { convertToAPL, convertToToken } from "../../../helpers/converters";

import {
  exportTestExperationMessage,
  exportExperationMessageSubmit,
  exportConfirmationOnBoard,
} from "../../../../src/actions/contracts";
import { validationForm } from "./form/form-validation";
import ModalBody from "../../components/modals/modal-body1";
import ByForm from "./form";

export default function ({ closeModal }) {
  const dispatch = useDispatch();
  const {
    ticker,
    accountRS: sender,
    passPhrase,
  } = useSelector((state) => state.account);
  const modalData = useSelector((state) => state.modals.modalData);
  const [fuelSwitcher, setFuelSwitcher] = useState(false);

  const handleChanegeFuelSwitcher = () => {
    setFuelSwitcher(!fuelSwitcher);
  };

  const handleChangeAmount = (setFieldValue) => (value) => {
    const convertedValue = convertToToken(value * modalData.smcInfo?.rate);
    setFieldValue("token", convertedValue);
  };

  const formSubmit = async ({ token, advance, feeATM, ...values }) => {
    const isValidForm = validationForm(values, passPhrase);

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
      id="modal-buy-token"
      modalTitle={`Buy token ${modalData?.smcInfo?.name}`}
      closeModal={closeModal}
      handleFormSubmit={formSubmit}
      submitButtonName="Execute"
      isDisableSecretPhrase
      initialValues={{
        address: modalData?.address,
        name: "buy",
        sender,
        value: 0,
        token: 0,
        fuelLimit: 500000000,
        fuelPrice: 100,
        params: "",
        secretPhrase: "",
      }}
    >
      <ByForm
        onChangeSwither={handleChanegeFuelSwitcher}
        onChangeAmount={handleChangeAmount}
        switcher={fuelSwitcher}
        ticker={ticker}
      />
    </ModalBody>
  );
}
