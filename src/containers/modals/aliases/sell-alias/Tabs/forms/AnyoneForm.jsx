import React from 'react';
import TextualInputComponent from 'containers/components/form-components/TextualInput';
import NumericInputComponent from 'containers/components/form-components/NumericInput';

export const AnyoneForm = ({ alias }) => (
    <>
      {
          alias && 
          <TextualInputComponent
              label='Alias'
              text={alias.aliasName}
          />
      }
      <NumericInputComponent
          label='Price'
          name='priceATM'
          placeholder='Price'
      />
    </>
);