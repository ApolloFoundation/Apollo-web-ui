import React from "react";

import NumericInput from "../../../../components/form-components/numeric-input1";
import TextualInputComponent from "../../../../components/form-components/textual-input1";
import CustomTextArea from "../../../../components/form-components/text-area1";
import FileInput from "../../../../components/form-components/file-input";

const CreateSmartContractForm = ({ setValue }) => {
  return (
    <>
      <FileInput showPreview />
      <CustomTextArea
        label="Contract"
        placeholder="Contract source"
        field={"source"}
        name="source"
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
      <NumericInput
        label="Amount"
        name="value"
        type="tel"
        setValue={setValue}
      />
      <NumericInput
        label="Fuel price"
        name="fuelPrice"
        type="tel"
        setValue={setValue}
      />
      <NumericInput
        label="Fuel limit"
        name="fuelLimit"
        type="tel"
        setValue={setValue}
      />
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
