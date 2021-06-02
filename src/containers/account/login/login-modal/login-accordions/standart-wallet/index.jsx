import React from 'react';
import { Accordion } from 'containers/components/accordion';
import { Tooltip } from 'containers/components/tooltip';
import SecretPhraseForm from '../../forms/viaSecretPhraseForm';

export const StandartWallet = () => {
  return (
    <Accordion
      header={
        <div>
          standart wallet
          <Tooltip></Tooltip>
        </div>
      }
    >
      <SecretPhraseForm /> 
    </Accordion>
  );
}