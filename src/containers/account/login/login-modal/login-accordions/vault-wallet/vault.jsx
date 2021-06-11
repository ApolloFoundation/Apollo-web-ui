import React from 'react';
import { Accordion } from '../../../../../components/accordion';
import { Tooltip } from '../../../../../components/tooltip';
import ShieldIcon from '../../../../../../assets/shield-check.svg';
import AccountIdForm from '../../forms/viaAccountIdForm';
import { TooltipWrapper } from '../tooltipWrapper';

import styles from './index.module.scss';

export const VaultAccordion = ({ active, onChange, id }) => {

  const tooltips = [
    {
      iconChecked: true,
      text: 'The most secure Apollo Wallet',
    },
    {
      iconChecked: true,
      text: 'You can log in using your Account ID',
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
      header={(
        <div className={styles.vaultHeader}>
          <span>vault wallet</span>
          <figure className={styles.vaultIconWrapper}>
            <img className={styles.vaultIcon} src={ShieldIcon} alt='shield' />
          </figure>
          <Tooltip>
            <TooltipWrapper list={tooltips} />
          </Tooltip>
        </div>
      )}
    >
      <AccountIdForm /> 
    </Accordion>
  );
}