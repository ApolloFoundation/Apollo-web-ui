import React from 'react';
import { getTradesAction } from 'actions/trade-history';
import { AccountTableBase } from '..';
import Trade from './trade';

const headersList = [
  {
    name: 'Asset',
    alignRight: false
  }, {
      name: 'Date',
      alignRight: false
  }, {
      name: 'Type',
      alignRight: false
  }, {
      name: 'Quantity',
      alignRight: true
  }, {
      name: 'Price',
      alignRight: true
  }, {
      name: 'Total',
      alignRight: true
  }
];

export const TradeHistoryTable = () => (
  <AccountTableBase
    headersList={headersList}
    className='no-min-height transparent'
    emptyMessage="This account doesn\'t have any assets"
    TableRowComponent={Trade}
    actionCallback={getTradesAction}
    keyField="trades"
  />
)