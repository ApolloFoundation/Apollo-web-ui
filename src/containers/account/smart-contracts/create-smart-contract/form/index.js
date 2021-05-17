import React from "react";

import NumericInput from "../../../../components/form-components/numeric-input1";
import TextualInputComponent from "../../../../components/form-components/textual-input1";
import CustomTextArea from "../../../../components/form-components/text-area1";
import FileInput from "../../../../components/form-components/file-input";

const CreateSmartContractForm = ({ setValue, ticker }) => {
  return (
    <>
      <FileInput showPreview name="source" />
      <CustomTextArea
        label="Contract"
        placeholder="Contract source"
        field={"source"}
        name="source"
        rows={15}
        setValue={setValue}
      />
      <TextualInputComponent
        label="Contract name"
        name="name"
        placeholder="Contract class name"
        type="text"
        setValue={setValue}
      />
      <TextualInputComponent
        label="Arguments"
        name="params"
        placeholder="Some comma-separated values"
        type="text"
        setValue={setValue}
      />
      <div className={"row"}>
        <div className={"col-md-4 p-sm-0 pr-md-2"}>
          <NumericInput
            label="Amount APL"
            name="value"
            type="float"
            counterLabel={ticker}
            setValue={setValue}
          />
        </div>

        <div className={"col-md-4 p-sm-0 pr-md-2"}>
          <NumericInput
            label="Fuel price"
            name="fuelPrice"
            type="tel"
            setValue={setValue}
          />
        </div>
        <div className={"col-md-4 p-sm-0"}>
          <NumericInput
            label="Fuel limit"
            name="fuelLimit"
            type="tel"
            setValue={setValue}
          />
        </div>
      </div>
      <TextualInputComponent
        label="Secret phrase"
        type="password"
        placeholder="Secret Phrase"
        name="secret"
        setValue={setValue}
      />
    </>
  );
};

export default CreateSmartContractForm;
