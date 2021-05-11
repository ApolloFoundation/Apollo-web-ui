import React from "react";

import NumericInput from "../../../components/form-components/numeric-input1";
import TextualInputComponent from "../../../components/form-components/textual-input1";
import AccountRSForm from "../../../components/form-components/account-rs1";

const MessageExecutionForm = ({ isDisabled }) => {
  return (
    <>
      <AccountRSForm
        noContactList={true}
        name="address"
        label="Contract Address"
        placeholder="Contract Address"
        disabled={isDisabled}
      />
      <TextualInputComponent
        label="Sender"
        name="sender"
        placeholder="Currency Sender"
        type="text"
        disabled={isDisabled}
      />
      <TextualInputComponent
        label="Call method"
        name="name"
        placeholder="Contract method name"
        type="text"

      />
      <NumericInput
        label="Amount"
        name="value"
        placeholder="Amount"
        type="tel"

      />
      <TextualInputComponent
        label="Arguments"
        name="params"
        placeholder="Some comma-separated values"
        type="text"

      />
      <NumericInput
        label="Fuel price"
        name="fuelPrice"
        type="tel"

      />
      <NumericInput
        label="Fuel limit"
        name="fuelLimit"
        type="tel"

      />
      <TextualInputComponent
        label="Secret phrase"
        type="password"
        placeholder="Secret Phrase"
        name="secret"
        disabled={isDisabled}
      />
    </>
  );
};

export default MessageExecutionForm;
