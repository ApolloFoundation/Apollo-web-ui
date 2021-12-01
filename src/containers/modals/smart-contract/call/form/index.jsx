import React from "react";

import NumericInput from "../../../../components/form-components/numeric-input1";
import TextualInputComponent from "../../../../components/form-components/textual-input1";
import AccountRSForm from "../../../../components/form-components/account-rs1";

const MessageExecutionForm = ({ isExplorerDisabled, isDisabled, ticker }) => {
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
        disabled={true}
      />
      <TextualInputComponent
        label="Call method"
        name="name"
        placeholder="Contract method name"
        type="text"
        disabled={isExplorerDisabled}
      />
      <NumericInput
        label="Amount APL"
        name="value"
        type="float"
        limit={9}
        counterLabel={ticker}
        defaultValue={0}
      />
      <TextualInputComponent
        label="Arguments"
        name="params"
        placeholder="Some comma-separated values"
        type="text"
        disabled={isExplorerDisabled}
      />
      <NumericInput
        label="Fuel price"
        name="fuelPrice"
        type="float"
        limit={9}
        defaultValue={0}
      />
      <NumericInput
        label="Fuel limit"
        name="fuelLimit"
        type="float"
        limit={9}
        defaultValue={0}
      />
      <TextualInputComponent
        label="Secret phrase"
        type="password"
        placeholder="Secret Phrase"
        name="secretPhrase"
      />
    </>
  );
};

export default MessageExecutionForm;
