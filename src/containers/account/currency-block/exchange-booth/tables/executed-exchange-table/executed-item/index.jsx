/** ****************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ***************************************************************************** */

import React, { useMemo }from 'react';
import { useDispatch } from 'react-redux';
import { numberToLocaleString } from 'helpers/format';
import { formatTimestamp } from '../../../../../../../helpers/util/time';
import { setBodyModalParamsAction } from '../../../../../../../modules/modals';

export default function ExecutedItem(props) {
  const dispatch = useDispatch();

  const {
    transaction, sellerRS, timestamp, buyerRS,
    decimals, account, units, rateATM,
  } = props;

  const setModal = (data) => () => {
    dispatch(setBodyModalParamsAction('INFO_ACCOUNT', data))
  }

  const rate = useMemo(() => (rateATM / (10 ** 8)) * (10 ** decimals), [decimals, rateATM]);
  const total = useMemo(
    () => (((rateATM / (10 ** 8)) * units) / (10 ** decimals)) * (10 ** decimals),
    [rate, units, decimals]
  );

  return (
    <tr>
      <td>
        <span className="blue-link-text" onClick={() => dispatch(setBodyModalParamsAction('INFO_TRANSACTION', transaction))}>
          {dispatch(formatTimestamp(timestamp))}
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
        {(units / (10 ** decimals)).toFixed(8)}
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
