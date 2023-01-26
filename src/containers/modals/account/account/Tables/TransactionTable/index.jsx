import React from 'react';
import ModalTransaction from '../../../../../account/modalTransactions/transaction';
import { getTransactionsAction } from '../../../../../../actions/transactions';
import { AccountTableBase } from '..';

const headersList = [
  {
    name: 'Date',
    alignRight: false
  }, {
      name: 'Type',
      alignRight: false
  }, {
      name: 'Amount',
      alignRight: true
  }, {
      name: 'Fee',
      alignRight: true
  }, {
      name: 'From',
      alignRight: false
  }, {
      name: 'To',
      alignRight: false
  }, {
      name: 'Height',
    alignRight: true
  }
];

export const TransactionTable = () => (
  <AccountTableBase
    headersList={headersList}
    className='no-min-height transparent'
    emptyMessage="This account doesn\'t have any transactions"
    TableRowComponent={ModalTransaction}
    actionCallback={getTransactionsAction}
    keyField="transactions"
  />
);