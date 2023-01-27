import React from 'react';
import { getAliasesAction } from 'actions/currencies';
import { AccountTableBase } from '..';
import Alias from './alias';

const headersList = [
  {
    name: 'Alias',
    alignRight: false
  }, {
      name: 'URI',
      alignRight: false
  },
];

export const AliasesTable = () => (
  <AccountTableBase
    headersList={headersList}
    className='no-min-height transparent'
    emptyMessage="This account doesn\'t have any aliases."
    TableRowComponent={Alias}
    actionCallback={getAliasesAction}
    keyField="aliases"
  />
);
