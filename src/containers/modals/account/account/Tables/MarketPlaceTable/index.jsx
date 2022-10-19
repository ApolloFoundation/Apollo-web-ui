import React from 'react';
import { getDGSGoodsAction } from '../../../../../../actions/marketplace';
import { AccountTableBase } from '..';
import Goods from './goods';

const headersList = [
  {
    name: 'Item',
    alignRight: false
  }, {
      name: 'Price',
      alignRight: false
  }, {
      name: 'QTY',
      alignRight: false
  },
];

export const MarketplaceTable = () => (
  <AccountTableBase
    headersList={headersList}
    className='no-min-height transparent'
    emptyMessage="This account doesn\'t have any goods."
    TableRowComponent={Goods}
    actionCallback={getDGSGoodsAction}
    keyField="goods"
  />
)