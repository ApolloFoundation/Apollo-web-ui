import React from "react";
import NumericInput from "../../../../components/form-components/numeric-input1";
import AccountRSForm from "../../../../components/form-components/account-rs1";

const TransferForm = () => {

  return (
    <>
      <AccountRSForm
        name="recipient"
        label="Recipient"
        placeholder="Recipient"
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