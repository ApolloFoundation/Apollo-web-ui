/** ****************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ***************************************************************************** */

import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getDecimalsSelector } from 'selectors';
import { getBlockAction } from 'actions/blocks';
import { setBodyModalParamsAction } from 'modules/modals';
import { bigIntDecimalsDivision, bigIntDivision, bigIntMultiply, bigIntFormat } from 'helpers/util/bigNumberWrappers';

export default function ExchangeItem({ decimals, height, subtype, rateATM, units, }) {
  const dispatch = useDispatch();

  const currentCoinDecimals = useSelector(getDecimalsSelector);

  const getBlock = async () => {
    const block = await dispatch(getBlockAction({ height }));

    if (block) {
      dispatch(setBodyModalParamsAction('INFO_BLOCK', block));
    }
  };

  const unitsCalculated = bigIntDecimalsDivision(units, decimals);
  const rateBase = bigIntDivision(rateATM, currentCoinDecimals);
  const rate = bigIntDecimalsDivision(rateBase, decimals);
  const total = bigIntMultiply(unitsCalculated, rate)

  return (
    <tr>
      <td>
        <span className="blue-link-text" onClick={getBlock}>
          {height}
        </span>
      </td>
      <td>{subtype === 5 ? 'buy' : 'sell'}</td>
      <td className="align-right">{bigIntFormat(unitsCalculated)}</td>
      <td className="align-right">{bigIntFormat(rate)}</td>
      <td className="align-right">{bigIntFormat(total)}</td>
    </tr>
  );
}
