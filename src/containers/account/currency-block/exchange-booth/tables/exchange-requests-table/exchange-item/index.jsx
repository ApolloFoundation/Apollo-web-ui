/** ****************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ***************************************************************************** */

import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getDecimalsSelector } from '../../../../../../../selectors';
import { getBlockAction } from '../../../../../../../actions/blocks';
import { setBodyModalParamsAction } from '../../../../../../../modules/modals';

export default function ExchangeItem({ decimals, height, subtype, rateATM, units, }) {
  const dispatch = useDispatch();

  const currentCoinDecimals = useSelector(getDecimalsSelector);

  const getBlock = async () => {
    const block = await dispatch(getBlockAction({ height }));

    if (block) {
      dispatch(setBodyModalParamsAction('INFO_BLOCK', block));
    }
  };

  return (
    <tr>
      <td>
        <span className="blue-link-text" onClick={getBlock}>
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
