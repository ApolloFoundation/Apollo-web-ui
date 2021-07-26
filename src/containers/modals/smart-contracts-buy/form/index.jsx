import React from "react";
import { useFormikContext } from "formik";
import TextualInputComponent from "../../../components/form-components/textual-input1";
import NumericInput from "../../../components/form-components/numeric-input1";
import AccountRSForm from "../../../components/form-components/account-rs1";
import CheckboxFormInput from "../../../components/check-button-input";

const ByForm = ({
  switcher,
  ticker,
  onChangeSwither,
  onChangeAmount,
}) => {
  const { setFieldValue } = useFormikContext();
  return (
    <>
      <TextualInputComponent
        label="Sender"
        name="sender"
        placeholder="Currency Sender"
        type="text"
        disabled={true}
      />
      <AccountRSForm
        name="address"
        label="Contract Address"
        placeholder="Contract Address"
        disabled={true}
      />

      <div className="w-100">
        <div className="row w-100 m-0 justify-content-between align-items-center">
          <div className="col-5 p-0">
            <NumericInput
              label="Amount APL"
              name="value"
              type="float"
              counterLabel={ticker}
              defaultValue={0}
              onChange={onChangeAmount(setFieldValue)}
            />
          </div>
          <div className="col-auto">
            <i class="zmdi zmdi-swap zmdi-hc-2x"></i>
          </div>
          <div className="col-5 p-0">
            <NumericInput
              label="Amount Token"
              type="float"
              name="token"
              defaultValue={0}
              disabled={true}
            />
          </div>
        </div>
      </div>
      <CheckboxFormInput
        name="advance"
        label="Advanced settings"
        setValue={switcher}
        onChange={onChangeSwither}
      />
      {switcher ? (
        <>
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
      ) : null}
      <TextualInputComponent
        label="Secret phrase"
        type="password"
        placeholder="Secret Phrase"
        name="secret"
      />
    </>
  );
};

export default ByForm;
