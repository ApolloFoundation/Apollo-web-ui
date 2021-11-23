import React from "react";
import { useFormikContext } from "formik";
import TextualInputComponent from "../../../../components/form-components/textual-input1";
import NumericInput from "../../../../components/form-components/numeric-input1";

const ByForm = ({ ticker, onChangeAmount }) => {
  const { setFieldValue } = useFormikContext();
  return (
    <>
      <TextualInputComponent
        id="input-sender-buy-token"
        label="Sender"
        name="sender"
        placeholder="Currency Sender"
        type="text"
        disabled
      />
      <TextualInputComponent
        id="input-address-buy-token"
        name="address"
        label="Contract Address"
        placeholder="Contract Address"
        disabled
      />
      <div className="w-100">
        <div className="row w-100 m-0 justify-content-between align-items-center">
          <div className="col-5 p-0">
            <NumericInput
              id="input-amount-value-buy-token"
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
              id="input-amount-token-buy-token"
              label="Amount Token"
              type="float"
              name="token"
              defaultValue={0}
              disabled
            />
          </div>
        </div>
      </div>
      <NumericInput
        id="input-fuel-price-buy-token"
        label="Fuel price"
        name="fuelPrice"
        type="float"
        defaultValue={0}
      />
      <NumericInput
        id="input-fuel-limit-buy-token"
        label="Fuel limit"
        name="fuelLimit"
        type="float"
        defaultValue={0}
      />
    </>
  );
};

export default ByForm;
