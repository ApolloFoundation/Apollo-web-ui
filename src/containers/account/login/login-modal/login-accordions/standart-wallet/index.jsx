import React from 'react';
import { Accordion } from 'containers/components/accordion';
import { Tooltip } from 'containers/components/tooltip';
import SecretPhraseForm from '../../forms/viaSecretPhraseForm';
import { TooltipWrapper } from '../tooltipWrapper';

import styles from './index.module.scss';

export const StandartWallet = ({ active, onChange, id }) => {
  const tooltips = [
    {
      iconChecked: true,
      text: 'You can log in to this wallet using only your secret phrase',
    },
    {
      iconChecked: true,
      text: 'Available to use from any device',
    },
    {
      iconChecked: true,
      text: 'The wallet is encrypted (via Secret File) on one device.',
    },
    {
      iconChecked: true,
      text: 'You can export/import your Secret File to use on other devices.',
    },
    {
      iconChecked: true,
      text: '2FA works from any device when you use your Vault.',
    },
    {
      iconChecked: false,
      text: 'If you lose your device or uninstall the wallet before exporting your secret file, you will lose access to your account.',
    },
  ];

  return (
    <Accordion
      id={id}
      onSelectItem={onChange}
      currentState={active === id}
      header={
        <div>
          <span className={styles.standartWalletText}>standart wallet</span>
          <Tooltip>
            <TooltipWrapper list={tooltips} />
          </Tooltip>
        </div>
      }
    >
      <SecretPhraseForm /> 
    </Accordion>
  );
}