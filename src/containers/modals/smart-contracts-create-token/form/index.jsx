import React from "react";

import NumericInput from "../../../components/form-components/numeric-input1";
import TextualInputComponent from "../../../components/form-components/textual-input1";
import AccountRSForm from "../../../components/form-components/account-rs1";
import { Form, Text, Radio, RadioGroup, TextArea, Checkbox } from "react-form";

const MessageExecutionForm = ({ ticker }) => {
  return (
    <>

      <AccountRSForm
        noContactList={true}
        name="address"
        label="Contract Address"
        placeholder="Contract Address"
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
      />
      <NumericInput
        label="Amount APL"
        name="value"
        type="float"
        counterLabel={ticker}
        defaultValue={0}
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
        type="float"
        defaultValue={0}
      />
      <NumericInput
        label="Fuel limit"
        name="fuelLimit"
        type="float"
        defaultValue={0}
      />
      <TextualInputComponent
        label="Secret phrase"
        type="password"
        placeholder="Secret Phrase"
        name="secret"
      />
    </>
  );
};

export default MessageExecutionForm;
