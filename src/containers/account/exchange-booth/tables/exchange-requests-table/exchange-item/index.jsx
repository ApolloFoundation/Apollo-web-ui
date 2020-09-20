/** ****************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ***************************************************************************** */

import React from 'react';
import { useSelector } from 'react-redux';

export default function ExchangeItem(props) {
  const {
    setBlockInfo, decimals, height, subtype, rateATM, units,
  } = props;

  const { decimals: currentCoinDecimals } = useSelector(state => state.account);

  return (
    <tr>
      <td>
        <span className="blue-link-text" onClick={() => setBlockInfo('INFO_BLOCK', height)}>
          {height}
        </span>
      </td>
      <td>
        {subtype === 5 ? 'buy' : 'sell'}
      </td>
      <td className="align-right">
        {(parseInt(units) / (10 ** decimals)).toFixed(8)}
      </td>
      <td className="align-right">
        {((rateATM / currentCoinDecimals) * (10 ** decimals)).toFixed(2)}
      </td>
      <td className="align-right">
        {(
          ((parseInt(units) / (10 ** decimals))) * ((rateATM / currentCoinDecimals)) * (10 ** decimals)
        ).toFixed(2)}
      </td>
    </tr>
  );
}
