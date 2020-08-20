/** ****************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ***************************************************************************** */

import React from 'react';
import { ONE_APL } from '../../../../../../constants';

export default function ExchangeItem(props) {
  const {
    setBlockInfo, decimals, height, subtype, rateATM, units,
  } = props;

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
        {((rateATM / ONE_APL) * (10 ** decimals)).toFixed(2)}
      </td>
      <td className="align-right">
        {(
          ((parseInt(units) / (10 ** decimals))) * ((rateATM / ONE_APL)) * (10 ** decimals)
        ).toFixed(2)}
      </td>
    </tr>
  );
}
