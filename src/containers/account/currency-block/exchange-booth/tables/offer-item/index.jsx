/** ****************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ***************************************************************************** */

import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getDecimalsSelector } from 'selectors';
import { setBodyModalParamsAction } from 'modules/modals';
import { bigIntDecimalsDivision, bigIntDivision, bigIntFormat, bigIntMultiply } from 'helpers/util/bigNumberWrappers';

export default function OfferItem({ decimals, accountRS, supply, limit, rateATM }) {
  const dispatch = useDispatch();

  const currentCoinDecimals = useSelector(getDecimalsSelector);

  const handleClick = useCallback(() => {
    dispatch(setBodyModalParamsAction('INFO_ACCOUNT', accountRS))
  }, [dispatch, accountRS]);

  return (
    <tr>
      <td onClick={handleClick}>
        <span className="blue-link-text">{accountRS}</span>
      </td>
      <td className="align-right">{bigIntFormat(bigIntDecimalsDivision(supply, decimals))}</td>
      <td className="align-right">{bigIntFormat(bigIntDecimalsDivision(limit, decimals))}</td>
      <td className="align-right">
        {
          bigIntFormat(
            bigIntDivision(
              bigIntMultiply(rateATM, 10 ** decimals),
              currentCoinDecimals
            )
          )
        }
      </td>
    </tr>
  );
}
