import React from 'react';
import { Accordion } from '../../../../../components/accordion';
import { Tooltip } from '../../../../../components/tooltip-login';
import SecretPhraseForm from '../../forms/viaSecretPhraseForm';
import { TooltipWrapper } from '../tooltipWrapper';

import styles from './index.module.scss';

export const StandartWallet = ({ active, onChange, id }) => {

  const tooltips = [
    {
      iconChecked: true,
      text: 'The most secure Apollo Wallet',
    },
    {
      iconChecked: true,
      text: 'You can log in to this wallet using your Account ID or secret phrase',
    },
    {
      iconChecked: false,
      text: '2FA is available only on the device where it was enabled',
    },
  ];

  return (
    <Accordion
      id={id}
      onSelectItem={onChange}
      currentState={active === id}
      header={
        <>
          <span className={styles.standartWalletText}>standard wallet</span>
          <Tooltip>
            <TooltipWrapper list={tooltips} />
          </Tooltip>
        </>
      }
    >
      <SecretPhraseForm /> 
    </Accordion>
  );
}