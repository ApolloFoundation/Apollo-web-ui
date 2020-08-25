import React from 'react';
import { useFormikContext } from 'formik';

import NumericInput from '../../../../components/form-components/numeric-input1';
import TextualInputComponent from '../../../../components/form-components/textual-input1';
import CheckboxFormInput from '../../../../components/check-button-input';
import CustomTextArea from '../../../../components/form-components/text-area1';
import BlockHeightInput from '../../../../components/form-components/block-height-input1';

const IssueCurrencyForm = () => {
  const { values } = useFormikContext();

  const checkboxes = [
    {
      label: 'Exchangeable',
      name: 'type1',
    },
    {
      label: 'Controllable',
      name: 'type2',
    },
    {
      label: 'Reservable',
      name: 'type3',
    },
    {
      label: 'Claimable',
      name: 'type4',
    },
    {
      label: 'Mintable',
      name: 'type5',
    },
    {
      label: 'Non-Shuffleable',
      name: 'type6',
    },
  ];

  return (
    <>
      <TextualInputComponent
        label="Currency Name"
        // disabled={false}
        name="name"
        placeholder="Currency Name"
        type="text"
      />

      <TextualInputComponent
        label="Currency Code"
        // disabled={false}
        name="code"
        placeholder="Currency Code"
        type="text"
      />
      <CustomTextArea
        label="Description"
        name="description"
        placeholder="Description"
      />
      {checkboxes.map(checkBox => (
        <CheckboxFormInput
          labelGroup={checkBox.label}
          name={checkBox.name}
        />
      ))}
      {values.type3 && (
        <>
          <NumericInput
            label="Minimum Amount to Reserve Per Unit"
            name="minReservePerUnitATM"
            countingTtile="APL"
            placeholder="Minimum Amount Per Unit"
            type="tel"
          />

          <NumericInput
            label="Reserve Supply"
            name="reserveSupply"
            countingTtile="APL"
            placeholder="Number of Units"
            type="tel"
          />
        </>
      )}
      {values.type5 && (
        <>
          <NumericInput
            label="Minimum Difficulty"
            name="minDifficulty"
            countingTtile="APL"
            placeholder="Minimum Difficulty"
            type="tel"
          />

          <NumericInput
            label="Maximum Difficulty"
            name="maxDifficulty"
            countingTtile="APL"
            placeholder="Maximum Difficulty"
            type="tel"
          />
        </>
      )}
      <NumericInput
        label="Initial Supply"
        name="initialSupply"
        countingTtile="APL"
        placeholder="Initial Supply"
        type="tel"
      />
      <NumericInput
        label="Total Supply"
        name="maxSupply"
        countingTtile="APL"
        placeholder="Total Supply"
        type="tel"
      />
      <NumericInput
        label="Decimals"
        name="decimals"
        placeholder="Decimals"
        type="tel"
      />
      <BlockHeightInput
        label="Activation Height"
        name="height"
        placeholder="Activation height"
      />
    </>
  );
};

export default IssueCurrencyForm;
