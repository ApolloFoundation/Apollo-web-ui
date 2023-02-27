/** ****************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ***************************************************************************** */

import React, { useMemo }from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setBodyModalParamsAction } from 'modules/modals';
import { useFormatTimestamp } from 'hooks/useFormatTimestamp';
import { numberToLocaleString } from 'helpers/format';
import { bigIntDecimalsDivision, bigIntDivision, bigIntMultiply } from 'helpers/util/bigNumberWrappers';
import { getDecimalsSelector } from 'selectors';

export default function ExecutedItem({
  transaction, sellerRS, timestamp, buyerRS,
  decimals, account, units, rateATM,
}) {
  const dispatch = useDispatch();
  const handleTime = useFormatTimestamp();
  const currentCoinDecimals = useSelector(getDecimalsSelector);

  const setModal = (data) => () => {
    dispatch(setBodyModalParamsAction('INFO_ACCOUNT', data));
  }

  const handleInfoTransactionModal = () => dispatch(setBodyModalParamsAction('INFO_TRANSACTION', transaction));
  const rate = useMemo(() => {
    const base = bigIntDivision(rateATM, currentCoinDecimals);
    return bigIntMultiply (base, 10 ** decimals);
  }, [decimals, rateATM]);
  const total = useMemo(
    () => {
      const base = bigIntDivision(rateATM, currentCoinDecimals);
      const baseMultiply = bigIntMultiply(base, units);
      const decimalsBase = 10 ** decimals;
      const totalUnits = bigIntMultiply(baseMultiply, decimalsBase);
      return  bigIntDivision(totalUnits, decimalsBase);
    }, [rate, units, decimals]
  );

  return (
    <tr>
      <td>
        <span className="blue-link-text" onClick={handleInfoTransactionModal}>
          {handleTime(timestamp)}
        </span>
      </td>
      <td onClick={setModal(sellerRS)}>
        <span className="blue-link-text">{sellerRS}</span>
      </td>
      <td onClick={setModal(buyerRS)}>
        <span className="blue-link-text">
          {buyerRS === account ? 'You' : buyerRS}
        </span>
      </td>
      <td className="align-right">
        {bigIntDecimalsDivision(units, decimals, 8)}
      </td>
      <td className="align-right">
        {numberToLocaleString (rate, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}
      </td>
      <td className="align-right">
        {numberToLocaleString(total, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}
      </td>
    </tr>
  );
}
