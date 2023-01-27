import React from 'react';
import { getAccountCurrenciesAction } from 'actions/currencies';
import { AccountTableBase } from '..';
import Currency from './currency';

const headersList = [
  {
    name: 'Code',
    alignRight: false
  }, {
      name: 'Name',
      alignRight: false
  }, {
      name: 'Units',
      alignRight: false
  },
];

export const CurrenciesTable = () => (
  <AccountTableBase
    headersList={headersList}
    className='no-min-height transparent'
    emptyMessage="This account doesn\'t have any currencies."
    TableRowComponent={Currency}
    actionCallback={getAccountCurrenciesAction}
    keyField="accountCurrencies"
  />
)