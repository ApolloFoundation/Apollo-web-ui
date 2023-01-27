import React from 'react';
import { getAccountLedgerAction } from 'actions/ledger';
import { AccountTableBase } from '..';
import Entry from './ledger-entry';

const headersList = [
  {
    name: 'Entry',
    alignRight: false
  }, {
      name: 'Type',
      alignRight: false
  }, {
      name: 'Change',
      alignRight: true
  }, {
      name: 'Balance',
      alignRight: true
  }, {
      name: 'Holding',
      alignRight: true
  }, {
      name: 'Change',
      alignRight: true
  }, {
      name: 'Balance',
      alignRight: true
  }
];

export const LedgerTable = () => (
  <AccountTableBase
    headersList={headersList}
    className='no-min-height transparent'
    emptyMessage="'This account doesn\'t have any ledger'"
    TableRowComponent={Entry}
    actionCallback={getAccountLedgerAction}
    keyField="entries"
  />
);