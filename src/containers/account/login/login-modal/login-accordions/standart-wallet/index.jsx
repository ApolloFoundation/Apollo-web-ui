import React from 'react';
import { Accordion } from 'containers/components/accordion';
import { Tooltip } from 'containers/components/tooltip';
import SecretPhraseForm from '../../forms/viaSecretPhraseForm';

export const StandartWallet = ({ active, onChange, id }) => {
  return (
    <Accordion
      id={id}
      onSelectItem={onChange}
      currentState={active === id}
      header={
        <div>
          <span>standart wallet</span>
          <Tooltip></Tooltip>
        </div>
      }
    >
      <SecretPhraseForm /> 
    </Accordion>
  );
}