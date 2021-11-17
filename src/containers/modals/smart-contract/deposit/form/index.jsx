import React from "react";
import NumericInput from "../../../../components/form-components/numeric-input1";
import AccountRSForm from "../../../../components/form-components/account-rs1";
import TextualInputComponent from "../../../../components/form-components/numeric-input1";
const TransferForm = () => {
  return (
    <>
      <AccountRSForm
        noContactList={true}
        name="address"
        label="Recipient"
        placeholder="Recipient"
        disabled
      />
      <TextualInputComponent
        className={"text-capitalize"}
        label="Payee"
        name="sender"
        placeholder="Payee"
        type="text"
      />
      <TextualInputComponent
        className={"text-capitalize"}
        label="Token"
        name="token"
        placeholder="token"
        type="text"
      />
      <NumericInput
        label="Amount"
        name="amount"
        type="float"
        defaultValue={0}
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
    </>
  );
};

export default TransferForm;
