/** ****************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ***************************************************************************** */

import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setBodyModalParamsAction } from "../../../modules/modals";
import { validationForm } from "./form/form-validation";
import ModalBody from "../../components/modals/modal-body1";
import ByForm from "./form";

export default function ({ closeModal }) {
  const dispatch = useDispatch();
  const {
    ticker,
    accountRS: sender,
    passPhrase: secret,
  } = useSelector((state) => state.account);
  const modalData = useSelector((state) => state.modals.modalData);
  const [fuelSwitcher, setFuelSwitcher] = useState(false);

  const handleChanegeFuelSwitcher = () => {
    setFuelSwitcher(!fuelSwitcher);
  };

  const handleChangeAmount = (setFieldValue) => (value) => {
    const convertedValue = (value * 100000000) / modalData.smcInfo?.rate;
    setFieldValue("token", convertedValue);
  };

  const formSubmit = ({ token, advance, ...values }) => {
    const isValidForm = validationForm(values);

    if (!isValidForm) {
      dispatch(setBodyModalParamsAction("SMC_CREATE", values));
    }
  };

  return (
    <ModalBody
      modalTitle={`Buy token ${modalData?.smcInfo?.name}`}
      closeModal={closeModal}
      handleFormSubmit={formSubmit}
      submitButtonName="Execute"
      isFee
      isDisableSecretPhrase
      initialValues={{
        address: modalData?.address,
        name: "buy",
        sender,
        value: 0,
        token: 0,
        fuelLimit: 30000000,
        fuelPrice: 100,
        params: "",
        secret,
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
