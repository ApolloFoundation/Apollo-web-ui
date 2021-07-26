/** ****************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ***************************************************************************** */

import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setBodyModalParamsAction } from "../../../modules/modals";
import { validationForm } from "./form/form-validation";
import ModalBody from "../../components/modals/modal-body1";
import MessageExecutionForm from "./form";

export default function ({ closeModal }) {
  const dispatch = useDispatch();
  const { ticker, accountRS: sender, secretPhrase } = useSelector((state) => state.account);
  const { address, smcInfo } = useSelector((state) => state.modals.modalData);

  const [fuelSwitcher, setFuelSwitcher] = useState(false);

  const handleChanegeFuelSwitcher = () => {
    setFuelSwitcher(!fuelSwitcher);
  };

  const handleChangeAmount = (values, setFieldValue) => {
    const convertedValue = (values * 100000000) / smcInfo.rate;
    setFieldValue("token", convertedValue);
  };

  const formSubmit = async (values) => {
    const isValidForm = validationForm(values);

    if (!isValidForm) {
      let { token, advance, ...currentValues } = values;
      dispatch(setBodyModalParamsAction("SMC_CREATE", currentValues));
    }
  };

  return (
    <ModalBody
      modalTitle={`Buy token ${smcInfo?.name}`}
      closeModal={closeModal}
      isDisableSecretPhrase={true}
      handleFormSubmit={(values) => formSubmit(values)}
      submitButtonName="Execute"
      initialValues={{
        name: "buy",
        sender,
        address,
        value: 0,
        token: 0,
        fuelLimit: 30000000,
        fuelPrice: 100,
        params: "",
      }}
    >
      <MessageExecutionForm
        onChangeSwither={handleChanegeFuelSwitcher}
        onChangeAmount={handleChangeAmount}
        switcher={fuelSwitcher}
        ticker={ticker}
      />
    </ModalBody>
  );
}
